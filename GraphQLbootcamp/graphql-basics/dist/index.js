"use strict";

var _node = require("@graphql-yoga/node");

const typeDefs0 = `
    type Query {
        hello: String!
        name: String!
    }
`;
const resolvers0 = {
  Query: {
    hello: () => 'Hello from Yoga!',
    name: () => 'jhony'
  }
};
const typeDefs = `
    type Query {
       id: ID!
       name: String!
       age: Int!
       employed: Boolean!
       gpa: Float
    }
`;
const resolvers = {
  Query: {
    id: () => '12344',
    name: () => 'jhony',
    age: () => 34,
    employed: () => true,
    gpa: () => null
  }
};
const server = (0, _node.createServer)({
  schema: {
    typeDefs,
    resolvers
  }
});
server.start();