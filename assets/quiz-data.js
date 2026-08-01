/* =========================================================
   診断の中身は、このファイルだけを直せば変えられます。
   All quiz content lives in this file.

   直したら必ず  node tools/build.js  を実行してください。
   After editing, always run: node tools/build.js

   ■ しくみ / How it works
   4つの軸に5問ずつ、合計20問。各軸の合計点のプラス／マイナスで
   1文字ずつ決まり、4文字のタイプ（例：DTEC）になります。16タイプ。

   ■ 点数のルール（大事） / Scoring rule (important)
   点数は必ず奇数（±1, ±3）だけを使い、1つの軸には奇数個の質問を置きます。
   奇数を奇数個足すと必ず奇数になるので、合計が0（引き分け）になりません。
   0になるとタイプが決まらないため、build.js がこれを検査して止めます。

   ■ 文章はすべて { ja, en } の形 / Every string is { ja, en }
   ========================================================= */

window.QUIZ_DATA = {
  siteUrl: "https://koron016.github.io/HP/",
  langs: ["en", "ja"],

  meta: {
    brand: { ja: "働き方16タイプ診断", en: "WSTI" },
    title: { ja: "働き方16タイプ診断", en: "WSTI — Work Style Type Indicator" },
    tagline: {
      ja: "何をやるかではなく、どう進めるか。",
      en: "Not what you do. How you do it."
    },
    description: {
      ja: "20の質問で、仕事の進め方が16タイプのどれかに分かれます。強み・注意点・自己PRのたたき台まで出ます。",
      en: "20 questions, 16 work styles. Get your type, your strengths, your blind spots, and a line you can put on a résumé."
    },
    hashtag: { ja: "働き方16タイプ診断", en: "WSTI" }
  },

  ui: {
    eyebrow:     { ja: "20の質問・3分", en: "20 questions · 3 minutes" },
    start:       { ja: "診断をはじめる", en: "Start the test" },
    startNote:   { ja: "結果はその場で出ます。登録も入力もありません。", en: "Instant result. No sign-up, nothing to fill in." },
    back:        { ja: "戻る", en: "Back" },
    resultLabel: { ja: "あなたのタイプは", en: "Your type is" },
    share:       { ja: "結果をXでシェア", en: "Share on X" },
    copy:        { ja: "リンクをコピー", en: "Copy link" },
    copied:      { ja: "コピーしました", en: "Copied" },
    retry:       { ja: "もう一度やる", en: "Take it again" },
    resultNote:  { ja: "友達は何タイプか、聞いてみてください。", en: "Ask your team what they got." },
    takeIt:      { ja: "自分も診断してみる", en: "Take the test" },
    oneOf:       { ja: "これは16タイプのうちのひとつです。", en: "This is one of sixteen types." },

    strengths:   { ja: "強み", en: "Strengths" },
    watchOut:    { ja: "気をつけたいこと", en: "Watch out for" },
    fits:        { ja: "力が出る環境", en: "Where you do your best work" },
    pitch:       { ja: "自己PRのたたき台", en: "A line for your résumé" },
    pitchNote: {
      ja: "面接やエントリーシートにそのまま置ける一文にしてあります。自分の経験に合わせて書き換えて使ってください。",
      en: "Written so you can drop it straight into an application or interview answer. Adapt it to your own experience."
    },

    noscript: {
      ja: "この診断はJavaScriptを使って動きます。ブラウザの設定で有効にしてから読み込み直してください。",
      en: "This test needs JavaScript. Enable it in your browser settings and reload."
    },

    /* --- チーム分布のページ / Team page --- */
    teamLink:    { ja: "チームの傾向を見る", en: "See your team's shape" },
    teamTitle:   { ja: "チーム分布", en: "Team Shape" },
    teamLead: {
      ja: "メンバーのタイプを選ぶと、チームの偏りと、足りていない持ち味が出ます。誰も評価しません。",
      en: "Add your team's types to see where the team leans and what it's missing. Nobody is being scored."
    },
    teamPick:    { ja: "タイプを選んで追加", en: "Add a type" },
    teamMembers: { ja: "メンバー", en: "Team" },
    teamEmpty:   { ja: "上からタイプを選んでください。2人以上で傾向が出ます。", en: "Pick types above. Two or more shows the shape." },
    teamRemove:  { ja: "外す", en: "Remove" },
    teamClear:   { ja: "全部消す", en: "Clear all" },
    teamShare:   { ja: "この結果のリンクをコピー", en: "Copy a link to this" },
    teamShareX:  { ja: "チームの傾向をXでシェア", en: "Share your team on X" },
    teamBalance: { ja: "チームの偏り", en: "Where the team leans" },
    teamGap:     { ja: "足りていない持ち味", en: "What the team is short of" },
    teamGapNone: { ja: "4つの軸すべてに、両側の人がいます。バランスの取れたチームです。", en: "Both sides are represented on all four axes. This is a balanced team." },
    teamPair:    { ja: "この2人の相性", en: "How these two work together" },
    teamBalanced:{ ja: "拮抗", en: "Balanced" },
    teamSkewed:  { ja: "偏り", en: "Skewed" },
    teamTakeTest:{ ja: "自分のタイプを調べる", en: "Find your own type" },
    teamRisk:    { ja: "この偏りで起きること", en: "What this costs you" },
    teamFix:     { ja: "打ち手", en: "What to do" },
    teamRiskNone:{ ja: "どの軸にも大きな偏りがありません。今のところ構造的な弱点は出ていません。", en: "No axis is badly skewed. No structural weak point right now." },
    teamSame:    { ja: "全員が同じタイプです。見えている景色が同じなので、抜けにも全員で気づけません。", en: "Everyone is the same type. You all see the same things — which means you all miss the same things." },
    teamNote: {
      ja: "選考には使わないでください。この診断は答えを取り繕えるため、合否の判断には向きません。入社後の相互理解や配属の材料としてお使いください。",
      en: "Do not use this for hiring decisions. The answers are easy to game, so it cannot support a pass/fail judgment. It is built for mutual understanding and team composition."
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
      left:  { key: "S", label: { ja: "単独", en: "Solo" },     desc: { ja: "一人で片付ける", en: "handles it alone" } },
      right: { key: "T", label: { ja: "巻き込み", en: "Together" }, desc: { ja: "人と組んで進める", en: "pulls people in" } }
    },
    {
      title: { ja: "締切", en: "Timing" },
      left:  { key: "E", label: { ja: "前倒し", en: "Early" },  desc: { ja: "早めに終わらせる", en: "finishes ahead" } },
      right: { key: "L", label: { ja: "追い込み", en: "Late" },  desc: { ja: "直前に力が出る", en: "peaks at the buzzer" } }
    },
    {
      title: { ja: "立ち位置", en: "Standing" },
      left:  { key: "C", label: { ja: "仕切る", en: "Command" },  desc: { ja: "前に出て決める", en: "steps up and calls it" } },
      right: { key: "B", label: { ja: "支える", en: "Backbone" }, desc: { ja: "後ろから支える", en: "holds it up from behind" } }
    }
  ],

  match: {
    good: {
      axes: [0, 3],
      label: { ja: "相性がいい", en: "Works well with" },
      reason: {
        ja: "決め方と立ち位置が逆なので補い合えて、進め方と締切の感覚は同じ",
        en: "Opposite on deciding and standing, so you cover each other — same rhythm on working and timing"
      }
    },
    bad: {
      axes: [1, 2],
      label: { ja: "噛み合わない", en: "Clashes with" },
      reason: {
        ja: "決め方も立ち位置も同じなのに、進め方と締切の感覚だけが逆",
        en: "Same instincts on deciding and standing, but the opposite rhythm on working and timing"
      }
    }
  },

  /* --- 偏ったときに起きること と、その打ち手 ---
     チームが片側に75%以上寄ったときに出します。ここがMBTIにはない部分で、
     「誰がどのタイプか」ではなく「この組み合わせだと何が起きるか」を言います。 --- */
  risks: {
    I: {
      risk: { ja: "検証が抜けたまま進み、後になって前提が崩れる", en: "You move without checking, and the premise collapses later" },
      fix:  { ja: "決める前に「根拠は？」と聞く役を、会議ごとに1人決めておく", en: "Assign one person per meeting whose job is to ask “what's this based on?”" }
    },
    D: {
      risk: { ja: "材料が揃うまで決まらず、判断が遅れて機会を逃す", en: "Nothing gets decided until the evidence is in, and you miss the window" },
      fix:  { ja: "「この日までに決める」と、情報が揃う前に期限を切っておく", en: "Set the decision date before the information arrives, not after" }
    },
    S: {
      risk: { ja: "仕事が属人化し、その人が抜けた瞬間に止まる", en: "Work lives in individual heads, and stops dead when someone leaves" },
      fix:  { ja: "週に一度、何をやっているかを短く共有する時間を作る", en: "Once a week, a short round where everyone says what they're actually doing" }
    },
    T: {
      risk: { ja: "相談と会議ばかりで、手が動く時間が残らない", en: "So much talking that nobody has time to make anything" },
      fix:  { ja: "相談しない時間帯を全員で決めて、そこは声をかけない", en: "Agree on hours when nobody interrupts anyone" }
    },
    E: {
      risk: { ja: "想定外が起きたときに、土壇場で踏ん張る人がいない", en: "When something unexpected hits, nobody is built to absorb it" },
      fix:  { ja: "計画に、意図的に何も入れない予備日を先に置いておく", en: "Put deliberately empty days into the plan up front" }
    },
    L: {
      risk: { ja: "常に締切間際で燃える。前半の時間が丸ごと死んでいる", en: "Everything burns at the deadline, and the first half of every schedule is wasted" },
      fix:  { ja: "本番の1週間前に、中間の締切を本物として置く", en: "Set a real interim deadline a week before the real one" }
    },
    C: {
      risk: { ja: "決定権が競合して会議が長引き、方針が二転三転する", en: "Competing decision-makers stretch meetings out and the direction keeps flipping" },
      fix:  { ja: "案件ごとに「最後に決める人」を、始める前に1人決める", en: "Name one final decision-maker per project, before the work starts" }
    },
    B: {
      risk: { ja: "誰も決めないまま止まる。責任の所在が曖昧になる", en: "Nothing gets decided, everything stalls, and nobody owns it" },
      fix:  { ja: "持ち回りでいいので、決める人を必ず1人立てる", en: "Always have one decider, even if the role just rotates" }
    }
  },

  /* --- 質問 20問（各軸5問）/ Twenty questions, five per axis --- */
  questions: [
    /* ===== 軸0：決め方 / Deciding ===== */
    {
      axis: 0,
      q: { ja: "大事なことを決めるとき、近いのは。", en: "You have an important call to make." },
      choices: [
        { value: -3, text: { ja: "考える前に、だいたい答えは決まっている", en: "I usually know the answer before I start thinking" } },
        { value: -1, text: { ja: "ざっと調べて、あとは感覚で決める", en: "I skim the options, then go with my gut" } },
        { value:  1, text: { ja: "材料を集めて、比べてから決める", en: "I gather the facts and compare before deciding" } },
        { value:  3, text: { ja: "数字と根拠が揃うまでは決めない", en: "I don't decide until the numbers back it up" } }
      ]
    },
    {
      axis: 0,
      q: { ja: "同僚に「なんとなく嫌な予感がする」と言われた。", en: "A colleague says: “I just have a bad feeling about this.”" },
      choices: [
        { value: -3, text: { ja: "その勘は、だいたい当たる", en: "Their gut is probably right" } },
        { value: -1, text: { ja: "少し気になる", en: "It stays in the back of my mind" } },
        { value:  1, text: { ja: "なぜそう思うのか、理由を聞きたい", en: "I want to hear why they think that" } },
        { value:  3, text: { ja: "根拠がないなら、判断は変えない", en: "Without evidence, it doesn't change my call" } }
      ]
    },
    {
      axis: 0,
      q: { ja: "前例のない仕事を任された。", en: "You're handed something with no precedent." },
      choices: [
        { value: -3, text: { ja: "とりあえず動きながら考える", en: "I start moving and figure it out on the way" } },
        { value: -1, text: { ja: "大枠だけ決めて走り出す", en: "I set a rough direction and go" } },
        { value:  1, text: { ja: "似た事例を探してから始める", en: "I look for comparable cases first" } },
        { value:  3, text: { ja: "手順を固めてから着手する", en: "I nail down the process before touching it" } }
      ]
    },
    {
      axis: 0,
      q: { ja: "会議で急に意見を求められた。", en: "You're put on the spot in a meeting." },
      choices: [
        { value: -3, text: { ja: "思ったことをそのまま言う", en: "I say what I actually think" } },
        { value: -1, text: { ja: "感覚的な違和感を伝える", en: "I flag what feels off, even without proof" } },
        { value:  1, text: { ja: "根拠を添えて話す", en: "I answer with reasons attached" } },
        { value:  3, text: { ja: "資料を用意してから話したい", en: "I'd rather come back once I've prepared" } }
      ]
    },
    {
      axis: 0,
      q: { ja: "これまでの自分の判断を振り返ると。", en: "Looking back at the calls you've made." },
      choices: [
        { value: -3, text: { ja: "直感が当たっていたことが多い", en: "My instincts have mostly been right" } },
        { value: -1, text: { ja: "勘に助けられたことがある", en: "My gut has bailed me out more than once" } },
        { value:  1, text: { ja: "調べた分だけ良くなったと思う", en: "The more I checked, the better they got" } },
        { value:  3, text: { ja: "情報不足の失敗が記憶に残っている", en: "The failures I remember came from missing information" } }
      ]
    },

    /* ===== 軸1：進め方 / Working ===== */
    {
      axis: 1,
      q: { ja: "仕事が一気に積み上がったとき。", en: "The work all lands at once." },
      choices: [
        { value: -3, text: { ja: "とにかく自分で片付ける", en: "I put my head down and power through" } },
        { value: -1, text: { ja: "自分でやりつつ、無理な分だけ頼む", en: "I take it on, handing off only what I can't do" } },
        { value:  1, text: { ja: "早めに人に振る", en: "I delegate early" } },
        { value:  3, text: { ja: "まず、誰と組むかを考える", en: "First I work out who to team up with" } }
      ]
    },
    {
      axis: 1,
      q: { ja: "集中して作業したいとき、はかどるのは。", en: "You need to concentrate. What actually works?" },
      choices: [
        { value: -3, text: { ja: "誰もいない場所にこもる", en: "Somewhere with nobody around" } },
        { value: -1, text: { ja: "通知を切って、一人になる", en: "Notifications off, on my own" } },
        { value:  1, text: { ja: "人がいる場所の方が進む", en: "I get more done around other people" } },
        { value:  3, text: { ja: "誰かと話しながらの方が進む", en: "I get more done talking it through" } }
      ]
    },
    {
      axis: 1,
      q: { ja: "作業が詰まって、進まなくなった。", en: "You're stuck and nothing is moving." },
      choices: [
        { value: -3, text: { ja: "自分で解けるまで粘る", en: "I stay on it until I crack it myself" } },
        { value: -1, text: { ja: "一通り試してから聞く", en: "I exhaust my options, then ask" } },
        { value:  1, text: { ja: "早めに人に相談する", en: "I bring someone in early" } },
        { value:  3, text: { ja: "すぐ誰かをつかまえる", en: "I grab the nearest person immediately" } }
      ]
    },
    {
      axis: 1,
      q: { ja: "うまくいったとき、嬉しいのは。", en: "It went well. What feels best?" },
      choices: [
        { value: -3, text: { ja: "一人でやり切った達成感", en: "Knowing I carried it alone" } },
        { value: -1, text: { ja: "自分の担当が形になったこと", en: "Seeing my own part come together" } },
        { value:  1, text: { ja: "チームで喜べること", en: "Celebrating it as a team" } },
        { value:  3, text: { ja: "みんなで作ったという感覚", en: "The sense that we built it together" } }
      ]
    },
    {
      axis: 1,
      q: { ja: "新しい環境に入ったら、まず何をするか。", en: "First week somewhere new. What do you do?" },
      choices: [
        { value: -3, text: { ja: "まず自分の仕事を覚える", en: "Learn my own job first" } },
        { value: -1, text: { ja: "必要な範囲で人に聞く", en: "Ask people only what I need to know" } },
        { value:  1, text: { ja: "早めに人の顔と役割を覚える", en: "Learn who does what, early" } },
        { value:  3, text: { ja: "とりあえず全員と話しに行く", en: "Go talk to everyone" } }
      ]
    },

    /* ===== 軸2：締切 / Timing ===== */
    {
      axis: 2,
      q: { ja: "締切が2週間後の仕事を任された。", en: "You're handed something due in two weeks." },
      choices: [
        { value: -3, text: { ja: "すぐ着手して、早めに終わらせる", en: "I start now and finish early" } },
        { value: -1, text: { ja: "計画を立てて、少しずつ進める", en: "I plan it out and chip away" } },
        { value:  1, text: { ja: "半分を過ぎたあたりから本気を出す", en: "I get serious somewhere past halfway" } },
        { value:  3, text: { ja: "前日から始めて、なんとかする", en: "I start the night before and pull it off" } }
      ]
    },
    {
      axis: 2,
      q: { ja: "締切に追われている、あの状態。", en: "That feeling of a deadline closing in." },
      choices: [
        { value: -3, text: { ja: "絶対に避けたい", en: "I avoid it at all costs" } },
        { value: -1, text: { ja: "できれば避けたい", en: "I'd rather not, honestly" } },
        { value:  1, text: { ja: "嫌ではあるが、集中はできる", en: "Unpleasant, but I do focus" } },
        { value:  3, text: { ja: "正直、あのときが一番力が出る", en: "Honestly, that's when I'm at my best" } }
      ]
    },
    {
      axis: 2,
      q: { ja: "予定より早く終わってしまった。", en: "You finish ahead of schedule." },
      choices: [
        { value: -3, text: { ja: "すぐ次の仕事に取りかかる", en: "I move straight to the next thing" } },
        { value: -1, text: { ja: "見直しに時間を使う", en: "I spend the time reviewing it" } },
        { value:  1, text: { ja: "少し寝かせてから見直す", en: "I let it sit, then look again" } },
        { value:  3, text: { ja: "そもそも早く終わることがない", en: "This does not happen to me" } }
      ]
    },
    {
      axis: 2,
      q: { ja: "本番に向けた準備にかける時間は。", en: "How much runway do you give yourself?" },
      choices: [
        { value: -3, text: { ja: "本番より準備の方が長い", en: "The prep takes longer than the thing itself" } },
        { value: -1, text: { ja: "十分に取る方だ", en: "I give myself plenty" } },
        { value:  1, text: { ja: "必要最低限で足りる", en: "The minimum is enough" } },
        { value:  3, text: { ja: "ほぼぶっつけでいける", en: "I can more or less wing it" } }
      ]
    },
    {
      axis: 2,
      q: { ja: "締切が1週間延びた、と連絡が来た。", en: "The deadline just moved a week later." },
      choices: [
        { value: -3, text: { ja: "予定通り、早く出す", en: "I still hand it in on my original date" } },
        { value: -1, text: { ja: "少し余裕ができたと思う", en: "Nice — a bit of breathing room" } },
        { value:  1, text: { ja: "着手を後ろにずらす", en: "I push my start back" } },
        { value:  3, text: { ja: "延びた分だけ、遅く始める", en: "I start exactly one week later" } }
      ]
    },

    /* ===== 軸3：立ち位置 / Standing ===== */
    {
      axis: 3,
      q: { ja: "会議で話が止まってしまった。", en: "The meeting stalls. Nobody's saying anything." },
      choices: [
        { value: -3, text: { ja: "自分が仕切り直す", en: "I take over and restart it" } },
        { value: -1, text: { ja: "意見を出して、流れを変える", en: "I put something out there to shift it" } },
        { value:  1, text: { ja: "誰かが動くのを待つ", en: "I wait for someone else to move" } },
        { value:  3, text: { ja: "決まったことを進める役に回る", en: "I focus on making whatever we decide happen" } }
      ]
    },
    {
      axis: 3,
      q: { ja: "チームで褒められるなら、どれが嬉しいか。", en: "Your team thanks you. Which one lands best?" },
      choices: [
        { value: -3, text: { ja: "「引っ張ってくれた」", en: "“You led us through it”" } },
        { value: -1, text: { ja: "「決めてくれた」", en: "“You made the call”" } },
        { value:  1, text: { ja: "「支えてくれた」", en: "“You had our backs”" } },
        { value:  3, text: { ja: "「いてくれて助かった」", en: "“We were glad you were there”" } }
      ]
    },
    {
      axis: 3,
      q: { ja: "役割がはっきり決まっていない場面で。", en: "Nobody has assigned roles yet." },
      choices: [
        { value: -3, text: { ja: "自分が仕切った方が早いと思う", en: "It's faster if I just run it" } },
        { value: -1, text: { ja: "必要なら引き受ける", en: "I'll take it if it needs taking" } },
        { value:  1, text: { ja: "得意な人に任せたい", en: "I'd rather it went to whoever's best at it" } },
        { value:  3, text: { ja: "補佐に回る方が力が出る", en: "I'm better as the second pair of hands" } }
      ]
    },
    {
      axis: 3,
      q: { ja: "意見が真っ二つに割れたとき。", en: "The room splits down the middle." },
      choices: [
        { value: -3, text: { ja: "自分が結論を出す", en: "I make the call" } },
        { value: -1, text: { ja: "議論を整理して詰める", en: "I structure the argument and drive it to an end" } },
        { value:  1, text: { ja: "間を取り持つ", en: "I work the middle ground" } },
        { value:  3, text: { ja: "決まった方に全力で乗る", en: "I back whichever way it lands, fully" } }
      ]
    },
    {
      axis: 3,
      q: { ja: "責任を負うことについて。", en: "On carrying the responsibility." },
      choices: [
        { value: -3, text: { ja: "背負っている方が動きやすい", en: "I move better when it's on me" } },
        { value: -1, text: { ja: "引き受けること自体は平気", en: "I don't mind taking it" } },
        { value:  1, text: { ja: "分担されている方がいい", en: "I prefer it shared out" } },
        { value:  3, text: { ja: "支える立場の方が力が出る", en: "I'm stronger supporting than owning" } }
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
      twist: { ja: "たまに振り返ると、誰もついてきていません。", en: "Every so often you look back and nobody is there." },
      strengths: {
        ja: ["立ち上がりが誰よりも速い", "決断に迷いがない", "誰も動かない場面で最初に動ける"],
        en: ["Fastest from a standing start", "Decides without stalling", "Moves first when nobody else will"]
      },
      watchOut: {
        ja: ["共有が後回しになり、状況が自分にしか見えていない", "抱え込んで、引き継げない仕事が増える"],
        en: ["You share context too late, so only you can see the whole picture", "Work piles up that nobody else could take over"]
      },
      fits: {
        ja: "裁量が大きく、判断の速さがそのまま成果になる環境。立ち上げ期の事業や、決裁の少ない組織。",
        en: "Roles with real autonomy where speed of judgment is the output — early-stage teams, flat organisations, few approval gates."
      },
      pitch: {
        ja: "前例のない状況でも自分で判断して最初に動き、周囲が後から動きやすい状態を作ってきました。",
        en: "In situations with no precedent, I make the first call and move, then leave things in a state others can build on."
      }
    },
    ISEB: {
      name:  { ja: "静かな先回り屋", en: "The Ghost Fixer" },
      catch: { ja: "頼まれる前に、もう終わっている", en: "Done before anyone thought to ask" },
      body: {
        ja: "感覚で先を読んで、一人で静かに片付ける。しかも早い。目立つ場所には立たないのに、気づけば全体が滑らかに回っています。",
        en: "You sense what is coming, handle it alone, and handle it early. You never stand anywhere visible, yet everything somehow runs smoothly."
      },
      twist: { ja: "早く終わらせすぎて、やったこと自体に気づかれていません。", en: "You finish so quietly that nobody registers it happened." },
      strengths: {
        ja: ["問題が起きる前に気づいて潰せる", "催促されなくても終わっている", "人の仕事の穴に自然に気づく"],
        en: ["Spots problems before they surface", "Never needs chasing", "Notices the gaps in other people's work"]
      },
      watchOut: {
        ja: ["やった仕事が見えず、評価につながりにくい", "自分の貢献を説明する機会を逃しがち"],
        en: ["Your work is invisible, so it rarely turns into credit", "You keep missing the moment to say what you did"]
      },
      fits: {
        ja: "先回りの価値を見てくれる上司がいる環境。品質や運用が効いてくる、長く続く仕事。",
        en: "Somewhere with a manager who notices prevention — long-running work where quality and operations compound."
      },
      pitch: {
        ja: "問題が表面化する前に気づいて手を打ち、トラブルそのものが起きない状態を作ってきました。",
        en: "I catch problems before they surface and deal with them, so the trouble never actually happens."
      }
    },
    ISLC: {
      name:  { ja: "火事場の司令塔", en: "The Crisis Commander" },
      catch: { ja: "追い込まれてから、いちばん冴える", en: "Sharpest with the clock against you" },
      body: {
        ja: "普段は静かなのに、締切が迫った瞬間に勘が働き、指示が的確になる。修羅場でいちばん頼りになるタイプです。",
        en: "Quiet most of the time. The moment the deadline bites, your instincts switch on and your calls get precise. In a genuine emergency, you are the one people look at."
      },
      twist: { ja: "その修羅場、半分くらいは自分で作っています。", en: "Roughly half of those emergencies are ones you created." },
      strengths: {
        ja: ["時間がない状況で判断の質が落ちない", "混乱した場を一人で立て直せる", "優先順位をその場で切れる"],
        en: ["Judgment holds up when there's no time", "Can steady a chaotic situation single-handedly", "Cuts priorities on the spot"]
      },
      watchOut: {
        ja: ["平常時に力を出しきれていない", "周りが常に緊張を強いられる"],
        en: ["You underperform when nothing is on fire", "The people around you live at a higher stress level than they need to"]
      },
      fits: {
        ja: "障害対応、納期直前の巻き返し、想定外が日常的に起きる現場。",
        en: "Incident response, recovering a slipping deadline, any environment where the unexpected is routine."
      },
      pitch: {
        ja: "時間と情報が足りない状況で優先順位を決め、混乱した現場を立て直してきました。",
        en: "I set priorities when there is neither enough time nor enough information, and bring chaotic situations back under control."
      }
    },
    ISLB: {
      name:  { ja: "締切前の職人", en: "The Deadline Artisan" },
      catch: { ja: "ぎりぎりでも、質だけは落とさない", en: "Late, but never rough" },
      body: {
        ja: "直前まで動かないのに、出てくるものの完成度は高い。一人で黙々と、感覚を頼りに仕上げ切ります。",
        en: "Nothing moves until the last stretch, and then what comes out is genuinely good. Alone, quietly, on feel."
      },
      twist: { ja: "その余裕のなさ、まわりからは全部見えています。", en: "The panic you think you are hiding is entirely visible." },
      strengths: {
        ja: ["短時間で完成度の高いものを出せる", "仕上げの感覚が鋭い", "自分の手で最後まで責任を持つ"],
        en: ["Produces high-quality work in very little time", "Sharp instincts at the finishing stage", "Owns it through to the end personally"]
      },
      watchOut: {
        ja: ["進捗が見えず、周囲を不安にさせる", "余白がないので、想定外に弱い"],
        en: ["Nobody can see your progress, which makes them anxious", "No slack in the schedule, so surprises hit hard"]
      },
      fits: {
        ja: "成果物の質で評価される仕事。制作、設計、執筆など、手を動かす裁量が大きい役割。",
        en: "Work judged on the artifact itself — design, build, writing, anything where the craft is the deliverable."
      },
      pitch: {
        ja: "限られた時間の中でも仕上がりの水準を落とさず、最後まで自分の責任で形にしてきました。",
        en: "Even on a compressed timeline I hold the quality bar, and I carry the work to completion myself."
      }
    },
    ITEC: {
      name:  { ja: "旗振り役", en: "The Starter" },
      catch: { ja: "「やろう」と最初に言う人", en: "The first one to say let's do it" },
      body: {
        ja: "直感で方向を決め、人を巻き込み、早めに動き出す。止まっていた空気を動かすのは、だいたいこのタイプです。",
        en: "You decide on instinct, bring people with you, and start early. When a room has gone still, you are usually the one who breaks it."
      },
      twist: { ja: "言い出した数と、終わった数が合っていません。", en: "The number of things you started does not match the number you finished." },
      strengths: {
        ja: ["止まった場を動かせる", "人を巻き込むのが速い", "新しい取り組みの初速を作れる"],
        en: ["Gets a stalled room moving", "Recruits people fast", "Creates early momentum on anything new"]
      },
      watchOut: {
        ja: ["広げた案件を回収しきれない", "勢いで決めて、後から前提が崩れる"],
        en: ["You open more than you close", "Decisions made on momentum sometimes lose their footing later"]
      },
      fits: {
        ja: "新規事業、社内の立ち上げ、人を動かす必要がある企画職。",
        en: "New ventures, internal launches, any role where the job is to get people moving."
      },
      pitch: {
        ja: "誰も動いていない状況で最初に声を上げ、必要な人を集めて動き出せる状態にしてきました。",
        en: "When nothing is moving, I am the one who speaks first, gathers the people needed, and gets it started."
      }
    },
    ITEB: {
      name:  { ja: "世話焼き幹事", en: "The Organizer" },
      catch: { ja: "全体が見えていて、先に手を打つ", en: "Sees the whole board, moves first" },
      body: {
        ja: "感覚で場の空気を読み、人と動き、早めに準備しておく。仕切るというより、みんなが動きやすいように整えておく人です。",
        en: "You read the room, work through people, and set things up before they are needed. Not leading exactly — clearing the way so everyone else can move."
      },
      twist: { ja: "自分の仕事だけが、いつも最後に残ります。", en: "Your own work is always the last thing left." },
      strengths: {
        ja: ["全体の段取りが自然に見えている", "人が動きやすい状態を作れる", "抜け漏れに先に気づく"],
        en: ["Sees the logistics of the whole thing without trying", "Makes it easy for everyone else to move", "Catches what's been forgotten, first"]
      },
      watchOut: {
        ja: ["人の仕事を引き受けすぎる", "自分の成果が後回しになる"],
        en: ["You absorb too much of other people's work", "Your own deliverables slide to last"]
      },
      fits: {
        ja: "複数の人と部署をまたぐ仕事。進行管理、運営、コーディネーター的な役割。",
        en: "Work that spans people and departments — programme management, operations, coordination."
      },
      pitch: {
        ja: "関係者が多い場面で全体の段取りを整え、それぞれが動きやすい状態を先に作ってきました。",
        en: "With a lot of moving parts, I get the logistics in order first so everyone involved can just get on with their piece."
      }
    },
    ITLC: {
      name:  { ja: "祭り型リーダー", en: "The Rally Captain" },
      catch: { ja: "直前に、全員の火をつける", en: "Lights the whole room at the last minute" },
      body: {
        ja: "ぎりぎりまで動かない。ただし、いざとなれば人を集めて一気に片付ける。土壇場の一体感を作るのが、とにかく上手いタイプです。",
        en: "Nothing until the wire. Then you pull everyone in and it all gets done at once. Nobody manufactures last-minute momentum better."
      },
      twist: { ja: "その一体感、毎回まわりの寿命を削っています。", en: "That momentum costs everyone else a year of their life, every time." },
      strengths: {
        ja: ["短期決戦で人を動かせる", "追い込まれた場の空気を変えられる", "巻き返しの推進力がある"],
        en: ["Mobilises people for a sprint", "Changes the mood of a team under pressure", "Real horsepower on a comeback"]
      },
      watchOut: {
        ja: ["巻き込む側の負担が読めていない", "平常時の進行が遅れがち"],
        en: ["You underestimate what the sprint costs the people you pulled in", "Steady-state progress slips"]
      },
      fits: {
        ja: "短期集中のプロジェクト、キャンペーン、期限が明確な巻き返し局面。",
        en: "Short, intense projects, campaigns, and recoveries with a hard date."
      },
      pitch: {
        ja: "納期が迫った局面で関係者を集め、短期間で巻き返す推進役を担ってきました。",
        en: "When a deadline is closing in, I bring the right people together and drive the recovery in the time that's left."
      }
    },
    ITLB: {
      name:  { ja: "駆け込みムードメーカー", en: "The Cheerful Latecomer" },
      catch: { ja: "遅れているのに、なぜか場が明るい", en: "Behind schedule, somehow still fun" },
      body: {
        ja: "締切間際に人を巻き込みながら、空気だけは重くしない。感覚で動き、最後は支える側に回るタイプです。",
        en: "You pull people in late and still keep the mood off the floor. You move on feel, and you end up holding others up."
      },
      twist: { ja: "明るさで乗り切ってきた回数、そろそろ数えた方がいいです。", en: "You may want to count how many times charm has covered for the timeline." },
      strengths: {
        ja: ["緊張した場の空気を和らげられる", "人が離脱しないよう繋ぎ止められる", "頼みごとがしやすい存在になる"],
        en: ["Takes the edge off a tense room", "Keeps people from checking out", "Is easy to ask things of"]
      },
      watchOut: {
        ja: ["雰囲気で問題が先送りされる", "遅れの原因が共有されないまま進む"],
        en: ["Good mood can postpone a real problem", "The reason for the delay never gets said out loud"]
      },
      fits: {
        ja: "人の入れ替わりが多い現場、対人の負荷が高い仕事、チームの潤滑油が必要な場面。",
        en: "High-turnover teams, people-heavy roles, anywhere a team needs someone holding it together socially."
      },
      pitch: {
        ja: "負荷の高い局面でもチームの空気を保ち、関係者が離れないよう繋ぎ役を担ってきました。",
        en: "Under pressure I keep the team's morale intact and hold the people side together so nobody drops out."
      }
    },
    DSEC: {
      name:  { ja: "計画実行官", en: "The Executor" },
      catch: { ja: "決めたことを、決めた通りに", en: "The plan, exactly as written" },
      body: {
        ja: "根拠を集めて判断し、一人で前倒しに進める。計画が狂わない限り、最も確実に成果を出すタイプです。",
        en: "You decide on evidence and execute alone, ahead of time. As long as the plan holds, nobody delivers more reliably."
      },
      twist: { ja: "計画が狂ったときの不機嫌さは、隠せていません。", en: "When the plan does break, your mood is not as hidden as you think." },
      strengths: {
        ja: ["約束した期日と品質を守り切る", "根拠のある判断ができる", "一人で完結させられる"],
        en: ["Hits the date and the bar you promised", "Decisions you can show your working for", "Can carry it end to end alone"]
      },
      watchOut: {
        ja: ["前提が変わる場面で切り替えが遅い", "計画外の相談を歓迎しない空気が出る"],
        en: ["Slow to switch when the premise changes", "You give off a signal that unplanned requests are unwelcome"]
      },
      fits: {
        ja: "品質と納期の基準がはっきりしている仕事。要件が固まってからの実行フェーズ。",
        en: "Work with clear quality and delivery standards — the execution phase, once requirements are settled."
      },
      pitch: {
        ja: "根拠をもとに計画を立て、期日と品質の基準を守って最後まで実行してきました。",
        en: "I build the plan on evidence and then deliver it, holding both the deadline and the quality bar."
      }
    },
    DSEB: {
      name:  { ja: "縁の下の設計者", en: "The Invisible Architect" },
      catch: { ja: "誰も見ていないところを、整えている", en: "Fixing the part nobody looks at" },
      body: {
        ja: "調べて、備えて、一人で早めに片付ける。しかも表には出ない。仕組みが壊れずに回っているのは、この人がいるからです。",
        en: "You research, prepare, and finish early, alone and out of sight. The reason nothing has broken is you."
      },
      twist: { ja: "評価されないのは、報告していないからです。", en: "The reason nobody credits you is that you never told them." },
      strengths: {
        ja: ["壊れにくい仕組みを作れる", "地味な整備を続けられる", "根拠を残す習慣がある"],
        en: ["Builds things that don't break", "Sustains unglamorous maintenance work", "Habitually leaves a paper trail"]
      },
      watchOut: {
        ja: ["成果が見えず、正当に評価されにくい", "重要度を人に伝える機会が少ない"],
        en: ["Invisible output means undervalued work", "Few chances for anyone to learn why it mattered"]
      },
      fits: {
        ja: "基盤・仕組み・ルールを整える仕事。継続運用が前提の領域。",
        en: "Infrastructure, systems, and standards — anywhere the work is meant to keep running for years."
      },
      pitch: {
        ja: "壊れにくい仕組みを設計し、継続して回る状態を作ることで、問題の発生自体を減らしてきました。",
        en: "I design systems that hold up, and keep them running, so the failures stop occurring in the first place."
      }
    },
    DSLC: {
      name:  { ja: "一夜漬けの戦略家", en: "The Overnight Strategist" },
      catch: { ja: "直前に調べて、直前に決める", en: "Reads everything at the last minute, then calls it right" },
      body: {
        ja: "動き出しは遅い。ただし根拠を一気に集めて、筋の通った判断を下す。短時間で組み立てる力が、異常に高いタイプです。",
        en: "You start late, absorb everything at once, and still land on a defensible answer. Your ability to assemble a case under time pressure is genuinely unusual."
      },
      twist: { ja: "毎回できてしまうので、反省する機会がありません。", en: "Because it keeps working, you have never once had to learn from it." },
      strengths: {
        ja: ["短時間で大量の情報を処理できる", "急な判断でも筋が通っている", "説明できる結論を出せる"],
        en: ["Processes a lot of information fast", "Snap decisions still hold together", "Reaches conclusions you can defend"]
      },
      watchOut: {
        ja: ["前半の時間を活かしきれていない", "同じやり方が通じない規模になると崩れる"],
        en: ["The first half of every timeline goes unused", "The approach stops scaling at some size"]
      },
      fits: {
        ja: "判断の質が問われる仕事。分析、企画、意思決定の支援。",
        en: "Roles judged on the quality of the call — analysis, strategy, decision support."
      },
      pitch: {
        ja: "限られた時間で必要な情報を集め、根拠を示せる形で結論を出してきました。",
        en: "In a narrow window I gather what's needed and reach a conclusion I can show the reasoning for."
      }
    },
    DSLB: {
      name:  { ja: "詰めの職人", en: "The Finisher" },
      catch: { ja: "最後の最後で、精度を上げる", en: "The accuracy arrives at the very end" },
      body: {
        ja: "直前まで手が動かないが、そこから根拠を固めて一人で詰め切る。ミスの少なさで信頼されているタイプです。",
        en: "Nothing moves until late, and then you lock down every detail on your own. People trust you because your work does not come back wrong."
      },
      twist: { ja: "その詰め、もう少し早く始めれば徹夜は要りません。", en: "Start that same process two days earlier and the all-nighter disappears." },
      strengths: {
        ja: ["最終品質が安定している", "抜け漏れを見つけるのが速い", "手戻りを起こさない"],
        en: ["Consistent final quality", "Fast at spotting what's missing", "Work doesn't come back for rework"]
      },
      watchOut: {
        ja: ["着手が遅く、周囲が進捗を掴めない", "余裕がないため、差し込みに弱い"],
        en: ["Late starts leave others unable to see progress", "No buffer, so interruptions hurt"]
      },
      fits: {
        ja: "正確さが要求される仕事。検証、品質保証、数字を扱う業務。",
        en: "Work where accuracy is the point — verification, QA, anything numerical."
      },
      pitch: {
        ja: "最終確認で抜け漏れを検出し、手戻りのない状態にして送り出してきました。",
        en: "I catch what's missing at the final check, so what ships doesn't come back."
      }
    },
    DTEC: {
      name:  { ja: "段取りの司令塔", en: "The Master Planner" },
      catch: { ja: "始まる前に、勝負を決めている", en: "Wins it before the work starts" },
      body: {
        ja: "情報を集め、人を配置し、前倒しで進める。最も破綻の少ない進め方をする、組織の中でいちばん強いタイプです。",
        en: "You gather the information, place the people, and start early. Of all sixteen, this is the style that breaks down least often."
      },
      twist: { ja: "段取りが完璧すぎて、まわりが考えるのをやめています。", en: "The plan is so complete that everyone around you has quietly stopped thinking." },
      strengths: {
        ja: ["計画の精度が高い", "人と情報の両方を動かせる", "リスクを事前に潰せる"],
        en: ["Plans that actually hold", "Moves both people and information", "Retires risk before it lands"]
      },
      watchOut: {
        ja: ["周囲が指示待ちになりやすい", "自分の計画から外れる案を受け入れにくい"],
        en: ["People default to waiting for your instructions", "Hard to accept an idea that departs from your plan"]
      },
      fits: {
        ja: "規模の大きい案件、複数チームの統括、責任範囲の広い管理職。",
        en: "Large programmes, multi-team ownership, management roles with real scope."
      },
      pitch: {
        ja: "関係者と情報を事前に整理して計画を組み立て、リスクを潰した状態で実行してきました。",
        en: "I line up the people and the information in advance, build the plan, and run it with the risks already retired."
      }
    },
    DTEB: {
      name:  { ja: "整える参謀", en: "The Chief of Staff" },
      catch: { ja: "決めるのは他の人。整えるのは自分", en: "Someone else decides. You make it decidable" },
      body: {
        ja: "根拠を揃え、人と共有し、早めに準備しておく。前には出ないのに、この人がいる会議はなぜか結論が出ます。",
        en: "You line up the evidence, share it early, and prepare the ground. You never take the front, yet meetings you attend somehow reach a decision."
      },
      twist: { ja: "「では、まとめますね」で、また仕事が増えています。", en: "“I'll write it up” has cost you more evenings than you would like to admit." },
      strengths: {
        ja: ["判断材料を揃えるのが速い", "議論を結論まで運べる", "立場の違う人の間を繋げる"],
        en: ["Fast at assembling what's needed to decide", "Carries discussions through to a conclusion", "Bridges people who don't share a viewpoint"]
      },
      watchOut: {
        ja: ["自分の意見を出さないまま終わる", "調整役の仕事が際限なく増える"],
        en: ["Your own position never gets stated", "The coordination work expands without limit"]
      },
      fits: {
        ja: "意思決定を支える役割。経営企画、PMO、参謀的なポジション。",
        en: "Roles that support decisions — strategy, PMO, chief-of-staff positions."
      },
      pitch: {
        ja: "判断に必要な材料を揃えて論点を整理し、関係者が結論を出せる状態にしてきました。",
        en: "I assemble what's needed to decide and frame the question, so the people involved can actually reach a conclusion."
      }
    },
    DTLC: {
      name:  { ja: "火消しの指揮官", en: "The Firefighter" },
      catch: { ja: "燃えてから、いちばん強い", en: "At your best once it's burning" },
      body: {
        ja: "平時は静か。ただし問題が起きた瞬間に情報を集め、人を動かし、収束させる。トラブルのたびに中心にいるタイプです。",
        en: "Quiet when things are calm. The instant something breaks you pull the facts, move the people, and close it out. Every incident has you at the centre."
      },
      twist: { ja: "火事がないと、少し退屈そうにしています。", en: "On a week with no fires, you look faintly bored." },
      strengths: {
        ja: ["緊急時に情報と人を同時に動かせる", "原因の切り分けが速い", "収束までやり切る"],
        en: ["Moves facts and people at the same time under pressure", "Fast at isolating a cause", "Stays on it until it's closed"]
      },
      watchOut: {
        ja: ["平常時の改善が後回しになる", "火消しが評価軸になると再発が減らない"],
        en: ["Steady-state improvement gets deprioritised", "If firefighting is what's rewarded, the fires keep coming back"]
      },
      fits: {
        ja: "障害対応、カスタマーサクセス、リスク管理。想定外が起きる前提の仕事。",
        en: "Incident response, customer success, risk management — work that assumes the unexpected."
      },
      pitch: {
        ja: "問題発生時に原因を切り分け、関係者を動かして収束まで責任を持って対応してきました。",
        en: "When something breaks I isolate the cause, mobilise the people involved, and own it through to resolution."
      }
    },
    DTLB: {
      name:  { ja: "土壇場の調整役", en: "The Eleventh-Hour Fixer" },
      catch: { ja: "最後に、全部のつじつまを合わせる", en: "Makes the whole thing add up, at the end" },
      body: {
        ja: "直前になってから関係者に確認を取り、根拠を揃え、静かに全体を成立させる。この人がいないと、最後にどこかが必ず破綻します。",
        en: "Late in the day you check with everyone, line up the facts, and quietly make the whole thing hold together. Without you, something always fails at the last step."
      },
      twist: { ja: "その調整、誰にも気づかれないまま終わっています。", en: "That entire rescue went unnoticed, again." },
      strengths: {
        ja: ["最終局面の整合性を担保できる", "関係者への確認を漏らさない", "破綻しそうな箇所を見つけられる"],
        en: ["Guarantees things line up at the final stage", "Never misses a stakeholder check", "Finds the seam that was about to split"]
      },
      watchOut: {
        ja: ["対応が遅れると間に合わない前提になる", "貢献が記録に残らない"],
        en: ["The whole approach assumes you'll get there in time", "None of it ends up on the record"]
      },
      fits: {
        ja: "関係者が多く、直前の調整が成否を分ける仕事。納品、リリース、対外調整。",
        en: "Work with many stakeholders where the last round of alignment decides the outcome — delivery, release, external coordination."
      },
      pitch: {
        ja: "関係者が多い案件で最終段階の整合を取り、破綻しかけた箇所を修正して成立させてきました。",
        en: "On projects with many stakeholders I take the final alignment, find what's about to break, and get it over the line."
      }
    }
  }
};
