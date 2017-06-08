import { makeExecutableSchema } from 'graphql-tools'
import { withFilter, PubSub } from 'graphql-subscriptions'

import PostModel from './Post'

const pubsub = new PubSub()
const typeDefs = [`

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

  type Query {
    allPosts(orderBy: OrderPost, skip: Int, first: Int): [Post]
    _allPostsMeta: Count
  }

  type Mutation {
    createPost(title: String, url: String): Post
    updatePost(id: String, votes: Int): Post
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
    }
  },
  Subscription: {
    postAdded: {
      subscribe: withFilter(
        () => {
          console.log('post subscribed!')
          return pubsub.asyncIterator('postAdded')
        },
        (payload) => {
          console.log('new post', payload)
          return true
        }
      )
    }    
  }
}

export const schema = makeExecutableSchema({
  typeDefs, resolvers
})
