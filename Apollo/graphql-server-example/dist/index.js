import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { DB } from './db.js';
import { readFile } from 'fs/promises';
import resolvers from './resolvers/index.js';
// ------------------
/* const typeDefs = `#graphql

    type Author {
        name: String
        books: [Book]
    }

    type Book {
        title: String
        author: String
    }

    type Query {
        books:[Book]
       

    }
`; */
const typeDefs = await readFile('./schema.graphql', { encoding: 'utf-8' });
/* const resolvers = {
  Query: {
    books: (parent, args, context, info) => {
      if (context.authScope !== 'ADMIN') {
        throw new GraphQLError('not admin!', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      return books;
    },
  },
}; */
// ------------------
const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => ({
        authScope: 'ADMIN',
        db: new DB(),
    }),
});
console.log(`🚀  Server ready at: ${url}`);
