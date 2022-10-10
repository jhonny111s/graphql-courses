"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const Post = {
  author(parent, args, {
    db
  }, info) {
    return db.users.find(user => {
      return user.id === parent.author;
    });
  },

  comments(parent, args, {
    db
  }, info) {
    return db.comments.filter(comment => {
      return comment.post === parent.id;
    });
  }

};
exports.default = Post;