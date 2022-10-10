"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const Subscription = {
  count: {
    subscribe(parent, args, {
      pubSub
    }, info) {
      let count = 0;
      setInterval(() => {
        count++;
        pubSub.publish('count', {
          count
        });
      }, 1000);
      return pubSub.subscribe('count');
    }

  },
  comment: {
    subscribe(parent, {
      postId
    }, {
      db,
      pubSub
    }, info) {
      const post = db.posts.find(post => post.id === postId && post.published);

      if (!post) {
        throw new Error('Post not found');
      }

      return pubSub.subscribe(`comment ${postId}`);
    }

  },
  post: {
    subscribe(parent, args, {
      pubSub
    }, info) {
      return pubSub.subscribe('post');
    }

  }
};
exports.default = Subscription;