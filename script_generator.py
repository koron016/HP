import json
import anthropic


def generate_lifehack_script(api_key: str, topic: str, style: str) -> dict:
    """Claude APIを使ってTikTok向けライフハック動画の台本を生成する。

    Returns:
        dict with keys:
            title: str - 動画タイトル
            hook: str - 冒頭のフック（最初の1秒で目を引く）
            steps: list[dict] - 各ステップ {text, visual_description}
            outro: str - 締めの一言
    """
    client = anthropic.Anthropic(api_key=api_key)

    system_prompt = """あなたはTikTokでバズるライフハック動画の台本ライターです。
以下のルールを守ってください：
- 動画は30〜60秒を想定（ステップは3〜5個）
- 冒頭のフック（hook）は衝撃的・意外性のある一言にする
- 各ステップは短く、テンポよく
- 日本語で書く
- 口語体・カジュアルな文体にする

必ず以下のJSON形式で返してください。それ以外のテキストは出力しないでください：
{
  "title": "動画タイトル",
  "hook": "冒頭のフック文",
  "steps": [
    {"text": "ステップの説明文", "visual_description": "画面に表示するビジュアルの説明"}
  ],
  "outro": "締めの一言"
}"""

    user_prompt = f"トピック: {topic}\nスタイル: {style}\n\nこのトピックでTikTokバズるライフハック動画の台本をJSON形式で作成してください。"

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
    )

    raw_text = message.content[0].text.strip()

    # JSONブロックの抽出（```json ... ``` で囲まれている場合に対応）
    if raw_text.startswith("```"):
        lines = raw_text.split("\n")
        json_lines = []
        inside = False
        for line in lines:
            if line.startswith("```") and not inside:
                inside = True
                continue
            elif line.startswith("```") and inside:
                break
            if inside:
                json_lines.append(line)
        raw_text = "\n".join(json_lines)

    script = json.loads(raw_text)
    return script
