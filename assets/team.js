/* チーム分布のページ / Team shape page.
   選んだメンバーのタイプから、チームの偏りと足りない持ち味を出します。
   人数も並びも URL に入るので、そのままリンクで共有できます。 */

(function () {
  "use strict";

  var DATA = window.QUIZ_DATA;
  if (!DATA) return;

  var FALLBACK = DATA.langs[0];

  /* ---------- 言語（quiz.js と同じ決め方） ---------- */

  function pickLang() {
    var fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl && DATA.langs.indexOf(fromUrl) !== -1) return fromUrl;
    var saved = null;
    try { saved = localStorage.getItem("wsti-lang"); } catch (e) { /* 無視 */ }
    if (saved && DATA.langs.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || "").toLowerCase();
    for (var i = 0; i < DATA.langs.length; i++) {
      if (nav.indexOf(DATA.langs[i]) === 0) return DATA.langs[i];
    }
    return FALLBACK;
  }

  var lang = pickLang();

  function t(obj) {
    if (obj === null || typeof obj !== "object") return obj;
    return obj[lang] !== undefined ? obj[lang] : obj[FALLBACK];
  }

  /* ---------- 全16タイプ ---------- */

  var ALL_CODES = DATA.axes.reduce(function (codes, axis) {
    return codes.reduce(function (acc, c) {
      return acc.concat([c + axis.left.key, c + axis.right.key]);
    }, []);
  }, [""]);

  /* ---------- 状態。URL から読み、URL に書き戻す ---------- */

  function readMembers() {
    var raw = new URLSearchParams(window.location.search).get("codes") || "";
    return raw.split(",")
      .map(function (c) { return c.trim().toUpperCase(); })
      .filter(function (c) { return ALL_CODES.indexOf(c) !== -1; });
  }

  var members = readMembers();

  function syncUrl() {
    var params = new URLSearchParams(window.location.search);
    if (members.length) params.set("codes", members.join(","));
    else params.delete("codes");
    params.set("lang", lang);
    var next = window.location.pathname + "?" + params.toString();
    try { history.replaceState(null, "", next); } catch (e) { /* file:// では使えない */ }
  }

  /* ---------- 画面 ---------- */

  var el = {
    picker: document.getElementById("picker"),
    members: document.getElementById("members"),
    empty: document.getElementById("members-empty"),
    result: document.getElementById("team-result"),
    axes: document.getElementById("team-axes"),
    gap: document.getElementById("team-gap"),
    pairBlock: document.getElementById("pair-block"),
    pairVerdict: document.getElementById("pair-verdict"),
    pairWhy: document.getElementById("pair-why"),
    btnClear: document.getElementById("btn-clear"),
    btnShare: document.getElementById("btn-share"),
    btnCopy: document.getElementById("btn-copy"),
    btnTest: document.getElementById("btn-test"),
    brand: document.getElementById("brand"),
    footBrand: document.getElementById("foot-brand"),
    year: document.getElementById("year")
  };

  function applyStaticText() {
    document.querySelectorAll("[data-ui]").forEach(function (node) {
      node.textContent = t(DATA.ui[node.dataset.ui]);
    });
    el.brand.textContent = t(DATA.meta.brand);
    el.footBrand.textContent = t(DATA.meta.brand);
    el.btnClear.textContent = t(DATA.ui.teamClear);
    el.btnShare.textContent = t(DATA.ui.teamShareX);
    el.btnCopy.textContent = t(DATA.ui.teamShare);
    el.btnTest.textContent = t(DATA.ui.teamTakeTest);
    el.btnTest.href = "index.html?lang=" + lang;
    document.title = t(DATA.ui.teamTitle) + " — " + t(DATA.meta.brand);
    document.documentElement.lang = lang;
    document.querySelectorAll(".lang").forEach(function (b) {
      b.classList.toggle("is-on", b.dataset.lang === lang);
    });
  }

  /* ---------- 16タイプの選択ボタン ---------- */

  function renderPicker() {
    el.picker.innerHTML = "";
    ALL_CODES.forEach(function (code) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pick";
      btn.innerHTML = "<strong>" + code + "</strong><span>" + t(DATA.types[code].name) + "</span>";
      btn.addEventListener("click", function () {
        members.push(code);
        render();
      });
      el.picker.appendChild(btn);
    });
  }

  /* ---------- 選んだメンバー ---------- */

  function renderMembers() {
    el.members.innerHTML = "";
    members.forEach(function (code, i) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.title = t(DATA.ui.teamRemove);
      chip.innerHTML = code + '<span class="chip-x" aria-hidden="true">×</span>';
      chip.setAttribute("aria-label", code + " — " + t(DATA.ui.teamRemove));
      chip.addEventListener("click", function () {
        members.splice(i, 1);
        render();
      });
      el.members.appendChild(chip);
    });
    el.empty.hidden = members.length > 0;
  }

  /* ---------- 軸ごとの分布 ---------- */

  function renderAxes() {
    el.axes.innerHTML = "";

    DATA.axes.forEach(function (axis, i) {
      var right = members.filter(function (c) { return c[i] === axis.right.key; }).length;
      var total = members.length;
      var rightPct = Math.round((right / total) * 100);
      var leftPct = 100 - rightPct;
      var lean = Math.abs(rightPct - 50) * 2; // 0 = 拮抗、100 = 全員同じ側

      var row = document.createElement("div");
      row.className = "axis";

      var head = document.createElement("div");
      head.className = "axis-head";
      head.innerHTML =
        '<span class="axis-side' + (leftPct >= rightPct ? " is-on" : "") + '">' +
          t(axis.left.label) + " " + leftPct + "%</span>" +
        '<span class="axis-title">' + t(axis.title) + "</span>" +
        '<span class="axis-side' + (rightPct > leftPct ? " is-on" : "") + '">' +
          rightPct + "% " + t(axis.right.label) + "</span>";

      /* 左右の比率をそのまま帯で見せる */
      var track = document.createElement("div");
      track.className = "axis-track split";
      var fill = document.createElement("div");
      fill.className = "axis-fill to-right";
      fill.style.left = "0";
      fill.style.width = "0%";
      track.appendChild(fill);

      row.appendChild(head);
      row.appendChild(track);

      var note = document.createElement("p");
      note.className = "axis-note";
      note.textContent = lean >= 50
        ? t(DATA.ui.teamSkewed) + " · " + (rightPct > leftPct ? t(axis.right.desc) : t(axis.left.desc))
        : t(DATA.ui.teamBalanced);
      if (lean >= 50) note.classList.add("is-warn-text");
      row.appendChild(note);

      el.axes.appendChild(row);
      setTimeout(function () { fill.style.width = leftPct + "%"; }, 60 + i * 90);
    });
  }

  /* ---------- 足りていない持ち味 ---------- */

  function renderGap() {
    el.gap.innerHTML = "";
    var gaps = [];

    DATA.axes.forEach(function (axis, i) {
      var leftCount = members.filter(function (c) { return c[i] === axis.left.key; }).length;
      var rightCount = members.length - leftCount;
      if (leftCount === 0) gaps.push({ axis: axis, side: axis.left });
      else if (rightCount === 0) gaps.push({ axis: axis, side: axis.right });
    });

    if (!gaps.length) {
      var li = document.createElement("li");
      li.textContent = t(DATA.ui.teamGapNone);
      li.classList.add("is-ok");
      el.gap.appendChild(li);
      return;
    }

    gaps.forEach(function (g) {
      var li = document.createElement("li");
      li.textContent = t(g.axis.title) + " — " + t(g.side.label) + "（" + t(g.side.desc) + "）";
      el.gap.appendChild(li);
    });
  }

  /* ---------- ちょうど2人なら、相性を出す ---------- */

  function flip(code, axisIndexes) {
    return code.split("").map(function (ch, i) {
      if (axisIndexes.indexOf(i) === -1) return ch;
      var axis = DATA.axes[i];
      return ch === axis.left.key ? axis.right.key : axis.left.key;
    }).join("");
  }

  function renderPair() {
    if (members.length !== 2) {
      el.pairBlock.hidden = true;
      return;
    }
    var a = members[0], b = members[1];
    var cfg = null;
    if (flip(a, DATA.match.good.axes) === b) cfg = DATA.match.good;
    else if (flip(a, DATA.match.bad.axes) === b) cfg = DATA.match.bad;

    el.pairBlock.hidden = false;

    if (cfg) {
      el.pairVerdict.textContent = a + " × " + b + " — " + t(cfg.label);
      el.pairWhy.textContent = t(cfg.reason);
      return;
    }

    /* どちらにも当てはまらないときは、違っている軸の数で説明する */
    var diff = 0;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
    el.pairVerdict.textContent = a + " × " + b;
    el.pairWhy.textContent = lang === "ja"
      ? "4つの軸のうち " + diff + " つが違います。" +
        (diff === 0 ? "ほぼ同じ進め方をする2人です。"
         : diff <= 2 ? "近い進め方なので、噛み合いやすい2人です。"
         : "進め方がかなり違うので、役割を分けると強くなります。")
      : diff + " of the four axes differ. " +
        (diff === 0 ? "You two work almost identically."
         : diff <= 2 ? "Close enough to move together easily."
         : "Different enough that splitting the roles makes you stronger.");
  }

  /* ---------- まとめて描き直す ---------- */

  function render() {
    syncUrl();
    renderMembers();

    if (members.length < 2) {
      el.result.hidden = true;
      return;
    }
    el.result.hidden = false;
    renderAxes();
    renderGap();
    renderPair();

    var url = window.location.href;
    var text = lang === "ja"
      ? "チームの働き方タイプ分布：" + members.join(" / ") + "\n\n#" + t(DATA.meta.hashtag)
      : "Our team's work styles: " + members.join(" / ") + "\n\n#" + t(DATA.meta.hashtag);
    el.btnShare.href = "https://x.com/intent/post?text=" +
      encodeURIComponent(text) + "&url=" + encodeURIComponent(url);
  }

  /* ---------- ボタン ---------- */

  el.btnClear.addEventListener("click", function () {
    members = [];
    render();
  });

  el.btnCopy.addEventListener("click", function () {
    var url = window.location.href;
    var done = function () {
      el.btnCopy.textContent = t(DATA.ui.copied);
      setTimeout(function () { el.btnCopy.textContent = t(DATA.ui.teamShare); }, 1600);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(done, function () { window.prompt("", url); });
    } else {
      window.prompt(t(DATA.ui.teamShare), url);
    }
  });

  document.querySelectorAll(".lang").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.dataset.lang === lang) return;
      lang = btn.dataset.lang;
      try { localStorage.setItem("wsti-lang", lang); } catch (e) { /* 無視 */ }
      applyStaticText();
      renderPicker();
      render();
    });
  });

  /* ---------- 起動 ---------- */

  applyStaticText();
  renderPicker();
  render();
  if (el.year) el.year.textContent = String(new Date().getFullYear());
})();
