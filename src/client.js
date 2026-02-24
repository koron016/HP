const { TwitterApi } = require("twitter-api-v2");
const { config, validateConfig } = require("./config");

let clientInstance = null;

function getClient() {
  if (clientInstance) return clientInstance;

  validateConfig();

  clientInstance = new TwitterApi({
    appKey: config.x.apiKey,
    appSecret: config.x.apiSecret,
    accessToken: config.x.accessToken,
    accessSecret: config.x.accessTokenSecret,
  });

  return clientInstance;
}

async function verifyCredentials() {
  const client = getClient();
  const me = await client.v2.me();
  return me.data;
}

module.exports = { getClient, verifyCredentials };
