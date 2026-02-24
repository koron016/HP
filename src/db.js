const Database = require("better-sqlite3");
const { config } = require("./config");

let db = null;

function getDb() {
  if (db) return db;

  db = new Database(config.db.path);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      scheduled_at TEXT,
      posted_at TEXT,
      tweet_id TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    )
  `);

  return db;
}

function addPost(content, scheduledAt = null) {
  const db = getDb();
  const stmt = db.prepare(
    "INSERT INTO posts (content, scheduled_at, status) VALUES (?, ?, ?)"
  );
  const status = scheduledAt ? "scheduled" : "pending";
  const result = stmt.run(content, scheduledAt, status);
  return result.lastInsertRowid;
}

function getPost(id) {
  const db = getDb();
  return db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
}

function listPosts(status = null) {
  const db = getDb();
  if (status) {
    return db
      .prepare("SELECT * FROM posts WHERE status = ? ORDER BY created_at DESC")
      .all(status);
  }
  return db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
}

function getScheduledPosts() {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM posts
       WHERE status = 'scheduled'
         AND scheduled_at <= datetime('now', 'localtime')
       ORDER BY scheduled_at ASC`
    )
    .all();
}

function markPosted(id, tweetId) {
  const db = getDb();
  db.prepare(
    `UPDATE posts
     SET status = 'posted', tweet_id = ?, posted_at = datetime('now', 'localtime'),
         updated_at = datetime('now', 'localtime')
     WHERE id = ?`
  ).run(tweetId, id);
}

function markFailed(id, error) {
  const db = getDb();
  db.prepare(
    `UPDATE posts
     SET status = 'failed', updated_at = datetime('now', 'localtime')
     WHERE id = ?`
  ).run(id);
}

function updatePost(id, content, scheduledAt) {
  const db = getDb();
  const fields = [];
  const values = [];

  if (content !== undefined) {
    fields.push("content = ?");
    values.push(content);
  }
  if (scheduledAt !== undefined) {
    fields.push("scheduled_at = ?");
    values.push(scheduledAt);
    fields.push("status = ?");
    values.push(scheduledAt ? "scheduled" : "pending");
  }

  if (fields.length === 0) return;

  fields.push("updated_at = datetime('now', 'localtime')");
  values.push(id);

  db.prepare(`UPDATE posts SET ${fields.join(", ")} WHERE id = ?`).run(
    ...values
  );
}

function deletePost(id) {
  const db = getDb();
  db.prepare("DELETE FROM posts WHERE id = ?").run(id);
}

module.exports = {
  getDb,
  addPost,
  getPost,
  listPosts,
  getScheduledPosts,
  markPosted,
  markFailed,
  updatePost,
  deletePost,
};
