/* =========================================================
   結果ページとシェア画像を作り直すスクリプト。
   Regenerates the per-type result pages and share images.

     node tools/build.js

   assets/quiz-data.js を書き換えたら、必ず実行してください。
   画像も作り直す場合は playwright が必要です（任意）。

     npm install playwright
   ========================================================= */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { buildCharacter } = require("../assets/character.js");

const ROOT = path.resolve(__dirname, "..");
const OUT_PAGES = path.join(ROOT, "result");
const OUT_IMAGES = path.join(ROOT, "assets", "ogp");
const CARD_DIR = path.join(ROOT, ".ogp-cards");

/* ---------- quiz-data.js を読み込む ---------- */

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "assets", "quiz-data.js"), "utf8"), sandbox);
const DATA = sandbox.window.QUIZ_DATA;

const SITE = DATA.siteUrl.replace(/\/+$/, "") + "/";
const FALLBACK = DATA.langs[0];

/* 文字列を指定の言語で取り出す（quiz.js の t() と同じ） */
const t = (obj, lang) =>
  obj && typeof obj === "object" && !Array.isArray(obj)
    ? (obj[lang] !== undefined ? obj[lang] : obj[FALLBACK])
    : obj;

/* ---------- 採点まわり（quiz.js と同じ計算） ---------- */

function allCodes() {
  return DATA.axes.reduce(
    (codes, axis) => codes.flatMap((c) => [c + axis.left.key, c + axis.right.key]),
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

/* コードの各文字が、どちら側かを返す */
const sides = (code) =>
  code.split("").map((ch, i) => {
    const axis = DATA.axes[i];
    return {
      axis,
      side: ch === axis.left.key ? axis.left : axis.right,
      isRight: ch === axis.right.key
    };
  });

const bullets = (items) =>
  items.map((x) => `<li>${escapeHtml(x)}</li>`).join("");

const escapeHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
           .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------- 作る前の点検 ---------- */

function check() {
  const codes = allCodes();
  const problems = [];

  codes.forEach((c) => {
    if (!DATA.types[c]) problems.push(`タイプ ${c} の文章がありません`);
  });
  Object.keys(DATA.types).forEach((c) => {
    if (!codes.includes(c)) problems.push(`タイプ ${c} は、どの組み合わせにも当てはまりません`);
  });

  /* 訳の抜けを拾う。1つでも抜けると、その言語だけ英語に落ちてしまう */
  const walk = (node, trail) => {
    if (!node || typeof node !== "object") return;
    if (Object.prototype.hasOwnProperty.call(node, FALLBACK)) {
      DATA.langs.forEach((l) => {
        if (node[l] === undefined) problems.push(`${trail} に ${l} の文章がありません`);
      });
      return;
    }
    Object.keys(node).forEach((k) => walk(node[k], trail ? trail + "." + k : k));
  };
  ["meta", "ui", "axes", "match", "questions", "types"].forEach((k) => walk(DATA[k], k));

  /* 各軸の合計が0（引き分け）になりえないか確かめる。
     0になるとタイプが決まらないので、ここは必ず通す必要があります。 */
  DATA.axes.forEach((axis, i) => {
    const qs = DATA.questions.filter((q) => q.axis === i);
    if (!qs.length) {
      problems.push(`軸 ${i} に質問が1問もありません`);
      return;
    }
    let sums = [0];
    qs.forEach((q) => { sums = sums.flatMap((s) => q.choices.map((c) => s + c.value)); });
    if (sums.includes(0)) {
      problems.push(`軸「${t(axis.title, FALLBACK)}」は合計0（引き分け）になりえます。点数を見直してください`);
    }
  });

  if (problems.length) {
    console.error("中身に問題があります:");
    problems.forEach((p) => console.error("  - " + p));
    process.exit(1);
  }
  console.log(`点検OK: ${codes.length}タイプ / ${DATA.questions.length}問 / ${DATA.langs.length}言語 / 引き分けなし`);
  return codes;
}

/* =========================================================
   1. 結果ページ
   ========================================================= */

function resultPage(code, lang) {
  const ty = DATA.types[code];
  const name = t(ty.name, lang);
  const title = `${code} — ${name} | ${t(DATA.meta.brand, lang)}`;
  const desc = `${t(ty.catch, lang)} · ${t(DATA.meta.description, lang)}`;
  const other = DATA.langs.filter((l) => l !== lang);

  const axisRows = sides(code).map((s) => `
      <div class="axis">
        <div class="axis-head">
          <span class="axis-side${s.isRight ? "" : " is-on"}">${escapeHtml(t(s.axis.left.label, lang))}</span>
          <span class="axis-title">${escapeHtml(t(s.axis.title, lang))}</span>
          <span class="axis-side${s.isRight ? " is-on" : ""}">${escapeHtml(t(s.axis.right.label, lang))}</span>
        </div>
        <div class="axis-track">
          <div class="axis-fill ${s.isRight ? "to-right" : "to-left"}" style="width:32%"></div>
        </div>
        <p class="axis-note">${escapeHtml(t(s.side.label, lang))} · ${escapeHtml(t(s.side.desc, lang))}</p>
      </div>`).join("");

  const matchBlocks = [DATA.match.good, DATA.match.bad].map((cfg) => {
    const o = flip(code, cfg.axes);
    return `
      <div class="match">
        <p class="match-label">${escapeHtml(t(cfg.label, lang))}</p>
        <p class="match-type">
          <a href="${o.toLowerCase()}.html"><strong>${o}</strong>${escapeHtml(t(DATA.types[o].name, lang))}</a>
          <span class="match-why">${escapeHtml(t(cfg.reason, lang))}</span>
        </p>
      </div>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}">

<meta property="og:type" content="article">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:image" content="${SITE}assets/ogp/${code.toLowerCase()}-${lang}.png">
<meta property="og:url" content="${SITE}result/${lang}/${code.toLowerCase()}.html">
<meta name="twitter:card" content="summary_large_image">
${other.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}result/${l}/${code.toLowerCase()}.html">`).join("\n")}

<link rel="stylesheet" href="../../assets/style.css">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧭</text></svg>">
</head>
<body>

<nav class="langbar">
${DATA.langs.map((l) =>
  l === lang
    ? `  <span class="lang is-on">${l === "ja" ? "日本語" : l.toUpperCase()}</span>`
    : `  <a class="lang" href="../${l}/${code.toLowerCase()}.html">${l === "ja" ? "日本語" : l.toUpperCase()}</a>`
).join("\n")}
</nav>

<main class="app">
  <section class="screen">

    <div class="share-card">
      <p class="eyebrow">${escapeHtml(t(DATA.meta.brand, lang))}</p>
      <div class="char">${buildCharacter(code, { size: 132 })}</div>
      <p class="result-code">${code}</p>
      <h1 class="result-name">${escapeHtml(name)}</h1>
      <p class="result-catch">${escapeHtml(t(ty.catch, lang))}</p>

      <div class="axes">${axisRows}
      </div>

      <p class="result-body">${escapeHtml(t(ty.body, lang))}</p>
      <p class="result-twist">${escapeHtml(t(ty.twist, lang))}</p>
    </div>

    <div class="panel">
      <p class="panel-label">${escapeHtml(t(DATA.ui.strengths, lang))}</p>
      <ul class="bullets">${bullets(t(ty.strengths, lang))}</ul>
    </div>

    <div class="panel">
      <p class="panel-label">${escapeHtml(t(DATA.ui.watchOut, lang))}</p>
      <ul class="bullets is-warn">${bullets(t(ty.watchOut, lang))}</ul>
    </div>

    <div class="panel">
      <p class="panel-label">${escapeHtml(t(DATA.ui.fits, lang))}</p>
      <p class="panel-body">${escapeHtml(t(ty.fits, lang))}</p>
    </div>

    <div class="panel is-pitch">
      <p class="panel-label">${escapeHtml(t(DATA.ui.pitch, lang))}</p>
      <p class="pitch-text">${escapeHtml(t(ty.pitch, lang))}</p>
      <p class="panel-note">${escapeHtml(t(DATA.ui.pitchNote, lang))}</p>
    </div>

    <div class="matches">${matchBlocks}
    </div>

    <p class="lead">${escapeHtml(t(DATA.ui.oneOf, lang))}</p>

    <div class="actions cta">
      <a class="btn btn-main" href="../../index.html?lang=${lang}">${escapeHtml(t(DATA.ui.takeIt, lang))}</a>
    </div>

    <p class="note">${escapeHtml(t(DATA.ui.startNote, lang))}</p>

  </section>
</main>

<footer class="foot">
  <p>© <span id="year">2026</span> ${escapeHtml(t(DATA.meta.brand, lang))}</p>
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
   2. シェア画像（1200×630）
   ========================================================= */

const CARD_BASE = `
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; display: flex; flex-direction: column;
    justify-content: center; padding: 68px 84px; background: #0d0d11; color: #f2f2f5;
    font-family: system-ui, -apple-system, "Hiragino Sans", "Noto Sans JP", "Segoe UI", Meiryo, sans-serif;
  }
`;

function cardHtml(code, lang) {
  const ty = DATA.types[code];
  const rows = sides(code).map((s) => `
    <div class="row">
      <span class="lbl">${escapeHtml(t(s.axis.title, lang))}</span>
      <span class="val">${escapeHtml(t(s.side.label, lang))}</span>
    </div>`).join("");

  return `<!DOCTYPE html>
<html lang="${lang}"><head><meta charset="UTF-8"><style>${CARD_BASE}
  .code { font-size: 118px; font-weight: 900; letter-spacing: 0.06em; color: #c8f24e; line-height: 1; margin-bottom: 16px; }
  .name { font-size: 62px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 12px; }
  .catch { font-size: 30px; font-weight: 700; color: #8f8f9e; margin-bottom: 40px; }
  .code, .name, .catch { max-width: 680px; }
  .rows { display: flex; gap: 14px; margin-bottom: 32px; max-width: 680px; }
  .row { flex: 1; padding: 14px 16px; background: #16161c; border: 1px solid #2a2a34; border-radius: 12px; }
  .lbl { display: block; font-size: 19px; font-weight: 700; letter-spacing: 0.08em; color: #8f8f9e; margin-bottom: 4px; }
  .val { display: block; font-size: 27px; font-weight: 800; white-space: nowrap; }
  .brand { font-size: 26px; font-weight: 800; letter-spacing: 0.04em; }
  .brand span { color: #0d0d11; background: #c8f24e; padding: 2px 10px; border-radius: 4px; }
  .figure { position: absolute; right: 90px; top: 50%; transform: translateY(-50%); }
</style></head>
<body>
  <div class="figure">${buildCharacter(code, { size: 300 })}</div>
  <div class="code">${code}</div>
  <div class="name">${escapeHtml(t(ty.name, lang))}</div>
  <div class="catch">${escapeHtml(t(ty.catch, lang))}</div>
  <div class="rows">${rows}
  </div>
  <div class="brand"><span>${escapeHtml(t(DATA.meta.brand, lang))}</span></div>
</body></html>`;
}

function topCardHtml(lang) {
  return `<!DOCTYPE html>
<html lang="${lang}"><head><meta charset="UTF-8"><style>${CARD_BASE}
  .eyebrow { font-size: 28px; font-weight: 700; letter-spacing: 0.2em; color: #c8f24e; margin-bottom: 26px; }
  h1 { font-size: 104px; font-weight: 900; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 26px; }
  h1 span { color: #16200a; background: #c8f24e; padding: 0 16px; display: inline-block; transform: rotate(-1.5deg); }
  p { font-size: 36px; color: #8f8f9e; line-height: 1.5; }
</style></head>
<body>
  <div class="eyebrow">${escapeHtml(t(DATA.ui.eyebrow, lang))}</div>
  <h1><span>${escapeHtml(t(DATA.meta.brand, lang))}</span></h1>
  <p>${escapeHtml(t(DATA.meta.tagline, lang))}</p>
</body></html>`;
}

/* =========================================================
   実行
   ========================================================= */

function writePages(codes) {
  fs.rmSync(OUT_PAGES, { recursive: true, force: true });
  DATA.langs.forEach((lang) => {
    const dir = path.join(OUT_PAGES, lang);
    fs.mkdirSync(dir, { recursive: true });
    codes.forEach((c) => {
      fs.writeFileSync(path.join(dir, c.toLowerCase() + ".html"), resultPage(c, lang));
    });
  });
  console.log(`結果ページ ${codes.length * DATA.langs.length} 件を result/ に書き出しました。`);
}

async function writeImages(codes) {
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch (e) {
    console.log("playwright が無いため、シェア画像は作り直しませんでした（npm install playwright）。");
    return;
  }

  fs.rmSync(OUT_IMAGES, { recursive: true, force: true });
  fs.mkdirSync(OUT_IMAGES, { recursive: true });
  fs.mkdirSync(CARD_DIR, { recursive: true });

  const jobs = [];
  DATA.langs.forEach((lang) => {
    codes.forEach((c) => jobs.push({ name: `${c.toLowerCase()}-${lang}`, html: cardHtml(c, lang) }));
    jobs.push({ name: `top-${lang}`, html: topCardHtml(lang) });
  });

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
