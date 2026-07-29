/* =========================================================
   診断の中身は、このファイルだけを直せば変えられます。
   All quiz content lives in this file.

   直したら必ず  node tools/build.js  を実行してください。
   After editing, always run: node tools/build.js

   ■ しくみ / How it works
   4つの軸に2問ずつ、合計8問。各軸の合計点のプラス／マイナスで
   1文字ずつ決まり、4文字のタイプ（例：DTEC）になります。16タイプ。

   ■ 点数のルール（大事） / Scoring rule (important)
   1問目は奇数（±1, ±3）、2問目は偶数（±2, ±4）。
   こうすると合計が必ず奇数になり、0（引き分け）になりません。
   この決まりを崩すと build.js がエラーで止まります。

   ■ 文章はすべて { ja, en } の形 / Every string is { ja, en }
   ========================================================= */

window.QUIZ_DATA = {
  /* 公開先のアドレス / Where this is published */
  siteUrl: "https://koron016.github.io/HP/",

  /* 対応言語。1つ目が既定 / Supported languages, first is the fallback */
  langs: ["en", "ja"],

  meta: {
    brand: { ja: "働き方16タイプ診断", en: "WSTI" },
    title: {
      ja: "働き方16タイプ診断",
      en: "WSTI — Work Style Type Indicator"
    },
    tagline: {
      ja: "あなたは、どう仕事を進める人か。",
      en: "Not what you do. How you do it."
    },
    description: {
      ja: "8つの質問で、仕事の進め方が16タイプのどれかに分かれます。相性のいいタイプもわかります。",
      en: "Eight questions. Sixteen work styles. Find your four-letter type and who you work best with."
    },
    hashtag: { ja: "働き方16タイプ診断", en: "WSTI" }
  },

  /* --- 画面の文言 / Interface copy --- */
  ui: {
    eyebrow:      { ja: "8つの質問・1分", en: "8 questions · 1 minute" },
    start:        { ja: "診断をはじめる", en: "Start the test" },
    startNote:    { ja: "結果はその場で出ます。登録も入力もありません。", en: "Instant result. No sign-up, nothing to fill in." },
    back:         { ja: "戻る", en: "Back" },
    resultLabel:  { ja: "あなたのタイプは", en: "Your type is" },
    share:        { ja: "結果をXでシェア", en: "Share on X" },
    copy:         { ja: "リンクをコピー", en: "Copy link" },
    copied:       { ja: "コピーしました", en: "Copied" },
    retry:        { ja: "もう一度やる", en: "Take it again" },
    resultNote:   { ja: "友達は何タイプか、聞いてみてください。", en: "Ask your team what they got." },
    takeIt:       { ja: "自分も診断してみる", en: "Take the test" },
    oneOf:        { ja: "これは16タイプのうちのひとつです。", en: "This is one of sixteen types." },
    noscript:     {
      ja: "この診断はJavaScriptを使って動きます。ブラウザの設定で有効にしてから読み込み直してください。",
      en: "This test needs JavaScript. Enable it in your browser settings and reload."
    }
  },

  /* --- 4つの軸 / The four axes. left is negative, right is positive --- */
  axes: [
    {
      title: { ja: "決め方", en: "Deciding" },
      left:  { key: "I", label: { ja: "直感", en: "Instinct" }, desc: { ja: "感覚で決める", en: "goes with the gut" } },
      right: { key: "D", label: { ja: "根拠", en: "Data" },     desc: { ja: "材料を揃えて決める", en: "wants the evidence" } }
    },
    {
      title: { ja: "進め方", en: "Working" },
      left:  { key: "S", label: { ja: "単独", en: "Solo" }, desc: { ja: "一人で片付ける", en: "handles it alone" } },
      right: { key: "T", label: { ja: "巻き込み", en: "Together" }, desc: { ja: "人と組んで進める", en: "pulls people in" } }
    },
    {
      title: { ja: "締切", en: "Timing" },
      left:  { key: "E", label: { ja: "前倒し", en: "Early" }, desc: { ja: "早めに終わらせる", en: "finishes ahead" } },
      right: { key: "L", label: { ja: "追い込み", en: "Late" },  desc: { ja: "直前に力が出る", en: "peaks at the buzzer" } }
    },
    {
      title: { ja: "立ち位置", en: "Standing" },
      left:  { key: "C", label: { ja: "仕切る", en: "Command" }, desc: { ja: "前に出て決める", en: "steps up and calls it" } },
      right: { key: "B", label: { ja: "支える", en: "Backbone" }, desc: { ja: "後ろから支える", en: "holds it up from behind" } }
    }
  ],

  /* --- 相性の決め方 / How compatibility is derived.
     どちらも2回ひっくり返すと元に戻るので、相手から見ても同じ結果になります。
     Both are involutions, so pairs always agree with each other. --- */
  match: {
    good: {
      axes: [0, 3],
      label:  { ja: "相性がいい", en: "Works well with" },
      reason: {
        ja: "決め方と立ち位置が逆なので補い合えて、進め方と締切の感覚は同じ",
        en: "Opposite on deciding and standing, so you cover each other — same rhythm on working and timing"
      }
    },
    bad: {
      axes: [1, 2],
      label:  { ja: "噛み合わない", en: "Clashes with" },
      reason: {
        ja: "決め方も立ち位置も同じなのに、進め方と締切の感覚だけが逆",
        en: "Same instincts on deciding and standing, but the opposite rhythm on working and timing"
      }
    }
  },

  /* --- 質問 8問 / Eight questions --- */
  questions: [
    {
      axis: 0,
      q: { ja: "大事なことを決めるとき、近いのは。", en: "You have an important call to make." },
      choices: [
        { value: -3, text: { ja: "考える前に、だいたい答えは決まっている", en: "I usually know the answer before I start thinking" } },
        { value: -1, text: { ja: "ざっと調べて、あとは感覚で決める",       en: "I skim the options, then go with my gut" } },
        { value:  1, text: { ja: "材料を集めて、比べてから決める",         en: "I gather the facts and compare before deciding" } },
        { value:  3, text: { ja: "数字と根拠が揃うまでは決めない",         en: "I don't decide until the numbers back it up" } }
      ]
    },
    {
      axis: 0,
      q: { ja: "同僚に「なんとなく嫌な予感がする」と言われた。", en: "A colleague says: “I just have a bad feeling about this.”" },
      choices: [
        { value: -4, text: { ja: "その勘は、だいたい当たる",           en: "Their gut is probably right" } },
        { value: -2, text: { ja: "気にはなる",                       en: "It stays in the back of my mind" } },
        { value:  2, text: { ja: "なぜそう思うのか、理由を聞きたい",   en: "I want to hear why they think that" } },
        { value:  4, text: { ja: "根拠がないなら、判断材料にはしない", en: "Without evidence, it doesn't change my call" } }
      ]
    },
    {
      axis: 1,
      q: { ja: "仕事が一気に積み上がったとき。", en: "The work all lands at once." },
      choices: [
        { value: -3, text: { ja: "とにかく自分で片付ける",             en: "I put my head down and power through it" } },
        { value: -1, text: { ja: "自分でやりつつ、無理な分だけ頼む",   en: "I take it on, and hand off only what I can't do" } },
        { value:  1, text: { ja: "早めに人に振る",                     en: "I delegate early" } },
        { value:  3, text: { ja: "まず、誰と組むかを考える",           en: "First I work out who to team up with" } }
      ]
    },
    {
      axis: 1,
      q: { ja: "集中して作業したいとき、はかどるのは。", en: "You need to concentrate. What actually works?" },
      choices: [
        { value: -4, text: { ja: "誰もいない場所にこもる",   en: "Somewhere with nobody around" } },
        { value: -2, text: { ja: "通知を切って、一人になる", en: "Notifications off, on my own" } },
        { value:  2, text: { ja: "人がいる場所の方が進む",   en: "I get more done around other people" } },
        { value:  4, text: { ja: "誰かと話しながらの方が進む", en: "I get more done talking it through" } }
      ]
    },
    {
      axis: 2,
      q: { ja: "締切が2週間後の仕事を任された。", en: "You're handed something due in two weeks." },
      choices: [
        { value: -3, text: { ja: "すぐ着手して、早めに終わらせる",   en: "I start now and finish early" } },
        { value: -1, text: { ja: "計画を立てて、少しずつ進める",     en: "I plan it out and chip away at it" } },
        { value:  1, text: { ja: "半分を過ぎたあたりから本気を出す", en: "I get serious somewhere past halfway" } },
        { value:  3, text: { ja: "前日から始めて、なんとかする",     en: "I start the night before and pull it off" } }
      ]
    },
    {
      axis: 2,
      q: { ja: "締切に追われている、あの状態。", en: "That feeling of a deadline closing in." },
      choices: [
        { value: -4, text: { ja: "絶対に避けたい",               en: "I avoid it at all costs" } },
        { value: -2, text: { ja: "できれば避けたい",             en: "I'd rather not, honestly" } },
        { value:  2, text: { ja: "嫌ではあるが、集中はできる",   en: "Unpleasant, but I do focus" } },
        { value:  4, text: { ja: "正直、あのときが一番力が出る", en: "Honestly, that's when I'm at my best" } }
      ]
    },
    {
      axis: 3,
      q: { ja: "会議で話が止まってしまった。", en: "The meeting stalls. Nobody's saying anything." },
      choices: [
        { value: -3, text: { ja: "自分が仕切り直す",                     en: "I take over and restart it" } },
        { value: -1, text: { ja: "意見を出して、流れを変える",           en: "I put something out there to shift it" } },
        { value:  1, text: { ja: "誰かが動くのを待つ",                   en: "I wait for someone else to move" } },
        { value:  3, text: { ja: "決まったことを、確実に進める役に回る", en: "I take on making whatever we decide actually happen" } }
      ]
    },
    {
      axis: 3,
      q: { ja: "チームで褒められるなら、どれが嬉しいか。", en: "Your team thanks you. Which one lands best?" },
      choices: [
        { value: -4, text: { ja: "「引っ張ってくれた」",       en: "“You led us through it”" } },
        { value: -2, text: { ja: "「決めてくれた」",           en: "“You made the call”" } },
        { value:  2, text: { ja: "「支えてくれた」",           en: "“You had our backs”" } },
        { value:  4, text: { ja: "「いてくれて助かった」",     en: "“We were glad you were there”" } }
      ]
    }
  ],

  /* --- 16タイプ / The sixteen types --- */
  types: {
    ISEC: {
      name:  { ja: "独走型リーダー", en: "The Bolter" },
      catch: { ja: "気づけば、もう走り出している", en: "Already moving before anyone agreed" },
      body: {
        ja: "勘で方向を決め、人を待たずに動き、前倒しで終わらせる。判断も着手も速く、気づけば一人で先頭にいます。周りが追いついた頃には、もう次の話をしています。",
        en: "You pick a direction on instinct, move before anyone signs off, and finish ahead of schedule. By the time the room catches up, you are two problems ahead."
      },
      twist: { ja: "たまに振り返ると、誰もついてきていません。", en: "Every so often you look back and nobody is there." }
    },
    ISEB: {
      name:  { ja: "静かな先回り屋", en: "The Ghost Fixer" },
      catch: { ja: "頼まれる前に、もう終わっている", en: "Done before anyone thought to ask" },
      body: {
        ja: "感覚で先を読んで、一人で静かに片付ける。しかも早い。目立つ場所には立たないのに、気づけば全体が滑らかに回っています。",
        en: "You sense what is coming, handle it alone, and handle it early. You never stand anywhere visible, yet everything somehow runs smoothly."
      },
      twist: { ja: "早く終わらせすぎて、やったこと自体に気づかれていません。", en: "You finish so quietly that nobody registers it happened." }
    },
    ISLC: {
      name:  { ja: "火事場の司令塔", en: "The Crisis Commander" },
      catch: { ja: "追い込まれてから、いちばん冴える", en: "Sharpest with the clock against you" },
      body: {
        ja: "普段は静かなのに、締切が迫った瞬間に勘が働き、指示が的確になる。修羅場でいちばん頼りになるタイプです。",
        en: "Quiet most of the time. The moment the deadline bites, your instincts switch on and your calls get precise. In a genuine emergency, you are the one people look at."
      },
      twist: { ja: "その修羅場、半分くらいは自分で作っています。", en: "Roughly half of those emergencies are ones you created." }
    },
    ISLB: {
      name:  { ja: "締切前の職人", en: "The Deadline Artisan" },
      catch: { ja: "ぎりぎりでも、質だけは落とさない", en: "Late, but never rough" },
      body: {
        ja: "直前まで動かないのに、出てくるものの完成度は高い。一人で黙々と、感覚を頼りに仕上げ切ります。",
        en: "Nothing moves until the last stretch, and then what comes out is genuinely good. Alone, quietly, on feel."
      },
      twist: { ja: "その余裕のなさ、まわりからは全部見えています。", en: "The panic you think you are hiding is entirely visible." }
    },
    ITEC: {
      name:  { ja: "旗振り役", en: "The Starter" },
      catch: { ja: "「やろう」と最初に言う人", en: "The first one to say let's do it" },
      body: {
        ja: "直感で方向を決め、人を巻き込み、早めに動き出す。止まっていた空気を動かすのは、だいたいこのタイプです。",
        en: "You decide on instinct, bring people with you, and start early. When a room has gone still, you are usually the one who breaks it."
      },
      twist: { ja: "言い出した数と、終わった数が合っていません。", en: "The number of things you started does not match the number you finished." }
    },
    ITEB: {
      name:  { ja: "世話焼き幹事", en: "The Organizer" },
      catch: { ja: "全体が見えていて、先に手を打つ", en: "Sees the whole board, moves first" },
      body: {
        ja: "感覚で場の空気を読み、人と動き、早めに準備しておく。仕切るというより、みんなが動きやすいように整えておく人です。",
        en: "You read the room, work through people, and set things up before they are needed. Not leading exactly — clearing the way so everyone else can move."
      },
      twist: { ja: "自分の仕事だけが、いつも最後に残ります。", en: "Your own work is always the last thing left." }
    },
    ITLC: {
      name:  { ja: "祭り型リーダー", en: "The Rally Captain" },
      catch: { ja: "直前に、全員の火をつける", en: "Lights the whole room at the last minute" },
      body: {
        ja: "ぎりぎりまで動かない。ただし、いざとなれば人を集めて一気に片付ける。土壇場の一体感を作るのが、とにかく上手いタイプです。",
        en: "Nothing until the wire. Then you pull everyone in and it all gets done at once. Nobody manufactures last-minute momentum better."
      },
      twist: { ja: "その一体感、毎回まわりの寿命を削っています。", en: "That momentum costs everyone else a year of their life, every time." }
    },
    ITLB: {
      name:  { ja: "駆け込みムードメーカー", en: "The Cheerful Latecomer" },
      catch: { ja: "遅れているのに、なぜか場が明るい", en: "Behind schedule, somehow still fun" },
      body: {
        ja: "締切間際に人を巻き込みながら、空気だけは重くしない。感覚で動き、最後は支える側に回るタイプです。",
        en: "You pull people in late and still keep the mood off the floor. You move on feel, and you end up holding others up."
      },
      twist: { ja: "明るさで乗り切ってきた回数、そろそろ数えた方がいいです。", en: "You may want to count how many times charm has covered for the timeline." }
    },
    DSEC: {
      name:  { ja: "計画実行官", en: "The Executor" },
      catch: { ja: "決めたことを、決めた通りに", en: "The plan, exactly as written" },
      body: {
        ja: "根拠を集めて判断し、一人で前倒しに進める。計画が狂わない限り、最も確実に成果を出すタイプです。",
        en: "You decide on evidence and execute alone, ahead of time. As long as the plan holds, nobody delivers more reliably."
      },
      twist: { ja: "計画が狂ったときの不機嫌さは、隠せていません。", en: "When the plan does break, your mood is not as hidden as you think." }
    },
    DSEB: {
      name:  { ja: "縁の下の設計者", en: "The Invisible Architect" },
      catch: { ja: "誰も見ていないところを、整えている", en: "Fixing the part nobody looks at" },
      body: {
        ja: "調べて、備えて、一人で早めに片付ける。しかも表には出ない。仕組みが壊れずに回っているのは、この人がいるからです。",
        en: "You research, prepare, and finish early, alone and out of sight. The reason nothing has broken is you."
      },
      twist: { ja: "評価されないのは、報告していないからです。", en: "The reason nobody credits you is that you never told them." }
    },
    DSLC: {
      name:  { ja: "一夜漬けの戦略家", en: "The Overnight Strategist" },
      catch: { ja: "直前に調べて、直前に決める", en: "Reads everything at the last minute, then calls it right" },
      body: {
        ja: "動き出しは遅い。ただし根拠を一気に集めて、筋の通った判断を下す。短時間で組み立てる力が、異常に高いタイプです。",
        en: "You start late, absorb everything at once, and still land on a defensible answer. Your ability to assemble a case under time pressure is genuinely unusual."
      },
      twist: { ja: "毎回できてしまうので、反省する機会がありません。", en: "Because it keeps working, you have never once had to learn from it." }
    },
    DSLB: {
      name:  { ja: "詰めの職人", en: "The Finisher" },
      catch: { ja: "最後の最後で、精度を上げる", en: "The accuracy arrives at the very end" },
      body: {
        ja: "直前まで手が動かないが、そこから根拠を固めて一人で詰め切る。ミスの少なさで信頼されているタイプです。",
        en: "Nothing moves until late, and then you lock down every detail on your own. People trust you because your work does not come back wrong."
      },
      twist: { ja: "その詰め、もう少し早く始めれば徹夜は要りません。", en: "Start that same process two days earlier and the all-nighter disappears." }
    },
    DTEC: {
      name:  { ja: "段取りの司令塔", en: "The Master Planner" },
      catch: { ja: "始まる前に、勝負を決めている", en: "Wins it before the work starts" },
      body: {
        ja: "情報を集め、人を配置し、前倒しで進める。最も破綻の少ない進め方をする、組織の中でいちばん強いタイプです。",
        en: "You gather the information, place the people, and start early. Of all sixteen, this is the style that breaks down least often."
      },
      twist: { ja: "段取りが完璧すぎて、まわりが考えるのをやめています。", en: "The plan is so complete that everyone around you has quietly stopped thinking." }
    },
    DTEB: {
      name:  { ja: "整える参謀", en: "The Chief of Staff" },
      catch: { ja: "決めるのは他の人。整えるのは自分", en: "Someone else decides. You make it decidable" },
      body: {
        ja: "根拠を揃え、人と共有し、早めに準備しておく。前には出ないのに、この人がいる会議はなぜか結論が出ます。",
        en: "You line up the evidence, share it early, and prepare the ground. You never take the front, yet meetings you attend somehow reach a decision."
      },
      twist: { ja: "「では、まとめますね」で、また仕事が増えています。", en: "“I'll write it up” has cost you more evenings than you would like to admit." }
    },
    DTLC: {
      name:  { ja: "火消しの指揮官", en: "The Firefighter" },
      catch: { ja: "燃えてから、いちばん強い", en: "At your best once it's burning" },
      body: {
        ja: "平時は静か。ただし問題が起きた瞬間に情報を集め、人を動かし、収束させる。トラブルのたびに中心にいるタイプです。",
        en: "Quiet when things are calm. The instant something breaks you pull the facts, move the people, and close it out. Every incident has you at the centre."
      },
      twist: { ja: "火事がないと、少し退屈そうにしています。", en: "On a week with no fires, you look faintly bored." }
    },
    DTLB: {
      name:  { ja: "土壇場の調整役", en: "The Eleventh-Hour Fixer" },
      catch: { ja: "最後に、全部のつじつまを合わせる", en: "Makes the whole thing add up, at the end" },
      body: {
        ja: "直前になってから関係者に確認を取り、根拠を揃え、静かに全体を成立させる。この人がいないと、最後にどこかが必ず破綻します。",
        en: "Late in the day you check with everyone, line up the facts, and quietly make the whole thing hold together. Without you, something always fails at the last step."
      },
      twist: { ja: "その調整、誰にも気づかれないまま終わっています。", en: "That entire rescue went unnoticed, again." }
    }
  }
};
