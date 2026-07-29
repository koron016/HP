/* 診断の動き / Quiz behaviour.
   中身を変えたいときは quiz-data.js の方を直してください。
   To change the content, edit quiz-data.js instead. */

(function () {
  "use strict";

  var DATA = window.QUIZ_DATA;
  if (!DATA) return;

  /* =========================================================
     言語 / Language
     ?lang= があればそれ、なければブラウザの設定に合わせる。
     ========================================================= */

  var FALLBACK = DATA.langs[0];

  function pickLang() {
    var fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl && DATA.langs.indexOf(fromUrl) !== -1) return fromUrl;

    var saved = null;
    try { saved = localStorage.getItem("wsti-lang"); } catch (e) { /* 使えない環境は無視 */ }
    if (saved && DATA.langs.indexOf(saved) !== -1) return saved;

    var nav = (navigator.language || "").toLowerCase();
    for (var i = 0; i < DATA.langs.length; i++) {
      if (nav.indexOf(DATA.langs[i]) === 0) return DATA.langs[i];
    }
    return FALLBACK;
  }

  var lang = pickLang();

  /* 文字列を今の言語で取り出す */
  function t(obj) {
    if (obj === null || typeof obj !== "object") return obj;
    return obj[lang] !== undefined ? obj[lang] : obj[FALLBACK];
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem("wsti-lang", next); } catch (e) { /* 無視 */ }
    document.documentElement.lang = next;
    applyStaticText();
    if (!el.quiz.hidden) renderQuestion();
    if (!el.result.hidden) showResult();
  }

  /* =========================================================
     採点 / Scoring — build.js と同じ計算をしています
     ========================================================= */

  var AXIS_MAX = DATA.axes.map(function (_, i) {
    return DATA.questions
      .filter(function (q) { return q.axis === i; })
      .reduce(function (sum, q) {
        return sum + Math.max.apply(null, q.choices.map(function (c) { return Math.abs(c.value); }));
      }, 0);
  });

  function buildCode(scores) {
    return scores.map(function (score, i) {
      var axis = DATA.axes[i];
      return score < 0 ? axis.left.key : axis.right.key;
    }).join("");
  }

  function flip(code, axisIndexes) {
    return code.split("").map(function (ch, i) {
      if (axisIndexes.indexOf(i) === -1) return ch;
      var axis = DATA.axes[i];
      return ch === axis.left.key ? axis.right.key : axis.left.key;
    }).join("");
  }

  /* =========================================================
     画面 / Elements
     ========================================================= */

  var el = {
    start: document.getElementById("screen-start"),
    quiz: document.getElementById("screen-quiz"),
    result: document.getElementById("screen-result"),
    btnStart: document.getElementById("btn-start"),
    btnBack: document.getElementById("btn-back"),
    btnRetry: document.getElementById("btn-retry"),
    btnShare: document.getElementById("btn-share"),
    btnCopy: document.getElementById("btn-copy"),
    counter: document.getElementById("q-counter"),
    bar: document.getElementById("progress-bar"),
    qText: document.getElementById("q-text"),
    choices: document.getElementById("q-choices"),
    code: document.getElementById("result-code"),
    name: document.getElementById("result-name"),
    catch: document.getElementById("result-catch"),
    body: document.getElementById("result-body"),
    twist: document.getElementById("result-twist"),
    axes: document.getElementById("result-axes"),
    good: document.getElementById("match-good"),
    bad: document.getElementById("match-bad"),
    labelGood: document.getElementById("label-good"),
    labelBad: document.getElementById("label-bad"),
    brand: document.getElementById("brand"),
    tagline: document.getElementById("tagline"),
    footBrand: document.getElementById("foot-brand"),
    year: document.getElementById("year")
  };

  var answers = [];
  var current = 0;

  function show(screen) {
    [el.start, el.quiz, el.result].forEach(function (s) { s.hidden = true; });
    screen.hidden = false;
    window.scrollTo(0, 0);
  }

  /* 画面の固定文言をまとめて入れ替える */
  function applyStaticText() {
    document.querySelectorAll("[data-ui]").forEach(function (node) {
      node.textContent = t(DATA.ui[node.dataset.ui]);
    });
    el.brand.textContent = t(DATA.meta.brand);
    el.tagline.textContent = t(DATA.meta.tagline);
    el.footBrand.textContent = t(DATA.meta.brand);
    el.btnStart.textContent = t(DATA.ui.start);
    el.btnBack.textContent = t(DATA.ui.back);
    el.btnShare.textContent = t(DATA.ui.share);
    el.btnCopy.textContent = t(DATA.ui.copy);
    el.btnRetry.textContent = t(DATA.ui.retry);
    el.labelGood.textContent = t(DATA.match.good.label);
    el.labelBad.textContent = t(DATA.match.bad.label);
    document.title = t(DATA.meta.title);

    document.querySelectorAll(".lang").forEach(function (b) {
      b.classList.toggle("is-on", b.dataset.lang === lang);
    });
  }

  /* ---------- 質問 / Questions ---------- */

  var KEYS = ["A", "B", "C", "D", "E", "F"];

  function renderQuestion() {
    var q = DATA.questions[current];
    var total = DATA.questions.length;

    el.counter.textContent = "Q" + (current + 1) + " / " + total;
    el.bar.style.width = (current / total) * 100 + "%";
    el.btnBack.hidden = current === 0;
    el.qText.textContent = t(q.q);

    el.choices.innerHTML = "";
    q.choices.forEach(function (choice, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";

      var key = document.createElement("span");
      key.className = "choice-key";
      key.textContent = KEYS[i];
      key.setAttribute("aria-hidden", "true");

      var label = document.createElement("span");
      label.textContent = t(choice.text);

      btn.appendChild(key);
      btn.appendChild(label);
      btn.addEventListener("click", function () { answer(choice.value); });
      el.choices.appendChild(btn);
    });
  }

  function answer(value) {
    answers[current] = value;
    current++;
    if (current < DATA.questions.length) renderQuestion();
    else showResult();
  }

  document.addEventListener("keydown", function (e) {
    if (el.quiz.hidden) return;
    var n = parseInt(e.key, 10);
    var buttons = el.choices.querySelectorAll(".choice");
    if (n >= 1 && n <= buttons.length) buttons[n - 1].click();
  });

  /* ---------- 結果 / Result ---------- */

  function showResult() {
    var scores = DATA.axes.map(function (_, i) {
      return DATA.questions.reduce(function (sum, q, qi) {
        return q.axis === i ? sum + answers[qi] : sum;
      }, 0);
    });

    var code = buildCode(scores);
    var type = DATA.types[code];

    el.code.textContent = code;
    el.name.textContent = t(type.name);
    el.catch.textContent = t(type.catch);
    el.body.textContent = t(type.body);
    el.twist.textContent = t(type.twist);

    renderAxes(scores);
    renderMatch(code);
    show(el.result);

    var url = resultUrl(code);
    var text = "WSTI: " + code + " — " + t(type.name) + "\n" +
      t(type.catch) + "\n\n#" + t(DATA.meta.hashtag);

    el.btnShare.href =
      "https://x.com/intent/post?text=" + encodeURIComponent(text) +
      "&url=" + encodeURIComponent(url);

    el.btnCopy.dataset.url = url;
  }

  /* 4本の棒グラフ。まんなかを基準に、寄っている側へ伸ばす */
  function renderAxes(scores) {
    el.axes.innerHTML = "";

    DATA.axes.forEach(function (axis, i) {
      var score = scores[i];
      var toRight = score > 0;
      var strength = Math.round((Math.abs(score) / AXIS_MAX[i]) * 100);
      var winner = toRight ? axis.right : axis.left;

      var row = document.createElement("div");
      row.className = "axis";

      var head = document.createElement("div");
      head.className = "axis-head";
      head.innerHTML =
        '<span class="axis-side' + (toRight ? "" : " is-on") + '">' + t(axis.left.label) + "</span>" +
        '<span class="axis-title">' + t(axis.title) + "</span>" +
        '<span class="axis-side' + (toRight ? " is-on" : "") + '">' + t(axis.right.label) + "</span>";

      var track = document.createElement("div");
      track.className = "axis-track";

      var fill = document.createElement("div");
      fill.className = "axis-fill " + (toRight ? "to-right" : "to-left");
      fill.style.width = "0%";

      track.appendChild(fill);
      row.appendChild(head);
      row.appendChild(track);

      var note = document.createElement("p");
      note.className = "axis-note";
      note.textContent = t(winner.label) + " · " + t(winner.desc) + " · " + strength + "%";
      row.appendChild(note);

      el.axes.appendChild(row);

      setTimeout(function () { fill.style.width = strength / 2 + "%"; }, 120 + i * 110);
    });
  }

  function renderMatch(code) {
    [
      { cfg: DATA.match.good, node: el.good },
      { cfg: DATA.match.bad, node: el.bad }
    ].forEach(function (m) {
      var other = flip(code, m.cfg.axes);
      m.node.innerHTML =
        '<a href="' + resultPath(other) + '"><strong>' + other + "</strong>" +
        t(DATA.types[other].name) + "</a>" +
        '<span class="match-why">' + t(m.cfg.reason) + "</span>";
    });
  }

  function resultPath(code) {
    return "result/" + lang + "/" + code.toLowerCase() + ".html";
  }

  /* 公開先が変わっても動くように、いま開いているページの場所を基準にする */
  function resultUrl(code) {
    try {
      return new URL(resultPath(code), window.location.href).href;
    } catch (e) {
      return DATA.siteUrl + resultPath(code);
    }
  }

  /* ---------- ボタン / Buttons ---------- */

  el.btnStart.addEventListener("click", function () {
    answers = [];
    current = 0;
    renderQuestion();
    show(el.quiz);
  });

  el.btnBack.addEventListener("click", function () {
    if (current > 0) { current--; renderQuestion(); }
  });

  el.btnRetry.addEventListener("click", function () {
    answers = [];
    current = 0;
    show(el.start);
  });

  document.querySelectorAll(".lang").forEach(function (btn) {
    btn.addEventListener("click", function () { setLang(btn.dataset.lang); });
  });

  el.btnCopy.addEventListener("click", function () {
    var url = el.btnCopy.dataset.url || window.location.href;
    var done = function () {
      el.btnCopy.textContent = t(DATA.ui.copied);
      setTimeout(function () { el.btnCopy.textContent = t(DATA.ui.copy); }, 1600);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(done, fallback);
    } else {
      fallback();
    }

    /* クリップボードが使えない環境（file:// で開いたときなど） */
    function fallback() {
      var input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      try { document.execCommand("copy"); done(); }
      catch (e) { window.prompt(t(DATA.ui.copy), url); }
      document.body.removeChild(input);
    }
  });

  /* ---------- 起動 / Boot ---------- */

  document.documentElement.lang = lang;
  applyStaticText();
  if (el.year) el.year.textContent = String(new Date().getFullYear());
})();
