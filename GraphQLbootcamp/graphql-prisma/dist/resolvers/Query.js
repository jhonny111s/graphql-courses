"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const Query = {
  async users(parent, args, {
    db,
    prisma
  }, info) {
    if (!args.query) {
      return await prisma.user.findMany();
    }

    return prisma.user.findMany({
      where: {
        name: args.query.toLowerCase()
      }
    });
  },

  async posts(parent, args, {
    db,
    prisma
  }, info) {
    if (!args.query) {
      return await prisma.post.findMany({
        where: {
          published: {
            equals: true
          }
        }
      });
    }

    return prisma.post.findMany({
      where: {
        published: {
          equals: true
        },
        OR: [{
          title: {
            contains: args.query.toLowerCase()
          }
        }, {
          body: {
            contains: args.query.toLowerCase()
          }
        }]
      }
    });
  },

  comments(parent, args, {
    db,
    prisma
  }, info) {
    return prisma.comment.findMany();
  }

};
exports.default = Query;