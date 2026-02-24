const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const config = {
  x: {
    apiKey: process.env.X_API_KEY,
    apiSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET,
    bearerToken: process.env.X_BEARER_TOKEN,
  },
  db: {
    path: path.resolve(__dirname, "../posts.db"),
  },
};

function validateConfig() {
  const required = [
    "X_API_KEY",
    "X_API_SECRET",
    "X_ACCESS_TOKEN",
    "X_ACCESS_TOKEN_SECRET",
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `.env に以下の設定が不足しています: ${missing.join(", ")}\n` +
        ".env.example を参考に .env ファイルを作成してください。"
    );
  }
}

module.exports = { config, validateConfig };
