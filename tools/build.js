/* =========================================================
   結果ページと、Xでシェアされたときに出る画像を作り直すスクリプト。

     node tools/build.js

   assets/quiz-data.js を書き換えたら、これを実行してください。
   画像も作り直したい場合は playwright が必要です（任意）。

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

function loadData() {
  const src = fs.readFileSync(path.join(ROOT, "assets", "quiz-data.js"), "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  return sandbox.window.QUIZ_DATA;
}

const DATA = loadData();

const MAX_SCORE = DATA.questions.reduce(
  (sum, q) => sum + Math.max(...q.choices.map((c) => c.points)),
  0
);

const pct = (score) => Math.round((score / MAX_SCORE) * 100);

const TONE_COLOR = { low: "#7ee081", mid: "#ffc247", high: "#ff6b81" };

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* 末尾のスラッシュを必ず1つに揃える */
const SITE = DATA.siteUrl.replace(/\/+$/, "") + "/";

/* =========================================================
   1. 結果ページ（シェアされたリンクを開いた人が最初に見る画面）
   ========================================================= */

function resultPage(r) {
  const lo = pct(r.min);
  const hi = pct(r.max);
  const range = lo + "〜" + hi + "%";
  const title = `AI依存度「${r.name}」— ${DATA.title}`;
  const desc = `${r.catch}／AI依存度 ${range}。あなたは何％？ 6つの質問・30秒で診断できます。`;
  const tone = TONE_COLOR[r.tone] || "#c8f24e";

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
<meta property="og:image" content="${SITE}assets/ogp/${r.slug}.png">
<meta property="og:url" content="${SITE}result/${r.slug}.html">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary_large_image">

<link rel="stylesheet" href="../assets/style.css">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧠</text></svg>">
<style>:root { --tone: ${tone}; }</style>
</head>
<body>

<main class="app">
  <section class="screen">

    <div class="share-card">
      <p class="eyebrow">AI依存度 ${range}</p>
      <h1 class="result-name">${escapeHtml(r.name)}</h1>
      <p class="result-catch">${escapeHtml(r.catch)}</p>
      <p class="result-body">${escapeHtml(r.body)}</p>
      <p class="result-twist">${escapeHtml(r.twist)}</p>
    </div>

    <p class="lead">これは診断結果のひとつです。<br>あなたは何％か、やってみてください。</p>

    <div class="actions cta">
      <a class="btn btn-main" href="../index.html">自分も診断してみる</a>
    </div>

    <p class="note">6つの質問・30秒。登録も入力もありません。</p>

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

function cardHtml(r) {
  const tone = TONE_COLOR[r.tone] || "#c8f24e";
  const lo = pct(r.min);
  const hi = pct(r.max);
  const mid = Math.round((lo + hi) / 2);

  return `<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; display: flex; flex-direction: column;
    justify-content: center; padding: 76px 84px; background: #0d0d11; color: #f2f2f5;
    font-family: system-ui, -apple-system, "Hiragino Sans", "Noto Sans JP", Meiryo, sans-serif;
    letter-spacing: 0.01em; position: relative; overflow: hidden;
  }
  .eyebrow { font-size: 26px; font-weight: 700; letter-spacing: 0.2em; color: ${tone}; margin-bottom: 24px; }
  .name { font-size: 108px; font-weight: 900; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 22px; }
  .catch { font-size: 36px; font-weight: 700; color: ${tone}; margin-bottom: 46px; }
  .meter { height: 12px; background: #1e1e26; border-radius: 99px; overflow: hidden; margin-bottom: 20px; }
  .fill { height: 100%; width: ${mid}%; background: ${tone}; border-radius: 99px; }
  .foot { display: flex; justify-content: space-between; align-items: baseline; font-size: 28px; color: #8f8f9e; }
  .range { font-weight: 800; color: #f2f2f5; }
  .brand { font-weight: 800; color: #f2f2f5; }
  .brand span { color: #0d0d11; background: #c8f24e; padding: 2px 10px; border-radius: 4px; }
</style></head>
<body>
  <div class="eyebrow">AI依存度診断</div>
  <div class="name">${escapeHtml(r.name)}</div>
  <div class="catch">${escapeHtml(r.catch)}</div>
  <div class="meter"><div class="fill"></div></div>
  <div class="foot">
    <div class="range">AI依存度 ${lo}〜${hi}%</div>
    <div class="brand">AI依存度<span>診断</span></div>
  </div>
</body></html>`;
}

function topCardHtml() {
  return `<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; display: flex; flex-direction: column;
    justify-content: center; padding: 84px; background: #0d0d11; color: #f2f2f5;
    font-family: system-ui, -apple-system, "Hiragino Sans", "Noto Sans JP", Meiryo, sans-serif;
  }
  .eyebrow { font-size: 28px; font-weight: 700; letter-spacing: 0.2em; color: #c8f24e; margin-bottom: 30px; }
  h1 { font-size: 132px; font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 34px; }
  h1 span { color: #16200a; background: #c8f24e; padding: 0 18px; display: inline-block; transform: rotate(-1.5deg); }
  p { font-size: 38px; color: #8f8f9e; line-height: 1.5; }
</style></head>
<body>
  <div class="eyebrow">6つの質問・30秒</div>
  <h1>AI依存度<span>診断</span></h1>
  <p>気づけば、なんでも聞いていませんか。<br>あなたがどこまでAIに預けているか、測ります。</p>
</body></html>`;
}

/* =========================================================
   実行
   ========================================================= */

function writePages() {
  fs.mkdirSync(OUT_PAGES, { recursive: true });
  DATA.results.forEach((r) => {
    fs.writeFileSync(path.join(OUT_PAGES, r.slug + ".html"), resultPage(r));
  });
  console.log(`結果ページ ${DATA.results.length} 件を result/ に書き出しました。`);
}

async function writeImages() {
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch (e) {
    console.log("playwright が見つからないため、シェア画像の生成は飛ばしました。");
    console.log("画像も作り直すには:  npm install playwright");
    return;
  }

  fs.mkdirSync(OUT_IMAGES, { recursive: true });
  fs.mkdirSync(CARD_DIR, { recursive: true });

  const jobs = DATA.results.map((r) => ({ slug: r.slug, html: cardHtml(r) }));
  jobs.push({ slug: "top", html: topCardHtml() });

  const launchOpts = {};
  if (process.env.CHROMIUM_PATH) launchOpts.executablePath = process.env.CHROMIUM_PATH;

  const browser = await chromium.launch(launchOpts);
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

  for (const job of jobs) {
    const tmp = path.join(CARD_DIR, job.slug + ".html");
    fs.writeFileSync(tmp, job.html);
    await page.goto("file://" + tmp);
    await page.screenshot({ path: path.join(OUT_IMAGES, job.slug + ".png") });
  }

  await browser.close();
  fs.rmSync(CARD_DIR, { recursive: true, force: true });
  console.log(`シェア画像 ${jobs.length} 枚を assets/ogp/ に書き出しました。`);
}

(async () => {
  writePages();
  await writeImages();
})();
