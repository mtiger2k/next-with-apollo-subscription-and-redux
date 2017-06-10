import { makeExecutableSchema } from 'graphql-tools'
import { withFilter, PubSub } from 'graphql-subscriptions'
import jwt from 'jwt-simple';
import PostModel from './Post'
import UserModel from './User'
import logger from './logger'

const fs = require('fs');

const pubsub = new PubSub()
const typeDefs = [`

  type User {
    id: String!
    username: String!
    dispName: String!
  }

  type UserToken {
    userId: String!,
    token: String!,
    user: User
  }

  type Post {
    id: String
    title: String
    votes: Int
    url: String
    createdAt: String
  }

  type Count {
    count: Int
  }

  enum OrderPost {
    createdAt_DESC
  }

  input Upload {
    name: String!
    type: String!
    size: Int!
    path: String!
  }

  type File {
    name: String!
    type: String!
    size: Int!
    path: String!
  }

  type Query {
    me: User
    allPosts(orderBy: OrderPost, skip: Int, first: Int): [Post]
    _allPostsMeta: Count
  }

  type Mutation {
    login(username: String!, password: String!): UserToken
    register(dispName: String, username: String, password: String): User
    createPost(title: String, url: String): Post
    updatePost(id: String, votes: Int): Post
    singleUpload (file: Upload!): File!
    multipleUpload (files: [Upload!]!): [File!]!
  }

  type Subscription {
    postAdded: Post
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`]
let nextMessage = 4

const resolvers = {
  Query: {
    me: (root, args) => {
        return root.user;
    },
    allPosts: (root, {orderBy, skip, first}, context) => {
      return PostModel.find({}, null, {skip, limit: first});
    },
    _allPostsMeta: () => {
      return new Promise((resolve, reject) => {
        PostModel.find().count((err, count) => {
          resolve({count})
        });
      });

      
    }
  },
  Mutation: {
    login: (root, args) => {
        return UserModel.findOne({username: args.username})
        .then((user) => {
            if (!user || !user.validPassword(args.password)) {
                throw new Error("Username or password not match");
            }

            return Promise.resolve({
                userId: user._id,
                token: jwt.encode({ sub: user._id, iat: new Date().getTime(), login: user.username, }, process.env.SECRET)
            });
        });
    },
    register: (root, args) => {
        return UserModel.findOne({username: args.username})
        .then((user) => {
            if (user) {
                throw new Error("Username already exist");
            }

            return (new UserModel(args)).save();
        });            
    },
    createPost (root, {title, url}) {
      return new Promise((resolve, reject) => {
        let newPost = new PostModel({title, url, createdAt: new Date(), votes: 0});
        newPost.save().then((post) => {
          pubsub.publish('postAdded', {postAdded: post})
          resolve(post);
        }).error((err) => {
          reject("failed to create post")
        });
      });
    },
    updatePost (root, {id, votes}) {
      return PostModel.findOneAndUpdate({_id: id}, {$set: {votes}}, {new: true});
    },
    singleUpload (_, {file}) {
      fs.rename(file.path, '/your/upload/' + file.name, function (err) {
          console.log('uploaded: ' + file.name);
          if (err) {
            console.log(err)
          }
      })
      return {...file};
    },
    multipleUpload (_, {files}) {
      files.map(file => console.log(`uploaded size is ${file.size}`))
      return [...files];
    }
  },
  Subscription: {
    postAdded: {
      subscribe: withFilter(
        () => {
          logger.info('post subscribed!')
          return pubsub.asyncIterator('postAdded')
        },
        (payload) => {
          logger.debug('new post', payload)
          return true
        }
      )
    }    
  },
  UserToken: {
      user(userToken) {
          return UserModel.findById(userToken.userId);
      }
  }

}

export const schema = makeExecutableSchema({
  typeDefs, resolvers
})
