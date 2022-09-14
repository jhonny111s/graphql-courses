import { ApolloServer, gql } from "apollo-server";

// interfaces and types
const typeDefs = gql`
    # by default is not necesary
    # schema{
    #     query: Query
    # }

    type Query {
        greeting: String
    }
`;

console.log(typeDefs);


// function, actual values
const resolvers = {
    Query: {
        greeting: () => 'Hello world'
    }
}


const server = new ApolloServer({ typeDefs, resolvers });
const { url } = server.listen({ port: 9000 });
console.log(`Server running at ${url}`);