import { GraphQLError } from 'graphql';
// Use the generated `QueryResolvers` type to type check our queries!
const queries = {
    Query: {
        // Our third argument (`contextValue`) has a type here, so we
        // can check the properties within our resolver's shared context value.
        books: async (parent, args, context, info) => {
            if (context.authScope !== 'ADMIN') {
                throw new GraphQLError('not admin!', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            return context.db.getBooks();
        },
    },
};
export default queries;
