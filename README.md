# X 自動投稿システム

X（旧Twitter）への自動投稿・予約投稿を管理するCLIツール。

## 機能

- **即座投稿** - テキストをXに即座に投稿
- **スレッド投稿** - 複数ツイートをスレッドとして投稿
- **予約投稿** - 指定日時に自動投稿
- **投稿管理** - 投稿の一覧・詳細表示・編集・削除
- **スケジューラー** - バックグラウンドで予約投稿を自動処理

## セットアップ

### 1. X Developer Portal でAPIキーを取得

1. [X Developer Portal](https://developer.x.com/en/portal/dashboard) にアクセス
2. プロジェクトとアプリを作成
3. 「User authentication settings」で OAuth 1.0a を有効化（Read and Write権限）
4. API Key, API Secret, Access Token, Access Token Secret を取得

### 2. インストール

```bash
npm install
```

### 3. 環境変数の設定

```bash
cp .env.example .env
```

`.env` ファイルを編集してAPIキーを設定:

```
X_API_KEY=your_api_key
X_API_SECRET=your_api_secret
X_ACCESS_TOKEN=your_access_token
X_ACCESS_TOKEN_SECRET=your_access_token_secret
```

### 4. 認証確認

```bash
node src/cli.js verify
```

## 使い方

### 即座に投稿

```bash
node src/cli.js post "Hello from auto-poster!"
```

### スレッド投稿

```bash
node src/cli.js thread "最初のツイート | 2番目のツイート | 3番目のツイート"
```

### 予約投稿

```bash
# 投稿を予約
node src/cli.js schedule "予約投稿テスト" -t "2026-03-01 09:00"

# スケジューラーを起動（予約投稿を自動処理）
node src/cli.js daemon
```

### 投稿管理

```bash
# 一覧表示
node src/cli.js list

# ステータスでフィルター
node src/cli.js list -s scheduled

# 詳細表示
node src/cli.js show 1

# 編集
node src/cli.js edit 1 -c "新しい内容" -t "2026-03-02 10:00"

# 削除
node src/cli.js delete 1
```

## プログラムからの利用

```javascript
const { postTweet, addPost, startScheduler } = require("./src/index");

// 即座に投稿
await postTweet("Hello!");

// 予約投稿を登録
addPost("予約投稿", "2026-03-01 09:00");

// スケジューラー起動
startScheduler();
```

## ファイル構成

```
├── src/
│   ├── index.js       # メインエントリポイント（ライブラリ用）
│   ├── cli.js         # CLIインターフェース
│   ├── client.js      # X API クライアント
│   ├── config.js      # 設定管理
│   ├── db.js          # SQLiteデータベース操作
│   ├── poster.js      # 投稿機能
│   └── scheduler.js   # 予約投稿スケジューラー
├── .env.example       # 環境変数テンプレート
├── .gitignore
├── package.json
└── README.md
```
