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
    prepTitle:   { ja: "面接の備え", en: "Interview prep" },
    prepDig:     { ja: "あなたが突かれる質問", en: "What they will press you on" },
    prepWeak:    { ja: "「短所は？」への答え方", en: "Answering “what's your weakness?”" },
    prepWrite:   { ja: "ガクチカで厚く書くところ", en: "What to make the centre of your story" },
    chainTitle:  { ja: "ここまで掘られます", en: "How far they will dig" },
    chainHold:   { ja: "崩れない答え方", en: "How to hold your ground" },
    chainNote: {
      ja: "面接官は同じ話を3回掘ります。学生が崩れるのは2段目と3段目です。ここを先に用意しておくと、落ちません。",
      en: "Interviewers dig three levels into the same story. Candidates come apart at the second and third. Prepare these and you won't."
    },
    envRead:     { ja: "返ってきた答えの読み方", en: "How to read their answer" },
    prepNote: {
      ja: "短所は、自覚と対策をセットにすると通ります。丸暗記せず、自分の経験に置き換えてから使ってください。",
      en: "A weakness lands when you pair it with what you now do about it. Rewrite these in your own words before using them."
    },
    envTitle:    { ja: "企業の見極め方", en: "How to size up a company" },
    envFit:      { ja: "合う環境の条件", en: "Conditions that suit you" },
    envAsk:      { ja: "説明会・面接で聞くこと", en: "Ask them this" },
    envFlag:     { ja: "合わないサイン", en: "Warning signs" },
    envNote: {
      ja: "そのまま逆質問に使えます。答えを聞いて、自分に合うかを自分で判断してください。合う・合わないは会社の良し悪しではありません。",
      en: "These double as your questions for them. Judge the fit yourself from the answers — a bad fit is not a bad company."
    },
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

  /* --- 面接の備え ---
     4文字それぞれの側から、突かれる質問・短所の答え方・書き方の重心を出します。
     就活生が実際に詰まるのはここなので、先回りして材料を渡します。 --- */
  prep: {
    I: {
      dig:   { ja: "「その判断に、根拠はありましたか？」", en: "“What was that decision actually based on?”" },
      fix:   { ja: "勘で決めた場面でも、後から言葉にできる理由を1つ用意しておく", en: "Even for gut calls, have one reason you can put into words afterwards" },
      weak:  { ja: "勘で動きすぎて、根拠を求められると詰まることがありました。今は決める前に、理由を一度書き出すようにしています。", en: "I moved on instinct and struggled when asked to justify it. Now I write the reasoning down before I decide." },
      write: { ja: "動き出しの速さが武器。「なぜすぐ動けたのか」を厚く書く", en: "Speed off the mark is your edge — make “why I could move immediately” the centre" }
    },
    D: {
      dig:   { ja: "「情報が足りない場面では、どう決めますか？」", en: "“How do you decide when the information isn't there?”" },
      fix:   { ja: "決めきれずに機会を逃した経験と、そこから変えたことをセットで話す", en: "Pair a time hesitation cost you something with what you changed after" },
      weak:  { ja: "材料を集めすぎて、判断が遅れることがありました。今は調べ始める前に、決める日を先に決めています。", en: "I over-researched and decided too late. Now I fix the decision date before I start looking." },
      write: { ja: "「なぜそうしたか」の根拠部分。ここを書ける人は多くない", en: "The reasoning behind your choices — few applicants can actually write this" }
    },
    S: {
      dig:   { ja: "「チームで動いた経験を教えてください」", en: "“Tell me about a time you worked as part of a team.”" },
      fix:   { ja: "一人でやり切った話には、周囲に渡した部分を必ず添える", en: "Whenever you describe carrying something alone, name the part you handed over" },
      weak:  { ja: "一人で抱え込みがちでした。今は着手する前に、誰に何を頼むかを先に決めるようにしています。", en: "I used to absorb everything myself. Now I decide what to hand off before I start." },
      write: { ja: "自分が何をしたかが明確なのが強み。行動を具体的に書く", en: "Your contribution is unambiguous — write the actions in detail" }
    },
    T: {
      dig:   { ja: "「自分ひとりで成し遂げたことはありますか？」", en: "“What have you achieved on your own?”" },
      fix:   { ja: "巻き込んだ話の中で、自分が担った部分をはっきり切り出す", en: "Inside the group story, cut out the part that was specifically yours" },
      weak:  { ja: "人に相談しすぎて、自分で考える時間が減ることがありました。今はまず自分の案を出してから相談しています。", en: "I leaned on others before thinking it through. Now I bring my own draft first, then ask." },
      write: { ja: "動かした人数と、どう動かしたか。数字を入れると効く", en: "How many people you moved, and how — numbers land here" }
    },
    E: {
      dig:   { ja: "「予定が崩れたとき、どうしましたか？」", en: "“What did you do when the plan fell apart?”" },
      fix:   { ja: "計画通りにいかなかった経験を、必ず1つ用意しておく", en: "Have one story ready where the plan did not hold" },
      weak:  { ja: "余裕がある前提で計画を立てがちでした。今は必ず予備日を入れるようにしています。", en: "I planned as if nothing would go wrong. Now I always build in slack." },
      write: { ja: "準備の段階。ここを書ける学生は少なく、差がつく", en: "The preparation phase — very few applicants write about it" }
    },
    L: {
      dig:   { ja: "「計画的に進めるのは苦手ですか？」", en: "“Are you bad at planning ahead?”" },
      fix:   { ja: "直前型だと認めたうえで、間に合わせるための自分の工夫を語る", en: "Own the late start, then explain the method that gets you there anyway" },
      weak:  { ja: "追い込まれてから力が出るタイプで、着手が遅れがちでした。今は中間の締切を自分で作って対処しています。", en: "I peak under pressure, so I started too late. Now I set my own interim deadline." },
      write: { ja: "土壇場での立て直し。危機と回復はセットで強い", en: "The last-minute recovery — crisis plus rescue is a strong pair" }
    },
    C: {
      dig:   { ja: "「周囲と衝突したことはありますか？」", en: "“Have you ever clashed with the people around you?”" },
      fix:   { ja: "引っ張った話には、反対意見をどう扱ったかを必ず入れる", en: "In any story where you led, include how you handled the objection" },
      weak:  { ja: "自分で決めたくなり、意見を聞く前に動くことがありました。今は先に一周、意見を聞くようにしています。", en: "I moved before hearing people out. Now I do one round of listening first." },
      write: { ja: "決めた場面と、その結果。判断そのものを書く", en: "The moment you decided, and what it produced — write the judgment itself" }
    },
    B: {
      dig:   { ja: "「自分から動いた経験を教えてください」", en: "“Tell me about a time you took the initiative.”" },
      fix:   { ja: "支えた話の中から、自分の判断で動いた瞬間を1つ切り出す", en: "From the support story, extract one moment that was your own call" },
      weak:  { ja: "意見はあっても、言い出すのが遅れることがありました。今は会議で必ず一度は発言すると決めています。", en: "I had views but was slow to voice them. Now I make myself speak at least once in every meeting." },
      write: { ja: "支えた相手がどう変わったか。相手の変化で書くと伝わる", en: "How the person you supported changed — write it through their change" }
    }
  },

  /* --- 深掘りの3段階 ---
     面接官は同じ話を3回掘ります。1段目は誰でも用意していますが、
     2段目・3段目で崩れる。そこを先回りして渡します。 --- */
  chain: {
    I: {
      steps: {
        ja: ["その判断の根拠は何でしたか？", "他の選択肢は検討しましたか？", "なぜ、その選択肢を捨てたのですか？"],
        en: ["What was that decision based on?", "Did you consider the alternatives?", "Why did you rule them out?"]
      },
      hold: {
        ja: "捨てた理由を1つ言えれば通ります。「考えませんでした」は避け、「〜だと判断して外しました」と、選ばなかったことも判断として語ってください。",
        en: "One reason for ruling something out is enough. Never say you didn't consider it — say you assessed it and set it aside. Not choosing is still a decision."
      }
    },
    D: {
      steps: {
        ja: ["情報が足りないときは、どう決めますか？", "決めきれなかったことはありますか？", "そのとき、何を失いましたか？"],
        en: ["How do you decide without enough information?", "Has hesitation ever stopped you deciding?", "What did that cost you?"]
      },
      hold: {
        ja: "「特にありません」が一番危険です。失ったものを具体的に言えると、誠実さと学習能力が同時に伝わります。",
        en: "“Nothing really” is the worst answer here. Naming what it cost you shows honesty and that you learned, in one move."
      }
    },
    S: {
      steps: {
        ja: ["チームで動いた経験を教えてください", "その中で、あなたの役割は何でしたか？", "なぜ、あなたがその役割になったのですか？"],
        en: ["Tell me about working in a team", "What was your role in it?", "Why did that role end up being yours?"]
      },
      hold: {
        ja: "3段目が本番です。「与えられました」ではなく「自分で取りに行きました」の形にしてください。理由は能力ではなく、状況で説明すると嫌味がありません。",
        en: "The third question is the real one. Say you took the role, not that you were handed it — and explain it by the situation, not by your own ability."
      }
    },
    T: {
      steps: {
        ja: ["自分ひとりで成し遂げたことはありますか？", "周りに頼らず、どこまでやりましたか？", "なぜ、そこは人に頼らなかったのですか？"],
        en: ["What have you achieved alone?", "How far did you get without help?", "Why didn't you bring anyone in there?"]
      },
      hold: {
        ja: "「頼れなかった」と言うと弱く聞こえます。「ここは自分がやるべきだと判断した」に変えるだけで、主体性の話になります。",
        en: "“There was nobody to ask” sounds weak. “I judged that this part was mine to carry” turns the same fact into initiative."
      }
    },
    E: {
      steps: {
        ja: ["予定通りにいかなかった経験はありますか？", "そのとき、最初に何をしましたか？", "なぜ、それを最初にやったのですか？"],
        en: ["When has a plan not held?", "What did you do first?", "Why that first?"]
      },
      hold: {
        ja: "3段目で問われているのは優先順位の付け方です。「何を捨てたか」まで言えると、判断力の証明になります。",
        en: "The third question is about how you prioritise. Say what you dropped, not just what you did — that is where the judgment shows."
      }
    },
    L: {
      steps: {
        ja: ["計画的に進めるのは苦手ですか？", "なぜ、早く始められないのだと思いますか？", "それで間に合わなかったことはありますか？"],
        en: ["Are you bad at working to a plan?", "Why do you think you start late?", "Has it ever made you miss a deadline?"]
      },
      hold: {
        ja: "3段目で「ありません」は嘘に聞こえます。一度あったと認め、そのあと自分で作った仕組みを1つ挙げてください。認めた方が信用されます。",
        en: "Saying “never” at the third step sounds false. Admit it happened once, then name the mechanism you built afterwards. Admitting it is what buys trust."
      }
    },
    C: {
      steps: {
        ja: ["周囲と意見が割れたことはありますか？", "そのとき、相手の意見はどう扱いましたか？", "結果的に、あなたの判断は正しかったですか？"],
        en: ["Have you clashed with people?", "What did you do with their view?", "In the end, were you right?"]
      },
      hold: {
        ja: "3段目で「正しかったです」と言い切ると、独断的に映ります。取り入れた部分を1つ挙げてから結果を話すと、同じ話が協調性の証明に変わります。",
        en: "Claiming you were right reads as domineering. Name one thing you took from the other side first, then give the outcome — the same story now proves you listen."
      }
    },
    B: {
      steps: {
        ja: ["自分から動いた経験を教えてください", "それは、誰かに言われて始めたことですか？", "言われる前に動けなかったのは、なぜですか？"],
        en: ["Tell me about taking initiative", "Did someone ask you to start?", "Why didn't you move before being asked?"]
      },
      hold: {
        ja: "「様子を見ていました」は受け身に聞こえます。「動く条件が揃うのを待っていた」「先に周りの状況を確かめていた」と、待つことを判断として語ってください。",
        en: "“I was watching how it went” sounds passive. Say you were waiting for the conditions, or checking the ground first — frame the waiting as a decision."
      }
    }
  },

  /* --- 企業の見極め方 ---
     自分がどちら側かによって、確認すべき条件・聞くべき質問・警戒すべきサインが変わります。
     実在の企業名は出しません。判断は本人がするものだからです。 --- */
  env: {
    I: {
      read: {
        good:  { ja: "「その場で決まることが多いです」", en: "“Usually on the spot.”" },
        vague: { ja: "「案件によりますね」→ はぐらかし。「直近の例だと？」と重ねる", en: "“It depends on the case.” — a dodge. Follow with “what about the most recent one?”" },
        bad:   { ja: "「稟議を通すので2週間ほど」→ あなたの速さは活きない", en: "“About two weeks, it goes through sign-off.” — your speed will not count here" }
      },
      fit:  { ja: "決裁の階層が浅く、速く動けることが評価される", en: "Few approval layers, and speed is what gets rewarded" },
      ask:  { ja: "何かを決めるとき、だいたいどれくらいで結論が出ますか？", en: "How long does it usually take for a decision to land?" },
      flag: { ja: "稟議の話が長い。「前例がないと難しい」と言われた", en: "Long talk about sign-off. “We'd need a precedent for that.”" }
    },
    D: {
      read: {
        good:  { ja: "「毎週この指標を見ています」と具体的な数字が出る", en: "They quote a specific metric they watch weekly" },
        vague: { ja: "「感覚ですね」と笑われた → 根拠で語る文化はない", en: "They laugh and say “gut feel” — evidence is not the currency here" },
        bad:   { ja: "数字を1つも言えない → あなたの武器が評価されない", en: "They cannot name a single number — your strength will go unread" }
      },
      fit:  { ja: "数字と根拠で判断する習慣が、実際に回っている", en: "Decisions actually run on numbers, not vibes" },
      ask:  { ja: "施策がうまくいったかどうかは、何で判断していますか？", en: "How do you tell whether something worked?" },
      flag: { ja: "「まずやってみよう」しか出てこない。数字が答えられない", en: "“We just try things.” Nobody can quote a number." }
    },
    S: {
      read: {
        good:  { ja: "「この範囲は一人で持ちます」と線が引ける", en: "They can draw the line: “this scope is one person\u2019s”" },
        vague: { ja: "「みんなで見ています」→ 責任の所在が曖昧な可能性", en: "“We all look after it together” — ownership may be unclear" },
        bad:   { ja: "「その都度です」→ 裁量が読めない。もう一段聞く", en: "“It varies” — latitude is unreadable; press once more" }
      },
      fit:  { ja: "一人で任される範囲がはっきりしていて、裁量がある", en: "Clear individual ownership, with real latitude inside it" },
      ask:  { ja: "一人が担当する範囲は、どこからどこまでですか？", en: "Where does one person's ownership start and stop?" },
      flag: { ja: "常に複数人で動く。会議の多さを誇っている", en: "Everything is done in groups. They boast about how many meetings they have." }
    },
    T: {
      read: {
        good:  { ja: "「常に2〜3人で見ています」と具体的な人数が出る", en: "They give a real number: “two or three of us on anything”" },
        vague: { ja: "「基本は個人ですが相談はできます」→ 実態は一人の可能性", en: "“Mostly solo, but you can ask” — probably solo in practice" },
        bad:   { ja: "「席も離れていて各自で進めます」→ 巻き込む余地が少ない", en: "“Everyone sits apart and works their own way” — little room to pull people in" }
      },
      fit:  { ja: "チームで進めるのが前提で、相談しやすい距離にいる", en: "Team-first by default, with people close enough to ask" },
      ask:  { ja: "ひとつの仕事は、普段どれくらいの人数で進めますか？", en: "How many people usually work on one thing?" },
      flag: { ja: "基本は個人プレー。誰が何をしているか見えない", en: "Everyone works solo. Nobody can see what anyone else is doing." }
    },
    E: {
      read: {
        good:  { ja: "「四半期の計画がほぼそのまま動きます」", en: "“The quarterly plan mostly holds.”" },
        vague: { ja: "「臨機応変が売りです」→ 前倒しが無駄になる可能性", en: "“We pride ourselves on being flexible” — your early finishes may be wasted" },
        bad:   { ja: "繁忙期の話をはぐらかされた → 一番聞きたいところを避けている", en: "They dodge the question about crunch — that is the answer" }
      },
      fit:  { ja: "計画が守られる前提があり、急な差し込みが少ない", en: "Plans are expected to hold, and interruptions are rare" },
      ask:  { ja: "予定が急に変わることは、どれくらいの頻度でありますか？", en: "How often do plans get thrown out mid-week?" },
      flag: { ja: "繁忙期の話をはぐらかされた。「臨機応変」を連呼する", en: "They dodge the question about crunch, and keep saying “flexible”." }
    },
    L: {
      read: {
        good:  { ja: "「やり方は任せます。見るのは結果です」", en: "“How you do it is yours. We look at the result.”" },
        vague: { ja: "「一応、日報はあります」→ 程度を必ず確認する", en: "“There is a daily report, technically” — always check how heavy" },
        bad:   { ja: "「手順書どおりに進めてもらいます」→ あなたの粘りが出せない", en: "“You follow the documented process” — no room for your late surge" }
      },
      fit:  { ja: "進め方が本人に任され、成果で見てもらえる", en: "How you get there is up to you; you're judged on the result" },
      ask:  { ja: "進め方は個人に任されますか、決まった手順がありますか？", en: "Do people choose their own approach, or follow a set process?" },
      flag: { ja: "日次で進捗を報告させる。手順が細かく決まっている", en: "Daily progress reporting. The process is prescribed in detail." }
    },
    C: {
      read: {
        good:  { ja: "「1年目から自分の判断で動いてもらいます」", en: "“From year one, the calls are yours.”" },
        vague: { ja: "「人によります」→ 実例を1つ聞く。答えられなければ実績がない", en: "“It depends on the person” — ask for one example; no example means it has not happened" },
        bad:   { ja: "「まずは3年、しっかり学んでもらいます」→ 決める機会は当分ない", en: "“The first three years are for learning” — decisions are a long way off" }
      },
      fit:  { ja: "若手にも早い段階で決定権が渡る", en: "Junior people get real decisions early" },
      ask:  { ja: "入社して何年目から、自分で決められるようになりますか？", en: "How soon do new people get to make their own calls?" },
      flag: { ja: "年次の話が多い。決裁が上に集中している", en: "A lot of talk about seniority. All decisions sit at the top." }
    },
    B: {
      read: {
        good:  { ja: "役割の名前と担当範囲がすぐ出てくる", en: "They name the role and its scope without hesitating" },
        vague: { ja: "「いろいろ経験してもらいます」→ 何屋になるのか見えない", en: "“You\u2019ll get to try lots of things” — unclear what you would become" },
        bad:   { ja: "「なんでもやってもらいます」→ 専門性は積み上がらない", en: "“A bit of everything” — expertise will not compound" }
      },
      fit:  { ja: "役割がはっきりしていて、専門性を積み上げられる", en: "Defined roles, so expertise actually compounds" },
      ask:  { ja: "配属後は、どんな役割から始まりますか？", en: "What role would I actually start in?" },
      flag: { ja: "「なんでもやってもらう」と言われた。役割の説明が曖昧", en: "“You'll do a bit of everything.” The role can't be described." }
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
