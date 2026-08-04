/* =========================================================
   4文字のコードから、キャラの見た目を組み立てます。
   Builds a character from the four-letter code.

   絵を1枚ずつ描くのではなく、コードの各文字が見た目の一要素を
   決めています。だから16体すべてが必ず違い、しかも全部が同じ規則で
   できています。タイプを増やしても描き足す必要がありません。

     1文字目 決め方   I 直感 → 丸い頭      / D 根拠 → 角ばった頭
     2文字目 進め方   S 単独 → 目を閉じ気味 / T 巻き込み → 目を開く
     3文字目 締切     E 前倒し → 前のめり   / L 追い込み → 後ろに反る
     4文字目 立ち位置 C 仕切る → 片手を上げる / B 支える → 両手を広げる
   ========================================================= */

(function () {
  "use strict";

  var LIME = "#1e50a2";   /* 体の色 */
  var INK = "#ffffff";    /* 目の色 */
  var SHADOW = "rgba(22,35,60,0.13)";

  function buildCharacter(code, opts) {
    opts = opts || {};
    var size = opts.size || 120;
    var lean = code[2] === "E" ? -9 : 9;      // 前倒しは前のめり、追い込みは反る
    var round = code[0] === "I";              // 直感は丸い頭
    var openEyes = code[1] === "T";           // 巻き込みは目を開く
    var command = code[3] === "C";            // 仕切るは片手を上げる

    /* 頭 */
    var head = round
      ? '<circle cx="50" cy="34" r="21" fill="' + LIME + '"/>'
      : '<rect x="29" y="13" width="42" height="42" rx="9" fill="' + LIME + '"/>';

    /* 目。単独は閉じ気味、巻き込みは開いている */
    var eyes = openEyes
      ? '<circle cx="42" cy="34" r="3.4" fill="' + INK + '"/>' +
        '<circle cx="58" cy="34" r="3.4" fill="' + INK + '"/>'
      : '<rect x="38" y="33" width="9" height="2.6" rx="1.3" fill="' + INK + '"/>' +
        '<rect x="53" y="33" width="9" height="2.6" rx="1.3" fill="' + INK + '"/>';

    /* 腕。仕切るは片手を上げ、支えるは両手を横に広げて受け止める */
    var arms = command
      /* 仕切る：片手をまっすぐ上げ、その手に旗を持たせる */
      /* 頭に重ならないよう、外側へ振り上げる */
      ? '<rect x="68" y="32" width="7" height="36" rx="3.5" fill="' + LIME + '" transform="rotate(22 71.5 68)"/>' +
        '<rect x="79" y="26" width="17" height="13" rx="2" fill="' + LIME + '"/>' +
        '<rect x="27" y="62" width="7" height="24" rx="3.5" fill="' + LIME + '"/>'
      /* 支える：両手を横に広げて受け止める */
      : '<rect x="16" y="66" width="22" height="7" rx="3.5" fill="' + LIME + '"/>' +
        '<rect x="62" y="66" width="22" height="7" rx="3.5" fill="' + LIME + '"/>' +
        '<circle cx="17" cy="69.5" r="5.5" fill="' + LIME + '"/>' +
        '<circle cx="83" cy="69.5" r="5.5" fill="' + LIME + '"/>';

    var body =
      '<rect x="35" y="56" width="30" height="42" rx="10" fill="' + LIME + '"/>';

    return '' +
      '<svg viewBox="0 0 100 118" width="' + size + '" height="' + Math.round(size * 1.18) + '" ' +
        'role="img" aria-label="' + code + '" class="wsti-char">' +
        '<ellipse cx="' + (50 + lean * 0.5) + '" cy="110" rx="26" ry="5" fill="' + SHADOW + '"/>' +
        '<g transform="rotate(' + lean + ' 50 100)">' +
          arms + body + head + eyes +
        '</g>' +
      '</svg>';
  }

  /* ブラウザからも、build.js（Node）からも使えるようにしておく */
  if (typeof window !== "undefined") window.buildCharacter = buildCharacter;
  if (typeof module !== "undefined" && module.exports) module.exports = { buildCharacter: buildCharacter };
})();
