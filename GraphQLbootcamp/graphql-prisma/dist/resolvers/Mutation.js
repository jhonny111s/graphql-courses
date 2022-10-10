"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _uuid = require("uuid");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Mutation = {
  async createUser(parent, args, {
    db,
    prisma
  }, info) {
    const emailTaken = await prisma.user.findFirst({
      where: {
        email: args.data.email
      }
    });

    if (emailTaken) {
      console.log("error");
      throw new Error('Email taken');
    }

    const user = await prisma.user.create({
      data: _objectSpread({}, args.data)
    });
    return user;
  },

  deleteUser: async (parent, args, {
    db,
    prisma
  }, info) => {
    try {
      console.log(args.id);
      const user = await prisma.user.findFirstOrThrow({
        where: {
          id: parseInt(args.id)
        }
      });
      console.log("user", user);
      return user;
    } catch (error) {
      console.log(error);
      throw new Error("error.message");
    } // const userIndex = db.users.findIndex((user) => user.id === args.id)
    // if (userIndex === -1) {
    //     throw new Error('User not found')
    // }
    // const deletedUsers = db.users.splice(userIndex, 1)
    // db.posts = db.posts.filter((post) => {
    //     const match = post.author === args.id
    //     if (match) {
    //         db.comments = db.comments.filter((comment) => comment.post !== post.id)
    //     }
    //     return !match
    // })
    // db.comments = db.comments.filter((comment) => comment.author !== args.id)
    // return deletedUsers[0]

  },

  updateUser(parent, args, {
    db
  }, info) {
    const {
      id,
      data
    } = args;
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email);

      if (emailTaken) {
        throw new Error('Email taken');
      }

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }

    return user;
  },

  createPost(parent, args, {
    db,
    pubSub
  }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);

    if (!userExists) {
      throw new Error('User not found');
    }

    const post = _objectSpread({
      id: (0, _uuid.v4)()
    }, args.data);

    db.posts.push(post);

    if (args.data.published) {
      pubSub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      });
    }

    return post;
  },

  deletePost(parent, args, {
    db,
    pubSub
  }, info) {
    const postIndex = db.posts.findIndex(post => post.id === args.id);

    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    const [post] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(comment => comment.post !== args.id);

    if (post.published) {
      pubSub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      });
    }

    return post;
  },

  updatePost(parent, args, {
    db,
    pubSub
  }, info) {
    const {
      id,
      data
    } = args;
    const post = db.posts.find(post => post.id === id);

    const originalPost = _objectSpread({}, post);

    if (!post) {
      throw new Error('Post not found');
    }

    if (typeof data.title === 'string') {
      post.title = data.title;
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubSub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        pubSub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        });
      }
    } else if (post.published) {
      pubSub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      });
    }

    return post;
  },

  createComment(parent, args, {
    db,
    pubSub
  }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    const postExists = db.posts.some(post => post.id === args.data.post && post.published);

    if (!userExists || !postExists) {
      throw new Error('Unable to find user and post');
    }

    const comment = _objectSpread({
      id: (0, _uuid.v4)()
    }, args.data);

    db.comments.push(comment);
    pubSub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    });
    return comment;
  },

  deleteComment(parent, args, {
    db,
    pubSub
  }, info) {
    const commentIndex = db.comments.findIndex(comment => comment.id === args.id);

    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);
    pubSub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment
      }
    });
    return deletedComment;
  },

  updateComment(parent, args, {
    db,
    pubSub
  }, info) {
    const {
      id,
      data
    } = args;
    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    pubSub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    });
    return comment;
  }

};
exports.default = Mutation;