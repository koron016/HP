/* 診断の動き。中身（質問・結果）を変えたいときは quiz-data.js の方を直してください。 */

(function () {
  "use strict";

  var DATA = window.QUIZ_DATA;
  if (!DATA) return;

  var MAX_SCORE = DATA.questions.reduce(function (sum, q) {
    return sum + Math.max.apply(null, q.choices.map(function (c) { return c.points; }));
  }, 0);

  var TONE_VAR = { low: "var(--low)", mid: "var(--mid)", high: "var(--high)" };

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
    scoreNum: document.getElementById("score-num"),
    meter: document.getElementById("meter-fill"),
    name: document.getElementById("result-name"),
    catch: document.getElementById("result-catch"),
    body: document.getElementById("result-body"),
    twist: document.getElementById("result-twist"),
    year: document.getElementById("year")
  };

  var answers = [];
  var current = 0;

  /* ---------- 画面の切り替え ---------- */

  function show(screen) {
    [el.start, el.quiz, el.result].forEach(function (s) { s.hidden = true; });
    screen.hidden = false;
    window.scrollTo(0, 0);
  }

  /* ---------- 質問を描く ---------- */

  var KEYS = ["A", "B", "C", "D", "E", "F"];

  function renderQuestion() {
    var q = DATA.questions[current];
    var total = DATA.questions.length;

    el.counter.textContent = "Q" + (current + 1) + " / " + total;
    el.bar.style.width = (current / total) * 100 + "%";
    el.btnBack.hidden = current === 0;
    el.qText.textContent = q.q;

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
      label.textContent = choice.text;

      btn.appendChild(key);
      btn.appendChild(label);
      btn.addEventListener("click", function () { answer(choice.points); });
      el.choices.appendChild(btn);
    });
  }

  function answer(points) {
    answers[current] = points;
    current++;
    if (current < DATA.questions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  /* ---------- キーボードでも答えられるようにする ---------- */

  document.addEventListener("keydown", function (e) {
    if (el.quiz.hidden) return;
    var n = parseInt(e.key, 10);
    var buttons = el.choices.querySelectorAll(".choice");
    if (n >= 1 && n <= buttons.length) buttons[n - 1].click();
  });

  /* ---------- 結果を出す ---------- */

  function findResult(score) {
    for (var i = 0; i < DATA.results.length; i++) {
      if (score >= DATA.results[i].min && score <= DATA.results[i].max) {
        return DATA.results[i];
      }
    }
    return DATA.results[DATA.results.length - 1];
  }

  function showResult() {
    var score = answers.reduce(function (a, b) { return a + b; }, 0);
    var percent = Math.round((score / MAX_SCORE) * 100);
    var result = findResult(score);

    el.result.style.setProperty("--tone", TONE_VAR[result.tone] || "var(--accent)");
    el.name.textContent = result.name;
    el.catch.textContent = result.catch;
    el.body.textContent = result.body;
    el.twist.textContent = result.twist;

    show(el.result);

    // 数字をカウントアップさせる
    countUp(percent);
    requestAnimationFrame(function () {
      el.meter.style.width = percent + "%";
    });

    // シェア用のリンクを組み立てる
    var url = resultUrl(result.slug);
    var text =
      "私のAI依存度は " + percent + "% 「" + result.name + "」でした。\n" +
      result.catch + "\n\n#" + DATA.hashtag;

    el.btnShare.href =
      "https://x.com/intent/post?text=" + encodeURIComponent(text) +
      "&url=" + encodeURIComponent(url);

    el.btnCopy.dataset.url = url;
  }

  function countUp(target) {
    var start = null;
    var duration = 900;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // 最後にゆっくり止まる動き
      var eased = 1 - Math.pow(1 - p, 3);
      el.scoreNum.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* 結果ページのアドレス。公開先が変わっても動くように、
     いま開いているページの場所を基準にする。 */
  function resultUrl(slug) {
    try {
      return new URL("result/" + slug + ".html", window.location.href).href;
    } catch (e) {
      return DATA.siteUrl + "result/" + slug + ".html";
    }
  }

  /* ---------- ボタン ---------- */

  el.btnStart.addEventListener("click", function () {
    answers = [];
    current = 0;
    renderQuestion();
    show(el.quiz);
  });

  el.btnBack.addEventListener("click", function () {
    if (current > 0) {
      current--;
      renderQuestion();
    }
  });

  el.btnRetry.addEventListener("click", function () {
    answers = [];
    current = 0;
    el.scoreNum.textContent = "0";
    el.meter.style.width = "0";
    show(el.start);
  });

  el.btnCopy.addEventListener("click", function () {
    var url = el.btnCopy.dataset.url || window.location.href;
    var done = function () {
      var original = "リンクをコピー";
      el.btnCopy.textContent = "コピーしました";
      setTimeout(function () { el.btnCopy.textContent = original; }, 1600);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(done, fallback);
    } else {
      fallback();
    }

    // クリップボードが使えない環境（file:// で開いたときなど）
    function fallback() {
      var input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      try { document.execCommand("copy"); done(); } catch (e) { window.prompt("このリンクをコピーしてください", url); }
      document.body.removeChild(input);
    }
  });

  if (el.year) el.year.textContent = String(new Date().getFullYear());
})();
