"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = exports.message = exports.greeting = exports.default = void 0;
const message = 'message from module';
exports.message = message;
const name = "jhony";
exports.name = name;
const location = "colombia";
exports.default = location;

const greeting = name => {
  return `Greeting ${name}`;
};

exports.greeting = greeting;