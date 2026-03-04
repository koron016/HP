import random


# ライフハック台本テンプレートデータベース
_TEMPLATES = {
    "おもしろ系": {
        "hooks": [
            "えっ、{topic}でこんなことできるの⁉️",
            "友達に教えたら天才って言われた{topic}ハック",
            "{topic}の裏ワザ知らないとか人生損してる！",
            "まじで{topic}がヤバすぎるwww",
        ],
        "outros": [
            "知らなかった人、正直に手あげて🙋",
            "友達にも教えてあげてね😂",
            "これ知ってた人いる？コメントで教えて！",
            "明日から使えるやつ！保存しとけ📌",
        ],
    },
    "驚き系": {
        "hooks": [
            "99%の人が知らない{topic}の真実",
            "プロしか知らない{topic}の裏ワザ！",
            "{topic}、今までやり方間違ってたかも…",
            "これ知ったらもう戻れない…{topic}の秘密",
        ],
        "outros": [
            "知らなかったのは私だけ…？",
            "まじで世界変わった。試してみて！",
            "驚いた人はいいね押してって！",
            "もっと早く知りたかった…😭",
        ],
    },
    "実用系": {
        "hooks": [
            "毎日の{topic}が10倍ラクになる方法",
            "これ知ってるだけで{topic}が劇的に変わる！",
            "プロが毎日やってる{topic}テクニック",
            "{topic}の時短テク、これだけ覚えればOK",
        ],
        "outros": [
            "今日から早速やってみよう！",
            "保存して明日から実践してね📌",
            "フォローで毎日ライフハック配信中！",
            "他にも知りたい人はコメントしてね✨",
        ],
    },
    "裏ワザ系": {
        "hooks": [
            "メーカーが教えたくない{topic}の裏ワザ",
            "知ってる人だけ得してる{topic}の秘密",
            "これ、本当は教えたくなかった…{topic}ハック",
            "{topic}の隠し機能、知ってた？",
        ],
        "outros": [
            "内緒にしといてね🤫",
            "知ってた人はコメントで✋",
            "もっと裏ワザ知りたい人はフォロー！",
            "これはガチで使えるやつ。保存推奨📌",
        ],
    },
}

# トピック別のステップテンプレート（キーワードマッチで選択）
_STEP_SETS = [
    {
        "keywords": ["ペットボトル", "ボトル", "飲み物"],
        "steps": [
            {"text": "空のペットボトルを用意して、キャップに穴を3つ開ける", "visual_description": "ペットボトルのキャップにキリで穴を開ける"},
            {"text": "水を入れてキャップを閉めると…簡易シャワーの完成！", "visual_description": "ペットボトルから水がシャワー状に出る"},
            {"text": "キャンプや災害時にめっちゃ使える", "visual_description": "アウトドアでペットボトルシャワーを使う"},
            {"text": "穴の大きさで水圧を調整できるよ", "visual_description": "違うサイズの穴を比較"},
        ],
    },
    {
        "keywords": ["料理", "時短", "キッチン", "食べ物", "レシピ"],
        "steps": [
            {"text": "にんにくを電子レンジで20秒チンする", "visual_description": "にんにくを皿に乗せてレンジへ"},
            {"text": "皮がスルッと簡単にむける！", "visual_description": "皮が簡単にむける様子"},
            {"text": "もう手が臭くならない！", "visual_description": "きれいなにんにく"},
            {"text": "料理の下準備が3倍速くなるよ", "visual_description": "時短テクまとめ"},
        ],
    },
    {
        "keywords": ["掃除", "汚れ", "きれい", "洗"],
        "steps": [
            {"text": "重曹とお酢を1:1で混ぜる", "visual_description": "重曹とお酢をボウルで混ぜる"},
            {"text": "汚れた部分にスプレーして5分待つ", "visual_description": "スプレーして放置"},
            {"text": "拭き取るだけでピカピカ✨", "visual_description": "ビフォーアフター比較"},
            {"text": "洗剤買わなくてもこれで十分！", "visual_description": "コスト比較"},
        ],
    },
    {
        "keywords": ["スマホ", "iPhone", "Android", "充電", "アプリ"],
        "steps": [
            {"text": "設定→バッテリーから電池食いアプリを確認", "visual_description": "スマホの設定画面"},
            {"text": "バックグラウンド更新をオフにする", "visual_description": "設定をオフにする操作"},
            {"text": "位置情報を「使用中のみ」に変更", "visual_description": "位置情報設定画面"},
            {"text": "これだけで充電の持ちが2倍に！", "visual_description": "バッテリー残量の比較"},
        ],
    },
    {
        "keywords": ["収納", "片付け", "整理", "部屋"],
        "steps": [
            {"text": "100均のファイルボックスを横にして使う", "visual_description": "ファイルボックスを横置き"},
            {"text": "フライパンやお皿を立てて収納できる", "visual_description": "立てて収納した様子"},
            {"text": "取り出しやすくてスペースも半分に！", "visual_description": "ビフォーアフター"},
            {"text": "引き出しの中もスッキリ✨", "visual_description": "整理された引き出し"},
        ],
    },
]

# 汎用ステップ（キーワードマッチしない場合）
_GENERIC_STEPS_POOL = [
    [
        {"text": "まず必要なものを準備するよ", "visual_description": "材料・道具を並べた様子"},
        {"text": "ポイントはこのひと工夫！", "visual_description": "キーとなる作業のアップ"},
        {"text": "簡単なのに効果バツグン！", "visual_description": "完成した結果"},
        {"text": "コスパ最強すぎない？", "visual_description": "コスト比較"},
    ],
    [
        {"text": "知ってた？実はこうするだけで全然違う", "visual_description": "やり方の説明"},
        {"text": "大事なのはこのタイミング！", "visual_description": "タイミングを示す"},
        {"text": "ほら、こんなに変わった！", "visual_description": "ビフォーアフター比較"},
        {"text": "1分でできるから今すぐやってみて", "visual_description": "完成形を見せる"},
    ],
    [
        {"text": "まずはこれを用意して", "visual_description": "準備するものを表示"},
        {"text": "ここがみんな間違えるポイント！", "visual_description": "よくある間違いを表示"},
        {"text": "正しいやり方はこう！", "visual_description": "正しい方法のデモ"},
        {"text": "これでプロ級の仕上がり✨", "visual_description": "完成品を見せる"},
    ],
]


def generate_lifehack_script(topic: str, style: str) -> dict:
    """テンプレートベースでTikTok向けライフハック動画の台本を生成する（API不要・無料）。

    Returns:
        dict with keys:
            title: str - 動画タイトル
            hook: str - 冒頭のフック
            steps: list[dict] - 各ステップ {text, visual_description}
            outro: str - 締めの一言
    """
    if style not in _TEMPLATES:
        style = "おもしろ系"

    template = _TEMPLATES[style]

    # フックとアウトロを選択
    hook = random.choice(template["hooks"]).format(topic=topic)
    outro = random.choice(template["outros"])

    # トピックに合うステップを検索
    steps = None
    for step_set in _STEP_SETS:
        if any(kw in topic for kw in step_set["keywords"]):
            steps = step_set["steps"]
            break

    # マッチしなければ汎用ステップを使用
    if steps is None:
        steps = random.choice(_GENERIC_STEPS_POOL)

    # タイトル生成
    title_templates = [
        f"【{style}】{topic}のライフハック",
        f"{topic}が変わる！神ライフハック",
        f"知らなきゃ損！{topic}テク",
        f"【保存版】{topic}ハック集",
    ]
    title = random.choice(title_templates)

    return {
        "title": title,
        "hook": hook,
        "steps": steps,
        "outro": outro,
    }
