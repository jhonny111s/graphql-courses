"use strict";

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _node = require("@graphql-yoga/node");

var _client = require("@prisma/client");

var _db = _interopRequireDefault(require("./db"));

var _Query = _interopRequireDefault(require("./resolvers/Query"));

var _Mutation = _interopRequireDefault(require("./resolvers/Mutation"));

var _User = _interopRequireDefault(require("./resolvers/User"));

var _Post = _interopRequireDefault(require("./resolvers/Post"));

var _Comment = _interopRequireDefault(require("./resolvers/Comment"));

var _Subscription = _interopRequireDefault(require("./resolvers/Subscription"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pubSub = (0, _node.createPubSub)();
const prisma = new _client.PrismaClient();
const server = (0, _node.createServer)({
  schema: {
    typeDefs: _fs.default.readFileSync(_path.default.join(__dirname, 'schema.graphql'), 'utf-8'),
    resolvers: {
      Query: _Query.default,
      Mutation: _Mutation.default,
      Subscription: _Subscription.default,
      User: _User.default,
      Post: _Post.default,
      Comment: _Comment.default
    }
  },
  context: {
    db: _db.default,
    pubSub,
    prisma
  },
  logging: true,
  maskedErrors: true
});
server.start(() => {
  console.log('The server is up!');
});