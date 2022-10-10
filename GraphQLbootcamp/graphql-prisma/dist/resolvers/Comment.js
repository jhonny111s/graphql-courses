"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const Comment = {
  author(parent, args, {
    db
  }, info) {
    return db.users.find(user => {
      return user.id === parent.author;
    });
  },

  post(parent, args, {
    db
  }, info) {
    return db.posts.find(post => {
      return post.id === parent.post;
    });
  }

};
exports.default = Comment;