import os
import shutil
import textwrap
from PIL import Image, ImageDraw, ImageFont
from gtts import gTTS
from moviepy import (
    ImageClip,
    AudioFileClip,
    concatenate_videoclips,
    vfx,
)
from image_generator import generate_image, build_prompt


# TikTok縦動画サイズ（軽量化のため720p）
WIDTH = 720
HEIGHT = 1280

# カラーパレット（ネオン系 TikTok風）
COLORS = {
    "bg_dark": (15, 15, 25),
    "bg_gradient_top": (25, 5, 60),
    "bg_gradient_bottom": (5, 5, 30),
    "accent_pink": (255, 0, 110),
    "accent_cyan": (0, 245, 255),
    "accent_yellow": (255, 234, 0),
    "text_white": (255, 255, 255),
    "text_shadow": (0, 0, 0),
    "step_bg": (30, 30, 50, 200),
}

FONT_DIR = os.path.join(os.path.dirname(__file__), "static", "fonts")

# トランジション設定
FADE_DURATION = 0.3  # フェードイン・アウトの長さ(秒)


def _get_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    """フォントを取得。Noto Sans JPがあれば使う、なければデフォルト。"""
    font_names = [
        "NotoSansJP-Bold.ttf" if bold else "NotoSansJP-Regular.ttf",
        "NotoSansJP-Bold.ttf",
        "NotoSansJP-Regular.ttf",
    ]
    for name in font_names:
        path = os.path.join(FONT_DIR, name)
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def _create_gradient_bg() -> Image.Image:
    """グラデーション背景画像を作成。"""
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    top = COLORS["bg_gradient_top"]
    bottom = COLORS["bg_gradient_bottom"]
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(top[0] + (bottom[0] - top[0]) * ratio)
        g = int(top[1] + (bottom[1] - top[1]) * ratio)
        b = int(top[2] + (bottom[2] - top[2]) * ratio)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
    return img


def _draw_text_with_shadow(
    draw: ImageDraw.Draw,
    position: tuple,
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple,
    shadow_offset: int = 3,
):
    """影付きテキストを描画。"""
    x, y = position
    draw.text(
        (x + shadow_offset, y + shadow_offset),
        text,
        font=font,
        fill=COLORS["text_shadow"],
    )
    draw.text((x, y), text, font=font, fill=fill)


def _add_text_overlay(img: Image.Image, text: str, position: str = "center",
                      font_size: int = 64, color: tuple = None,
                      bold: bool = True) -> Image.Image:
    """AI画像の上にテキストオーバーレイを追加。半透明背景付き。"""
    if color is None:
        color = COLORS["text_white"]
    img = img.copy().convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    font = _get_font(font_size, bold=bold)
    wrapped = textwrap.fill(text, width=14)
    bbox = draw.textbbox((0, 0), wrapped, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    padding = 20
    if position == "center":
        text_x = (WIDTH - tw) // 2
        text_y = (HEIGHT - th) // 2
    elif position == "bottom":
        text_x = (WIDTH - tw) // 2
        text_y = HEIGHT - th - 200
    elif position == "top":
        text_x = (WIDTH - tw) // 2
        text_y = 130

    # 半透明の黒背景
    draw.rounded_rectangle(
        [text_x - padding, text_y - padding,
         text_x + tw + padding, text_y + th + padding],
        radius=20, fill=(0, 0, 0, 160),
    )
    # テキスト影
    draw.text((text_x + 3, text_y + 3), wrapped, font=font, fill=(0, 0, 0, 200))
    # テキスト本体
    draw.text((text_x, text_y), wrapped, font=font, fill=color)

    return Image.alpha_composite(img, overlay).convert("RGB")


def _try_ai_image(prompt_desc: str, topic: str, output_path: str) -> bool:
    """AI画像生成を試みる。失敗したらFalseを返す。"""
    prompt = build_prompt(prompt_desc, topic)
    return generate_image(prompt, output_path)


def _create_hook_frame(hook_text: str, tmp_dir: str = None, topic: str = "") -> Image.Image:
    """フック（冒頭）フレーム画像を作成。AI画像があればそれを使う。"""
    # AI画像生成を試みる
    if tmp_dir and topic:
        ai_path = os.path.join(tmp_dir, "ai_hook.png")
        prompt_desc = f"eye-catching opening scene, dramatic reveal, spotlight effect, exciting atmosphere"
        if _try_ai_image(prompt_desc, topic, ai_path):
            img = Image.open(ai_path).resize((WIDTH, HEIGHT), Image.LANCZOS)
            return _add_text_overlay(img, hook_text, position="center",
                                     font_size=48, color=COLORS["accent_cyan"])

    img = _create_gradient_bg()
    draw = ImageDraw.Draw(img)

    # ネオンサークル装飾
    center_x, center_y = WIDTH // 2, HEIGHT // 2 - 60
    for i, color in enumerate([COLORS["accent_pink"], COLORS["accent_cyan"]]):
        offset = i * 14
        draw.ellipse(
            [center_x - 200 - offset, center_y - 200 - offset,
             center_x + 200 + offset, center_y + 200 + offset],
            outline=color, width=3,
        )

    # フックテキスト
    font = _get_font(48, bold=True)
    wrapped = textwrap.fill(hook_text, width=14)
    bbox = draw.textbbox((0, 0), wrapped, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    _draw_text_with_shadow(
        draw,
        ((WIDTH - text_w) // 2, (HEIGHT - text_h) // 2 - 30),
        wrapped,
        font,
        COLORS["accent_cyan"],
        shadow_offset=3,
    )

    # 下部に小さいテキスト
    small_font = _get_font(24)
    tip = "最後まで見てね！"
    bbox2 = draw.textbbox((0, 0), tip, font=small_font)
    tw2 = bbox2[2] - bbox2[0]
    draw.text(((WIDTH - tw2) // 2, HEIGHT - 160), tip, font=small_font, fill=COLORS["accent_yellow"])

    return img


def _create_step_frame(step_num: int, text: str, total_steps: int,
                       visual_desc: str = "", tmp_dir: str = None, topic: str = "") -> Image.Image:
    """ステップフレーム画像を作成。AI画像があればそれを背景に使う。"""
    # AI画像生成を試みる
    if tmp_dir and visual_desc:
        ai_path = os.path.join(tmp_dir, f"ai_step_{step_num}.png")
        prompt_desc = f"step {step_num}, {visual_desc}, tutorial demonstration"
        if _try_ai_image(prompt_desc, topic, ai_path):
            img = Image.open(ai_path).resize((WIDTH, HEIGHT), Image.LANCZOS)
            # ステップ番号を上に表示
            step_label = f"STEP {step_num}/{total_steps}"
            img = _add_text_overlay(img, step_label, position="top",
                                     font_size=32, color=COLORS["accent_cyan"])
            # 本文を下に表示
            img = _add_text_overlay(img, text, position="bottom",
                                     font_size=36, color=COLORS["text_white"])
            return img

    img = _create_gradient_bg()
    draw = ImageDraw.Draw(img)

    # ステップ番号（大きく）
    num_font = _get_font(120, bold=True)
    num_text = f"{step_num}"
    bbox = draw.textbbox((0, 0), num_text, font=num_font)
    nw = bbox[2] - bbox[0]
    _draw_text_with_shadow(
        draw, ((WIDTH - nw) // 2, 200), num_text, num_font, COLORS["accent_pink"], 4
    )

    # 「STEP X / Y」ラベル
    label_font = _get_font(32, bold=True)
    label = f"STEP {step_num} / {total_steps}"
    bbox2 = draw.textbbox((0, 0), label, font=label_font)
    lw = bbox2[2] - bbox2[0]
    draw.text(((WIDTH - lw) // 2, 350), label, font=label_font, fill=COLORS["accent_cyan"])

    # プログレスバー
    bar_y = 400
    bar_margin = 60
    bar_w = WIDTH - bar_margin * 2
    bar_h = 6
    draw.rounded_rectangle(
        [bar_margin, bar_y, bar_margin + bar_w, bar_y + bar_h],
        radius=3, fill=(60, 60, 80),
    )
    progress = int(bar_w * step_num / total_steps)
    draw.rounded_rectangle(
        [bar_margin, bar_y, bar_margin + progress, bar_y + bar_h],
        radius=3, fill=COLORS["accent_pink"],
    )

    # テキストカード背景
    card_margin = 40
    card_top = 460
    card_bottom = 930
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rounded_rectangle(
        [card_margin, card_top, WIDTH - card_margin, card_bottom],
        radius=30, fill=COLORS["step_bg"],
    )
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    # ステップ本文
    text_font = _get_font(36)
    wrapped = textwrap.fill(text, width=16)
    bbox3 = draw.textbbox((0, 0), wrapped, font=text_font)
    tw = bbox3[2] - bbox3[0]
    th = bbox3[3] - bbox3[1]
    text_x = (WIDTH - tw) // 2
    text_y = card_top + (card_bottom - card_top - th) // 2
    _draw_text_with_shadow(draw, (text_x, text_y), wrapped, text_font, COLORS["text_white"])

    return img


def _create_outro_frame(outro_text: str, tmp_dir: str = None, topic: str = "") -> Image.Image:
    """アウトロフレーム画像を作成。AI画像があればそれを使う。"""
    # AI画像生成を試みる
    if tmp_dir and topic:
        ai_path = os.path.join(tmp_dir, "ai_outro.png")
        prompt_desc = f"celebration scene, thumbs up, like button, follow, happy ending, social media"
        if _try_ai_image(prompt_desc, topic, ai_path):
            img = Image.open(ai_path).resize((WIDTH, HEIGHT), Image.LANCZOS)
            return _add_text_overlay(img, outro_text, position="center",
                                     font_size=42, color=COLORS["accent_yellow"])

    img = _create_gradient_bg()
    draw = ImageDraw.Draw(img)

    font = _get_font(42, bold=True)
    wrapped = textwrap.fill(outro_text, width=16)
    bbox = draw.textbbox((0, 0), wrapped, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    _draw_text_with_shadow(
        draw,
        ((WIDTH - tw) // 2, (HEIGHT - th) // 2 - 50),
        wrapped,
        font,
        COLORS["accent_yellow"],
        shadow_offset=3,
    )

    # CTA
    cta_font = _get_font(32)
    cta = "いいね＆フォローよろしく！"
    bbox2 = draw.textbbox((0, 0), cta, font=cta_font)
    cw = bbox2[2] - bbox2[0]
    draw.text(((WIDTH - cw) // 2, HEIGHT // 2 + 70), cta, font=cta_font, fill=COLORS["text_white"])

    return img


def _generate_tts(text: str, output_path: str) -> str:
    """gTTSでテキストを音声に変換。"""
    tts = gTTS(text=text, lang="ja", slow=False)
    tts.save(output_path)
    return output_path


def _make_clip(img_path, audio_clip):
    """静止画+音声からフェード付きクリップを作成。"""
    duration = max(audio_clip.duration + 0.8, 3.0)

    clip = ImageClip(img_path).with_duration(duration)

    # フェードイン・フェードアウト
    clip = clip.with_effects([
        vfx.FadeIn(FADE_DURATION),
        vfx.FadeOut(FADE_DURATION),
    ])

    # 音声をつける
    clip = clip.with_audio(audio_clip)

    return clip


def generate_video(script: dict, job_id: str, output_dir: str) -> str:
    """台本からTikTok動画を生成する。

    Args:
        script: generate_lifehack_script() の戻り値
        job_id: ジョブID（ファイル名用）
        output_dir: 出力ディレクトリ

    Returns:
        生成された動画のファイルパス
    """
    tmp_dir = os.path.join(output_dir, f"tmp_{job_id}")
    os.makedirs(tmp_dir, exist_ok=True)

    topic = script.get("title", "")
    clips = []

    # 1. フック
    hook_img_path = os.path.join(tmp_dir, "hook.png")
    hook_audio_path = os.path.join(tmp_dir, "hook.mp3")
    _create_hook_frame(script["hook"], tmp_dir=tmp_dir, topic=topic).save(hook_img_path)
    _generate_tts(script["hook"], hook_audio_path)
    hook_audio = AudioFileClip(hook_audio_path)
    clips.append(_make_clip(hook_img_path, hook_audio))

    # 2. ステップ
    steps = script["steps"]
    for i, step in enumerate(steps, 1):
        img_path = os.path.join(tmp_dir, f"step_{i}.png")
        audio_path = os.path.join(tmp_dir, f"step_{i}.mp3")
        visual_desc = step.get("visual_description", "")
        _create_step_frame(i, step["text"], len(steps),
                           visual_desc=visual_desc, tmp_dir=tmp_dir, topic=topic).save(img_path)
        _generate_tts(step["text"], audio_path)
        step_audio = AudioFileClip(audio_path)
        clips.append(_make_clip(img_path, step_audio))

    # 3. アウトロ
    outro_img_path = os.path.join(tmp_dir, "outro.png")
    outro_audio_path = os.path.join(tmp_dir, "outro.mp3")
    _create_outro_frame(script["outro"], tmp_dir=tmp_dir, topic=topic).save(outro_img_path)
    _generate_tts(script["outro"], outro_audio_path)
    outro_audio = AudioFileClip(outro_audio_path)
    clips.append(_make_clip(outro_img_path, outro_audio))

    # フェードで結合
    final = concatenate_videoclips(clips, method="compose", padding=-FADE_DURATION)
    output_path = os.path.join(output_dir, f"lifehack_{job_id}.mp4")
    final.write_videofile(
        output_path,
        fps=24,
        codec="libx264",
        audio_codec="aac",
        preset="ultrafast",
        threads=2,
    )

    # クリーンアップ
    final.close()
    for clip in clips:
        clip.close()

    shutil.rmtree(tmp_dir, ignore_errors=True)

    return output_path
