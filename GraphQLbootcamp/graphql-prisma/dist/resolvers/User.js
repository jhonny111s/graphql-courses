"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const User = {
  posts(parent, args, {
    db
  }, info) {
    return db.posts.filter(post => {
      return post.author === parent.id;
    });
  },

  comments(parent, args, {
    db
  }, info) {
    return db.comments.filter(comment => {
      return comment.author === parent.id;
    });
  }

};
exports.default = User;