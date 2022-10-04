import path from "path";
import fs from "fs"

import { createServer } from '@graphql-yoga/node'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'



const server = createServer({
    schema: {
        typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
        resolvers: {
            Query,
            Mutation,
            User,
            Post,
            Comment
        },
    },
    context: {
        db
    }
})

server.start(() => {
    console.log('The server is up!')
})