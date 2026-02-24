#!/usr/bin/env node

const { program } = require("commander");
const { postTweet, postThread } = require("./poster");
const { verifyCredentials } = require("./client");
const { addPost, getPost, listPosts, updatePost, deletePost } = require("./db");
const { startScheduler } = require("./scheduler");

program
  .name("x-auto-post")
  .description("X（旧Twitter）自動投稿システム")
  .version("1.0.0");

// 即座に投稿
program
  .command("post <text>")
  .description("テキストを即座にXに投稿する")
  .action(async (text) => {
    try {
      const result = await postTweet(text);
      console.log("投稿成功!");
      console.log(`Tweet ID: ${result.id}`);
      console.log(`内容: ${result.text}`);
    } catch (error) {
      console.error(`投稿失敗: ${error.message}`);
      process.exit(1);
    }
  });

// スレッド投稿
program
  .command("thread <texts...>")
  .description("複数テキストをスレッドとして投稿する（|で区切り）")
  .option("-s, --separator <sep>", "テキスト区切り文字", "|")
  .action(async (texts, options) => {
    try {
      // 引数が1つの場合はセパレータで分割
      const tweetTexts =
        texts.length === 1 ? texts[0].split(options.separator).map((t) => t.trim()) : texts;

      console.log(`${tweetTexts.length}件のスレッドを投稿します...`);
      const results = await postThread(tweetTexts);

      results.forEach((tweet, i) => {
        console.log(`[${i + 1}/${results.length}] Tweet ID: ${tweet.id}`);
      });
      console.log("スレッド投稿完了!");
    } catch (error) {
      console.error(`スレッド投稿失敗: ${error.message}`);
      process.exit(1);
    }
  });

// 予約投稿の追加
program
  .command("schedule <text>")
  .description("投稿を予約する")
  .requiredOption("-t, --time <datetime>", "投稿日時 (YYYY-MM-DD HH:mm)")
  .action(async (text, options) => {
    try {
      const id = addPost(text, options.time);
      console.log("予約投稿を登録しました!");
      console.log(`ID: ${id}`);
      console.log(`内容: ${text}`);
      console.log(`予約日時: ${options.time}`);
    } catch (error) {
      console.error(`予約失敗: ${error.message}`);
      process.exit(1);
    }
  });

// 投稿一覧
program
  .command("list")
  .description("投稿一覧を表示する")
  .option("-s, --status <status>", "ステータスでフィルター (pending/scheduled/posted/failed)")
  .action(async (options) => {
    try {
      const posts = listPosts(options.status);

      if (posts.length === 0) {
        console.log("投稿がありません。");
        return;
      }

      console.log(`\n${"ID".padEnd(5)} ${"ステータス".padEnd(12)} ${"予約日時".padEnd(20)} 内容`);
      console.log("-".repeat(70));

      for (const post of posts) {
        const status = post.status.padEnd(10);
        const scheduled = (post.scheduled_at || "-").padEnd(20);
        const content =
          post.content.length > 30
            ? post.content.substring(0, 30) + "..."
            : post.content;
        console.log(
          `${String(post.id).padEnd(5)} ${status} ${scheduled} ${content}`
        );
      }

      console.log(`\n合計: ${posts.length}件`);
    } catch (error) {
      console.error(`一覧取得失敗: ${error.message}`);
      process.exit(1);
    }
  });

// 投稿の詳細
program
  .command("show <id>")
  .description("投稿の詳細を表示する")
  .action(async (id) => {
    try {
      const post = getPost(Number(id));
      if (!post) {
        console.error(`ID ${id} の投稿が見つかりません。`);
        process.exit(1);
      }

      console.log(`\nID:         ${post.id}`);
      console.log(`ステータス: ${post.status}`);
      console.log(`内容:       ${post.content}`);
      console.log(`予約日時:   ${post.scheduled_at || "-"}`);
      console.log(`投稿日時:   ${post.posted_at || "-"}`);
      console.log(`Tweet ID:   ${post.tweet_id || "-"}`);
      console.log(`作成日時:   ${post.created_at}`);
      console.log(`更新日時:   ${post.updated_at}`);
    } catch (error) {
      console.error(`詳細取得失敗: ${error.message}`);
      process.exit(1);
    }
  });

// 投稿の編集
program
  .command("edit <id>")
  .description("予約投稿を編集する")
  .option("-c, --content <text>", "新しい投稿内容")
  .option("-t, --time <datetime>", "新しい予約日時")
  .action(async (id, options) => {
    try {
      const post = getPost(Number(id));
      if (!post) {
        console.error(`ID ${id} の投稿が見つかりません。`);
        process.exit(1);
      }
      if (post.status === "posted") {
        console.error("投稿済みの内容は編集できません。");
        process.exit(1);
      }

      updatePost(Number(id), options.content, options.time);
      console.log(`ID ${id} の投稿を更新しました。`);
    } catch (error) {
      console.error(`編集失敗: ${error.message}`);
      process.exit(1);
    }
  });

// 投稿の削除
program
  .command("delete <id>")
  .description("投稿を削除する")
  .action(async (id) => {
    try {
      const post = getPost(Number(id));
      if (!post) {
        console.error(`ID ${id} の投稿が見つかりません。`);
        process.exit(1);
      }
      if (post.status === "posted") {
        console.error("投稿済みの内容は削除できません。");
        process.exit(1);
      }

      deletePost(Number(id));
      console.log(`ID ${id} の投稿を削除しました。`);
    } catch (error) {
      console.error(`削除失敗: ${error.message}`);
      process.exit(1);
    }
  });

// スケジューラー起動
program
  .command("daemon")
  .description("スケジューラーを起動して予約投稿を自動処理する")
  .option("-i, --interval <minutes>", "チェック間隔（分）", "1")
  .action(async (options) => {
    startScheduler(Number(options.interval));
  });

// 認証確認
program
  .command("verify")
  .description("X APIの認証情報を確認する")
  .action(async () => {
    try {
      const user = await verifyCredentials();
      console.log("認証成功!");
      console.log(`ユーザー名: @${user.username}`);
      console.log(`表示名: ${user.name}`);
      console.log(`ID: ${user.id}`);
    } catch (error) {
      console.error(`認証失敗: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
