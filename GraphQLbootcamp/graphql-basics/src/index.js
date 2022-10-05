import path from "path";
import fs from "fs"

import { createServer, createPubSub } from '@graphql-yoga/node'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'
import Subscription from './resolvers/Subscription'

const pubSub = createPubSub()

const server = createServer({
    schema: {
        typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
        resolvers: {
            Query,
            Mutation,
            Subscription,
            User,
            Post,
            Comment
        },
    },
    context: {
        db,
        pubSub
    }
})

server.start(() => {
    console.log('The server is up!')
})