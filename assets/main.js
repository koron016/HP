/* ホームページの細かい動き。基本的にさわらなくて大丈夫です。 */

(function () {
  "use strict";

  /* --- 右上ボタンでの配色切り替え（選んだ設定は次回も覚えています） --- */

  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var STORAGE_KEY = "hp-theme";

  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    /* プライベートモードなどで保存できない場合は、記憶なしで動かす */
  }

  if (saved === "dark" || saved === "light") {
    root.setAttribute("data-theme", saved);
  }

  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* 保存できなくても表示は切り替わる */
      }
    });
  }

  /* --- スクロールでヘッダーに線を出す --- */

  var header = document.querySelector(".site-header");

  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --- スクロールに合わせて、ふわっと表示する --- */

  var targets = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    // 古いブラウザでは、アニメーションなしで最初から表示する
    targets.forEach(function (el) {
      el.classList.add("visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });

  /* --- フッターの年号を自動で今年にする --- */

  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
