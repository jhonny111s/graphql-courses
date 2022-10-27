const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Review @key(fields: "id") {
    id: ID!
    body: String
    """
    The @provides directive indicates that a particular field can be resolved by a subgraph at a particular query path. Let's look at an example.
    """
    author: User @provides(fields: "username")
    product: Product
  }

  extend type User @key(fields: "id")  {
    id: ID! @external
    username: String! @external
    reviews: [Review]
  }

  extend type Product @key(fields: "upc") {
    upc: String! @external
    reviews: [Review]
  }
`;

const resolvers = {
  Review: {
    // need identify user because User subgraph resolved it
    // review return authorID = 1 but we need author = {id: 1}
    author(review) {
      console.log(`[REVIEW-subgraph][review]--> author: identify author for this review (review.authorID [${review.authorID}])`);
      return { __typename: "User", id: review.authorID };
    },
    // review return product = {upc: 1} is because of that it doesn't need resolver
    /*    
    product(pes) {
         console.log("--->", pes);
       } 
    */
  },
  User: {
    reviews(user) {
      console.log("[REVIEW-subgraph][user]--> reviews: resolving reviews for specific User " + user.id);
      return reviews.filter(review => review.authorID === user.id);
    },
    numberOfReviews(user) {
      console.log('USER:numberOfReviews', user);
      return reviews.filter(review => review.authorID === user.id).length;
    },
    username(user) {
      console.log("[REVIEW-subgraph][user] Inside review subgraph it can resolved user.username more quickly");
      const found = usernames.find(username => username.id === user.id);
      return found ? found.username : null;
    }
  },
  Product: {
    reviews(product) {
      console.log("[REVIEW-subgraph][product]--> reviews: resolving reviews for specific User " + user.id);
      return reviews.filter(review => review.product.upc === product.upc);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const usernames = [
  { id: "1", username: "@ada" },
  { id: "2", username: "@complete" }
];
const reviews = [
  {
    id: "1",
    author: { id: "1" },
    authorID: "1",
    product: { upc: "1" },
    body: "Love it!"
  },
  {
    id: "2",
    authorID: "1",
    product: { upc: "2" },
    body: "Too expensive."
  },
  {
    id: "3",
    authorID: "2",
    product: { upc: "3" },
    body: "Could be better."
  },
  {
    id: "4",
    authorID: "2",
    product: { upc: "1" },
    body: "Prefer something else."
  }
];
