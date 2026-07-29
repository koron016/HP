/* =========================================================
   結果ページと、Xでシェアされたときに出る画像を作り直すスクリプト。

     node tools/build.js

   assets/quiz-data.js を書き換えたら、これを実行してください。
   画像も作り直す場合は playwright が必要です（任意）。

     npm install playwright
   ========================================================= */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const OUT_PAGES = path.join(ROOT, "result");
const OUT_IMAGES = path.join(ROOT, "assets", "ogp");
const CARD_DIR = path.join(ROOT, ".ogp-cards"); // 画像を作るための一時ファイル置き場

/* ---------- quiz-data.js を読み込む ---------- */

const src = fs.readFileSync(path.join(ROOT, "assets", "quiz-data.js"), "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const DATA = sandbox.window.QUIZ_DATA;

const SITE = DATA.siteUrl.replace(/\/+$/, "") + "/";

/* ---------- 採点まわり（quiz.js と同じ計算） ---------- */

/* 4文字コードの組み合わせを、すべて作る */
function allCodes() {
  return DATA.axes.reduce(
    (codes, axis) =>
      codes.flatMap((c) => [c + axis.left.key, c + axis.right.key]),
    [""]
  );
}

function flip(code, axisIndexes) {
  return code
    .split("")
    .map((ch, i) => {
      if (!axisIndexes.includes(i)) return ch;
      const axis = DATA.axes[i];
      return ch === axis.left.key ? axis.right.key : axis.left.key;
    })
    .join("");
}

const goodMatch = (code) => flip(code, [0, 2]);
const badMatch = (code) => flip(code, [0, 1, 2, 3]);

/* コードの各文字が、どちら側かを返す */
function sides(code) {
  return code.split("").map((ch, i) => {
    const axis = DATA.axes[i];
    return {
      axis,
      side: ch === axis.left.key ? axis.left : axis.right,
      isRight: ch === axis.right.key
    };
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------- 中身の点検（作る前に必ず確認する） ---------- */

function check() {
  const codes = allCodes();
  const problems = [];

  codes.forEach((c) => {
    if (!DATA.types[c]) problems.push(`タイプ ${c} の文章がありません`);
  });
  Object.keys(DATA.types).forEach((c) => {
    if (!codes.includes(c)) problems.push(`タイプ ${c} は、どの組み合わせにも当てはまりません`);
  });

  /* 各軸の合計が0（引き分け）になりえないか確かめる。
     0になるとタイプが決まらないので、ここは必ず通す必要があります。 */
  DATA.axes.forEach((axis, i) => {
    const qs = DATA.questions.filter((q) => q.axis === i);
    if (qs.length === 0) {
      problems.push(`軸「${axis.title}」に質問が1問もありません`);
      return;
    }
    let sums = [0];
    qs.forEach((q) => {
      sums = sums.flatMap((s) => q.choices.map((c) => s + c.value));
    });
    if (sums.includes(0)) {
      problems.push(
        `軸「${axis.title}」は、答え方によって合計0（引き分け）になります。` +
          `点数の付け方を見直してください`
      );
    }
  });

  if (problems.length) {
    console.error("中身に問題があります:");
    problems.forEach((p) => console.error("  - " + p));
    process.exit(1);
  }
  console.log(`点検OK: ${codes.length}タイプ / ${DATA.questions.length}問 / 引き分けなし`);
  return codes;
}

/* =========================================================
   1. 結果ページ
   ========================================================= */

function resultPage(code) {
  const t = DATA.types[code];
  const good = goodMatch(code);
  const bad = badMatch(code);
  const title = `【${code}】${t.name} — ${DATA.title}`;
  const desc = `${t.catch}／あなたは何タイプ？ 8つの質問・1分で診断できます。`;

  const axisRows = sides(code)
    .map(
      (s) => `
      <div class="axis">
        <div class="axis-head">
          <span class="axis-side${s.isRight ? "" : " is-on"}">${escapeHtml(s.axis.left.label)}</span>
          <span class="axis-title">${escapeHtml(s.axis.title)}</span>
          <span class="axis-side${s.isRight ? " is-on" : ""}">${escapeHtml(s.axis.right.label)}</span>
        </div>
        <div class="axis-track">
          <div class="axis-fill ${s.isRight ? "to-right" : "to-left"}" style="width:32%"></div>
        </div>
        <p class="axis-note">${escapeHtml(s.side.label)}（${escapeHtml(s.side.desc)}）</p>
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}">

<meta property="og:type" content="article">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:image" content="${SITE}assets/ogp/${code.toLowerCase()}.png">
<meta property="og:url" content="${SITE}result/${code.toLowerCase()}.html">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary_large_image">

<link rel="stylesheet" href="../assets/style.css">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧠</text></svg>">
</head>
<body>

<main class="app">
  <section class="screen">

    <div class="share-card">
      <p class="eyebrow">AIタイプ</p>
      <p class="result-code">${code}</p>
      <h1 class="result-name">${escapeHtml(t.name)}</h1>
      <p class="result-catch">${escapeHtml(t.catch)}</p>

      <div class="axes">${axisRows}
      </div>

      <p class="result-body">${escapeHtml(t.body)}</p>
      <p class="result-twist">${escapeHtml(t.twist)}</p>
    </div>

    <div class="matches">
      <div class="match">
        <p class="match-label">相性がいい</p>
        <p class="match-type">
          <a href="${good.toLowerCase()}.html"><strong>${good}</strong>${escapeHtml(DATA.types[good].name)}</a>
        </p>
      </div>
      <div class="match">
        <p class="match-label">話が合わない</p>
        <p class="match-type">
          <a href="${bad.toLowerCase()}.html"><strong>${bad}</strong>${escapeHtml(DATA.types[bad].name)}</a>
        </p>
      </div>
    </div>

    <p class="lead">これは16タイプのうちのひとつです。<br>あなたはどのタイプか、やってみてください。</p>

    <div class="actions cta">
      <a class="btn btn-main" href="../index.html">自分も診断してみる</a>
    </div>

    <p class="note">8つの質問・1分。登録も入力もありません。</p>

  </section>
</main>

<footer class="foot">
  <p>© <span id="year">2026</span> ${escapeHtml(DATA.title)}</p>
</footer>

<script>
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
</script>
</body>
</html>
`;
}

/* =========================================================
   2. シェア画像のもとになるHTML（1200×630）
   ========================================================= */

const CARD_BASE = `
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; display: flex; flex-direction: column;
    justify-content: center; padding: 70px 84px; background: #0d0d11; color: #f2f2f5;
    font-family: system-ui, -apple-system, "Hiragino Sans", "Noto Sans JP", Meiryo, sans-serif;
  }
`;

function cardHtml(code) {
  const t = DATA.types[code];
  const rows = sides(code)
    .map(
      (s) => `
    <div class="row">
      <span class="lbl">${escapeHtml(s.axis.title)}</span>
      <span class="val">${escapeHtml(s.side.label)}</span>
      <span class="dsc">${escapeHtml(s.side.desc)}</span>
    </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8"><style>${CARD_BASE}
  .code { font-size: 116px; font-weight: 900; letter-spacing: 0.06em; color: #c8f24e; line-height: 1; margin-bottom: 18px; }
  .name { font-size: 68px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 14px; }
  .catch { font-size: 32px; font-weight: 700; color: #8f8f9e; margin-bottom: 40px; }
  .rows { display: flex; gap: 14px; margin-bottom: 34px; }
  .row { flex: 1; padding: 16px 20px; background: #16161c; border: 1px solid #2a2a34; border-radius: 12px; }
  .lbl { display: block; font-size: 19px; font-weight: 700; letter-spacing: 0.1em; color: #8f8f9e; margin-bottom: 6px; }
  .val { display: block; font-size: 30px; font-weight: 800; color: #f2f2f5; }
  .dsc { display: block; font-size: 18px; color: #8f8f9e; margin-top: 2px; }
  .brand { font-size: 27px; font-weight: 800; color: #f2f2f5; }
  .brand span { color: #0d0d11; background: #c8f24e; padding: 2px 10px; border-radius: 4px; }
</style></head>
<body>
  <div class="code">${code}</div>
  <div class="name">${escapeHtml(t.name)}</div>
  <div class="catch">${escapeHtml(t.catch)}</div>
  <div class="rows">${rows}
  </div>
  <div class="brand">AI<span>16タイプ</span>診断</div>
</body></html>`;
}

function topCardHtml() {
  return `<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8"><style>${CARD_BASE}
  .eyebrow { font-size: 28px; font-weight: 700; letter-spacing: 0.2em; color: #c8f24e; margin-bottom: 28px; }
  h1 { font-size: 118px; font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 30px; }
  h1 span { color: #16200a; background: #c8f24e; padding: 0 16px; display: inline-block; transform: rotate(-1.5deg); }
  p { font-size: 36px; color: #8f8f9e; line-height: 1.5; }
</style></head>
<body>
  <div class="eyebrow">8つの質問・1分</div>
  <h1>AI<span>16タイプ</span>診断</h1>
  <p>どこまで任せるか。信じるか、疑うか。<br>あなたとAIの関係を、4つの軸で分けます。</p>
</body></html>`;
}

/* =========================================================
   実行
   ========================================================= */

function writePages(codes) {
  fs.rmSync(OUT_PAGES, { recursive: true, force: true });
  fs.mkdirSync(OUT_PAGES, { recursive: true });
  codes.forEach((c) => {
    fs.writeFileSync(path.join(OUT_PAGES, c.toLowerCase() + ".html"), resultPage(c));
  });
  console.log(`結果ページ ${codes.length} 件を result/ に書き出しました。`);
}

async function writeImages(codes) {
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch (e) {
    console.log("playwright が見つからないため、シェア画像は作り直しませんでした。");
    console.log("画像も作り直すには:  npm install playwright");
    return;
  }

  fs.rmSync(OUT_IMAGES, { recursive: true, force: true });
  fs.mkdirSync(OUT_IMAGES, { recursive: true });
  fs.mkdirSync(CARD_DIR, { recursive: true });

  const jobs = codes.map((c) => ({ name: c.toLowerCase(), html: cardHtml(c) }));
  jobs.push({ name: "top", html: topCardHtml() });

  const launchOpts = {};
  if (process.env.CHROMIUM_PATH) launchOpts.executablePath = process.env.CHROMIUM_PATH;

  const browser = await chromium.launch(launchOpts);
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

  for (const job of jobs) {
    const tmp = path.join(CARD_DIR, job.name + ".html");
    fs.writeFileSync(tmp, job.html);
    await page.goto("file://" + tmp);
    await page.screenshot({ path: path.join(OUT_IMAGES, job.name + ".png") });
  }

  await browser.close();
  fs.rmSync(CARD_DIR, { recursive: true, force: true });
  console.log(`シェア画像 ${jobs.length} 枚を assets/ogp/ に書き出しました。`);
}

(async () => {
  const codes = check();
  writePages(codes);
  await writeImages(codes);
})();
