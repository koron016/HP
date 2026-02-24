const { postTweet, postThread, postScheduledTweet } = require("./poster");
const { getClient, verifyCredentials } = require("./client");
const {
  addPost,
  getPost,
  listPosts,
  getScheduledPosts,
  markPosted,
  markFailed,
  updatePost,
  deletePost,
} = require("./db");
const { startScheduler } = require("./scheduler");

module.exports = {
  // 投稿
  postTweet,
  postThread,
  postScheduledTweet,

  // クライアント
  getClient,
  verifyCredentials,

  // データベース操作
  addPost,
  getPost,
  listPosts,
  getScheduledPosts,
  markPosted,
  markFailed,
  updatePost,
  deletePost,

  // スケジューラー
  startScheduler,
};
