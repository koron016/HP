/* 診断の動き。中身（質問・タイプ）を変えたいときは quiz-data.js の方を直してください。 */

(function () {
  "use strict";

  var DATA = window.QUIZ_DATA;
  if (!DATA) return;

  /* =========================================================
     採点まわり。ここは build.js と同じ計算をしています。
     片方だけ直すと、サイトとシェア画像がズレます。
     ========================================================= */

  /* 各軸で取りうる最大の絶対値（棒グラフの目盛りに使う） */
  var AXIS_MAX = DATA.axes.map(function (_, i) {
    return DATA.questions
      .filter(function (q) { return q.axis === i; })
      .reduce(function (sum, q) {
        return sum + Math.max.apply(null, q.choices.map(function (c) { return Math.abs(c.value); }));
      }, 0);
  });

  /* 軸ごとの合計点から、4文字のタイプを組み立てる */
  function buildCode(scores) {
    return scores.map(function (score, i) {
      var axis = DATA.axes[i];
      return score < 0 ? axis.left.key : axis.right.key;
    }).join("");
  }

  /* 相性。
     良い＝「受け取り方」と「見せ方」はそのまま、「任せ方」と「話しかけ方」が逆のタイプ。
     悪い＝4軸すべてが逆のタイプ。 */
  function flip(code, axisIndexes) {
    return code.split("").map(function (ch, i) {
      if (axisIndexes.indexOf(i) === -1) return ch;
      var axis = DATA.axes[i];
      return ch === axis.left.key ? axis.right.key : axis.left.key;
    }).join("");
  }

  var goodMatch = function (code) { return flip(code, [0, 2]); };
  var badMatch  = function (code) { return flip(code, [0, 1, 2, 3]); };

  /* =========================================================
     画面
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
    year: document.getElementById("year")
  };

  var answers = [];
  var current = 0;

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
      btn.addEventListener("click", function () { answer(choice.value); });
      el.choices.appendChild(btn);
    });
  }

  function answer(value) {
    answers[current] = value;
    current++;
    if (current < DATA.questions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  document.addEventListener("keydown", function (e) {
    if (el.quiz.hidden) return;
    var n = parseInt(e.key, 10);
    var buttons = el.choices.querySelectorAll(".choice");
    if (n >= 1 && n <= buttons.length) buttons[n - 1].click();
  });

  /* ---------- 結果を出す ---------- */

  function showResult() {
    var scores = DATA.axes.map(function (_, i) {
      return DATA.questions.reduce(function (sum, q, qi) {
        return q.axis === i ? sum + answers[qi] : sum;
      }, 0);
    });

    var code = buildCode(scores);
    var type = DATA.types[code];

    el.code.textContent = code;
    el.name.textContent = type.name;
    el.catch.textContent = type.catch;
    el.body.textContent = type.body;
    el.twist.textContent = type.twist;

    renderAxes(scores);
    renderMatch(code);
    show(el.result);

    var url = resultUrl(code);
    var text =
      "私のAIタイプは【" + code + "】" + type.name + "でした。\n" +
      type.catch + "\n\n#" + DATA.hashtag;

    el.btnShare.href =
      "https://x.com/intent/post?text=" + encodeURIComponent(text) +
      "&url=" + encodeURIComponent(url);

    el.btnCopy.dataset.url = url;
  }

  /* 4本の棒グラフ。どちら側にどれだけ寄っているかを見せる */
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
        '<span class="axis-side' + (toRight ? "" : " is-on") + '">' + axis.left.label + "</span>" +
        '<span class="axis-title">' + axis.title + "</span>" +
        '<span class="axis-side' + (toRight ? " is-on" : "") + '">' + axis.right.label + "</span>";

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
      note.textContent = winner.label + "（" + winner.desc + "）" + strength + "%";
      row.appendChild(note);

      el.axes.appendChild(row);

      // 少し遅らせて伸ばすと、順番に伸びて見える
      setTimeout(function () { fill.style.width = strength / 2 + "%"; }, 120 + i * 110);
    });
  }

  function renderMatch(code) {
    var good = goodMatch(code);
    var bad = badMatch(code);
    el.good.innerHTML =
      '<a href="' + resultPath(good) + '"><strong>' + good + "</strong>" +
      DATA.types[good].name + "</a>";
    el.bad.innerHTML =
      '<a href="' + resultPath(bad) + '"><strong>' + bad + "</strong>" +
      DATA.types[bad].name + "</a>";
  }

  function resultPath(code) {
    return "result/" + code.toLowerCase() + ".html";
  }

  /* 結果ページのアドレス。公開先が変わっても動くように、
     いま開いているページの場所を基準にする。 */
  function resultUrl(code) {
    try {
      return new URL(resultPath(code), window.location.href).href;
    } catch (e) {
      return DATA.siteUrl + resultPath(code);
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
    show(el.start);
  });

  el.btnCopy.addEventListener("click", function () {
    var url = el.btnCopy.dataset.url || window.location.href;
    var done = function () {
      el.btnCopy.textContent = "コピーしました";
      setTimeout(function () { el.btnCopy.textContent = "リンクをコピー"; }, 1600);
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
      try { document.execCommand("copy"); done(); }
      catch (e) { window.prompt("このリンクをコピーしてください", url); }
      document.body.removeChild(input);
    }
  });

  if (el.year) el.year.textContent = String(new Date().getFullYear());
})();
