import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient as createWSClient } from "graphql-ws";
import { Kind, OperationTypeNode } from "graphql";
import { getAccessToken } from '../auth';

const GRAPHQL_URL = 'http://localhost:9000/graphql';

const httpLink = new HttpLink({
  uri: GRAPHQL_URL
})

const wsLink = new GraphQLWsLink(createWSClient({
  url: 'ws://localhost:9000/graphql',
  connectionParams: () => ({
    accessToken: getAccessToken(),
  })
}));

function isSubscription({ query }) {
  console.log("--->", query);

  const definition = getMainDefinition(query);
  return definition.kind === Kind.OPERATION_DEFINITION
    && definition.operation === OperationTypeNode.SUBSCRIPTION
}

export const client = new ApolloClient({
  //uri: GRAPHQL_URL,
  link: split(isSubscription, wsLink, httpLink),
  cache: new InMemoryCache(),
});

export default client;
