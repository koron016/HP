const cron = require("node-cron");
const { getScheduledPosts } = require("./db");
const { postScheduledTweet } = require("./poster");

function startScheduler(intervalMinutes = 1) {
  console.log("[スケジューラー] 起動しました");
  console.log(
    `[スケジューラー] ${intervalMinutes}分間隔で予約投稿を確認します`
  );

  const cronExpression =
    intervalMinutes === 1
      ? "* * * * *"
      : `*/${intervalMinutes} * * * *`;

  cron.schedule(cronExpression, async () => {
    const posts = getScheduledPosts();

    if (posts.length === 0) return;

    console.log(
      `[スケジューラー] ${posts.length}件の予約投稿を処理します`
    );

    for (const post of posts) {
      try {
        await postScheduledTweet(post);
      } catch (error) {
        // エラーは postScheduledTweet 内でログ出力済み
      }
    }
  });

  console.log("[スケジューラー] Ctrl+C で停止します");
}

// 直接実行された場合
if (require.main === module) {
  startScheduler();
}

module.exports = { startScheduler };
