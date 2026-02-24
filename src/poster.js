const { getClient } = require("./client");
const { markPosted, markFailed } = require("./db");

async function postTweet(text) {
  const client = getClient();
  const result = await client.v2.tweet(text);
  return result.data;
}

async function postThread(texts) {
  const client = getClient();
  const tweets = [];

  let lastTweetId = null;
  for (const text of texts) {
    const options = lastTweetId ? { reply: { in_reply_to_tweet_id: lastTweetId } } : {};
    const result = await client.v2.tweet(text, options);
    tweets.push(result.data);
    lastTweetId = result.data.id;
  }

  return tweets;
}

async function postScheduledTweet(post) {
  try {
    const result = await postTweet(post.content);
    markPosted(post.id, result.id);
    console.log(`[投稿成功] ID:${post.id} => Tweet ID:${result.id}`);
    return result;
  } catch (error) {
    markFailed(post.id, error.message);
    console.error(`[投稿失敗] ID:${post.id} => ${error.message}`);
    throw error;
  }
}

module.exports = { postTweet, postThread, postScheduledTweet };
