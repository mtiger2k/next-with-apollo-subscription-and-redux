import express from 'express'
import { createServer } from 'http'
import cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import bodyParser from 'body-parser'
import { execute, subscribe } from 'graphql'
import { schema } from './schema'

import mongoose from 'mongoose'
// DB Setup
const mongoUri = process.env.MONGODB_URL || "mongodb://localhost/postDB";

mongoose.Promise = require('bluebird');
mongoose.connect(mongoUri, function(err) {
  if(err) {
    console.log("connection error", err +" on "+mongoUri);
  } else {
    console.log("connection to "+mongoUri+" successful")
  }
});


const graphqlPath = '/graphql'
const graphiqlPath = '/graphiql'
const graphqlOptions = {schema}
const subscriptionsPath = '/subscriptions'

const graphiqlOptions = {
  endpointURL: graphqlPath,
  subscriptionsEndpoint: 'ws://localhost:4000' + subscriptionsPath
}


  const server = express()
  const httpServer = createServer(server)

  server.use(graphqlPath, cors(), bodyParser.json(), graphqlExpress(req => {
    const query = req.query.query || req.body.query
    if (query && query.length > 2000) {
      throw new Error('Query too large.')
    }

    return {...graphqlOptions}
  }))

  server.use(graphiqlPath, graphiqlExpress(graphiqlOptions))

  httpServer.listen(4000, '0.0.0.0', (err) => {
    if (err) throw err
    console.log('> ready on localhost:3000')
  })

  new SubscriptionServer(
    {
      schema,
      execute,
      subscribe,
      onConnect () {
        console.log('Client connected')
      },
      onDisconnect () {
        console.log('Client disconnected')
      }
    },
    {server: httpServer, path: subscriptionsPath}
  )

