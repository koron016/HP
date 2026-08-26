#!/usr/bin/env node
/**
 * その日のX投稿文を組み立てる。
 *
 * 中身は assets/quiz-data.js からそのまま持ってきます。ネタを増やすときは
 * quiz-data.js を直してください。このファイルに文章を書き足さないこと。
 *
 *   node tools/daily-post.js              その日の投稿文を表示
 *   node tools/daily-post.js --json       {title, body, weight} をJSONで
 *   node tools/daily-post.js --out <dir>  title.txt と body.md を書き出す（GitHub Actions用）
 *   node tools/daily-post.js --all        全ネタを順番に表示（確認用）
 *   node tools/daily-post.js --day 12     日付をずらして確認
 *
 * Xの文字数は全角1文字=2、URLは何文字でも23として数えられます。上限280。
 * 組み立てのときに入りきらない行から順に落とすので、はみ出しません。
 */

"use strict";

var fs = require("fs");
var vm = require("vm");
var path = require("path");

var ROOT = path.join(__dirname, "..");
var LIMIT = 280;          /* Xの上限 */
var URL_WEIGHT = 23;      /* URLは長さに関係なく23で数えられる */
var EPOCH = Date.UTC(2026, 0, 1);   /* 何日目かを数える起点 */

/* ---------- データ読み込み ---------- */

function loadData() {
  var src = fs.readFileSync(path.join(ROOT, "assets", "quiz-data.js"), "utf8");
  var ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  if (!ctx.window.QUIZ_DATA) throw new Error("quiz-data.js から QUIZ_DATA を読めませんでした");
  return ctx.window.QUIZ_DATA;
}

/* ---------- 文字数（Xの数え方） ---------- */

/* Xが1文字として数える範囲。それ以外（日本語など）は2文字。 */
function charWeight(cp) {
  if (cp <= 0x10ff) return 1;
  if (cp >= 0x2000 && cp <= 0x200d) return 1;
  if (cp >= 0x2010 && cp <= 0x201f) return 1;
  if (cp >= 0x2032 && cp <= 0x2037) return 1;
  return 2;
}

function weigh(text) {
  var total = 0;
  var rest = text.replace(/https?:\/\/\S+/g, function () {
    total += URL_WEIGHT;
    return "";
  });
  for (var i = 0; i < rest.length; ) {
    var cp = rest.codePointAt(i);
    total += charWeight(cp);
    i += cp > 0xffff ? 2 : 1;
  }
  return total;
}

/* ---------- 組み立て ---------- */

/*
 * blocks は上から順に足していきます。required:true は必ず入れ、
 * それ以外は入りきる分だけ。tail（URLなど）は常に末尾に置きます。
 */
function assemble(blocks, tail) {
  var kept = [];
  var tailPart = tail ? "\n\n" + tail : "";

  blocks.forEach(function (b) {
    if (!b || !b.text) return;
    var next = kept.concat([b.text]);
    if (b.required || weigh(next.join("\n\n") + tailPart) <= LIMIT) kept.push(b.text);
  });

  var out = kept.join("\n\n") + tailPart;
  if (weigh(out) > LIMIT) throw new Error("必須部分だけで上限を超えました:\n" + out);
  return out;
}

function bullets(items, max) {
  return items.slice(0, max).map(function (s) { return "・" + s; }).join("\n");
}

/* ---------- ネタの作り方（種類ごと） ---------- */

function typePosts(d) {
  var url = d.siteUrl;
  return Object.keys(d.types).map(function (code) {
    var t = d.types[code];
    return {
      kind: "type",
      title: "今日の16タイプ " + code + "（" + t.name.ja + "）",
      body: assemble([
        { text: "【" + code + "】" + t.name.ja, required: true },
        { text: t.catch.ja, required: true },
        { text: "強み\n" + bullets(t.strengths.ja, 3) },
        { text: "ただし——\n" + t.twist.ja },
        { text: "気をつけたいこと\n" + bullets(t.watchOut.ja, 1) }
      ], "自分がどれかは20問でわかります\n" + url + "result/ja/" + code + ".html")
    };
  });
}

function askPosts(d) {
  return Object.keys(d.env).map(function (key) {
    var e = d.env[key];
    return {
      kind: "ask",
      title: "逆質問（" + key + "）" + e.ask.ja,
      body: assemble([
        { text: "【説明会で聞くといい質問】", required: true },
        { text: "「" + e.ask.ja + "」", required: true },
        { text: "○ " + e.read.good.ja },
        { text: "× " + e.read.bad.ja },
        { text: "△ " + e.read.vague.ja }
      ], d.siteUrl)
    };
  });
}

function chainPosts(d) {
  return Object.keys(d.chain).map(function (key) {
    var c = d.chain[key];
    var steps = c.steps.ja.map(function (s, i) {
      return (i + 1) + " " + s + (i === 2 ? " ← ここで崩れる" : "");
    }).join("\n");
    return {
      kind: "chain",
      title: "深掘り3段階（" + key + "）",
      body: assemble([
        { text: "【面接官は同じ話を3回掘ります】", required: true },
        { text: steps, required: true },
        { text: "崩れない答え方\n" + c.hold.ja }
      ], "3段目まで用意できていますか\n" + d.siteUrl)
    };
  });
}

function weakPosts(d) {
  return Object.keys(d.prep).map(function (key) {
    var p = d.prep[key];
    return {
      kind: "weak",
      title: "短所の答え方（" + key + "）",
      body: assemble([
        { text: "【「短所は？」に詰まる人へ】", required: true },
        { text: "こう聞かれます\n" + p.dig.ja, required: true },
        { text: "こう答えます\n「" + p.weak.ja + "」" },
        { text: "備え方\n" + p.fix.ja }
      ], "自分の型の答え方が出ます\n" + d.siteUrl)
    };
  });
}

function flagPosts(d) {
  return Object.keys(d.env).map(function (key) {
    var e = d.env[key];
    return {
      kind: "flag",
      title: "合わないサイン（" + key + "）",
      body: assemble([
        { text: "【説明会で警戒したい言葉】", required: true },
        { text: e.flag.ja, required: true },
        { text: "こういう環境なら合います\n" + e.fit.ja },
        { text: "確かめる質問\n「" + e.ask.ja + "」" }
      ], "合う環境の条件が4つ出ます\n" + d.siteUrl)
    };
  });
}

function riskPosts(d) {
  return Object.keys(d.risks).map(function (key) {
    var r = d.risks[key];
    return {
      kind: "risk",
      title: "チームの偏り（" + key + "）",
      body: assemble([
        { text: "【同じタイプで固めたチームに起きること】", required: true },
        { text: "起きること\n" + r.risk.ja, required: true },
        { text: "打ち手\n" + r.fix.ja, required: true }
      ], "チームの分布を出せます\n" + d.siteUrl + "team.html")
    };
  });
}

/* ---------- 並べ替え ---------- */

/*
 * 種類ごとに数が違う（タイプは16個、他は8個）ので、単純に持ち回りにすると
 * 後半がタイプだけになります。それぞれを全体に等間隔で散らしてから並べます。
 */
function playlist(d) {
  var buckets = [typePosts(d), askPosts(d), chainPosts(d), weakPosts(d), flagPosts(d), riskPosts(d)];
  var slotted = [];

  buckets.forEach(function (bucket, order) {
    bucket.forEach(function (post, i) {
      slotted.push({ at: (i + 0.5) / bucket.length, order: order, post: post });
    });
  });

  slotted.sort(function (a, b) { return a.at - b.at || a.order - b.order; });
  return slotted.map(function (s) { return s.post; });
}

/* 日本時間で、起点から何日目か */
function dayIndex(now) {
  var jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  var midnight = Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), jst.getUTCDate());
  return Math.floor((midnight - EPOCH) / 86400000);
}

/* ---------- 実行 ---------- */

function main(argv) {
  var d = loadData();
  var list = playlist(d);

  if (argv.indexOf("--all") !== -1) {
    list.forEach(function (p, i) {
      console.log("--- " + (i + 1) + "/" + list.length + " [" + p.kind + "] " + p.title + " (" + weigh(p.body) + "/" + LIMIT + ")");
      console.log(p.body);
      console.log("");
    });
    return;
  }

  var at = argv.indexOf("--day");
  var index = at !== -1 ? parseInt(argv[at + 1], 10) : dayIndex(new Date());
  var post = list[((index % list.length) + list.length) % list.length];

  if (argv.indexOf("--json") !== -1) {
    console.log(JSON.stringify({ title: post.title, body: post.body, kind: post.kind, weight: weigh(post.body) }));
    return;
  }

  var outAt = argv.indexOf("--out");
  if (outAt !== -1) {
    var dir = argv[outAt + 1];
    if (!dir) throw new Error("--out には書き出し先のフォルダを渡してください");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "title.txt"), today() + " の投稿：" + post.title + "\n");
    fs.writeFileSync(path.join(dir, "body.md"), issueBody(post));
    return;
  }

  console.log(post.body);
}

/* 日本時間の YYYY-MM-DD */
function today() {
  var jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 10);
}

/* Issueの本文。コードブロックに入れておくと、スマホでも丸ごとコピーできます。 */
function issueBody(post) {
  return [
    "下の枠の中をコピーして、Xに貼ってください。",
    "",
    "```",
    post.body,
    "```",
    "",
    "投稿したら、このIssueを Close してください。",
    "",
    "---",
    "",
    "- 種類: `" + post.kind + "`",
    "- 文字数: " + weigh(post.body) + " / " + LIMIT + "（Xの数え方。全角は2文字、URLは23文字）",
    "- 中身の出どころ: `assets/quiz-data.js`（直すのはここ）",
    "- 組み立て: `tools/daily-post.js`"
  ].join("\n");
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (e) {
    console.error("失敗しました: " + e.message);
    process.exit(1);
  }
}

module.exports = { playlist: playlist, weigh: weigh, dayIndex: dayIndex, loadData: loadData, LIMIT: LIMIT };
