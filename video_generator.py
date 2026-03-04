import os
import textwrap
from PIL import Image, ImageDraw, ImageFont
from gtts import gTTS
from moviepy import (
    ImageClip,
    AudioFileClip,
    TextClip,
    CompositeVideoClip,
    concatenate_videoclips,
)


# TikTok縦動画サイズ
WIDTH = 1080
HEIGHT = 1920

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


def _create_hook_frame(hook_text: str) -> Image.Image:
    """フック（冒頭）フレーム画像を作成。"""
    img = _create_gradient_bg()
    draw = ImageDraw.Draw(img)

    # ネオンサークル装飾
    center_x, center_y = WIDTH // 2, HEIGHT // 2 - 100
    for i, color in enumerate([COLORS["accent_pink"], COLORS["accent_cyan"]]):
        offset = i * 20
        draw.ellipse(
            [center_x - 300 - offset, center_y - 300 - offset,
             center_x + 300 + offset, center_y + 300 + offset],
            outline=color, width=3,
        )

    # フックテキスト
    font = _get_font(72, bold=True)
    wrapped = textwrap.fill(hook_text, width=12)
    bbox = draw.textbbox((0, 0), wrapped, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    _draw_text_with_shadow(
        draw,
        ((WIDTH - text_w) // 2, (HEIGHT - text_h) // 2 - 50),
        wrapped,
        font,
        COLORS["accent_cyan"],
        shadow_offset=4,
    )

    # 下部に小さいテキスト
    small_font = _get_font(36)
    tip = "👆 最後まで見てね！"
    bbox2 = draw.textbbox((0, 0), tip, font=small_font)
    tw2 = bbox2[2] - bbox2[0]
    draw.text(((WIDTH - tw2) // 2, HEIGHT - 250), tip, font=small_font, fill=COLORS["accent_yellow"])

    return img


def _create_step_frame(step_num: int, text: str, total_steps: int) -> Image.Image:
    """ステップフレーム画像を作成。"""
    img = _create_gradient_bg()
    draw = ImageDraw.Draw(img)

    # ステップ番号（大きく）
    num_font = _get_font(180, bold=True)
    num_text = f"{step_num}"
    bbox = draw.textbbox((0, 0), num_text, font=num_font)
    nw = bbox[2] - bbox[0]
    _draw_text_with_shadow(
        draw, ((WIDTH - nw) // 2, 300), num_text, num_font, COLORS["accent_pink"], 6
    )

    # 「STEP X / Y」ラベル
    label_font = _get_font(48, bold=True)
    label = f"STEP {step_num} / {total_steps}"
    bbox2 = draw.textbbox((0, 0), label, font=label_font)
    lw = bbox2[2] - bbox2[0]
    draw.text(((WIDTH - lw) // 2, 520), label, font=label_font, fill=COLORS["accent_cyan"])

    # プログレスバー
    bar_y = 600
    bar_margin = 100
    bar_w = WIDTH - bar_margin * 2
    bar_h = 8
    draw.rounded_rectangle(
        [bar_margin, bar_y, bar_margin + bar_w, bar_y + bar_h],
        radius=4, fill=(60, 60, 80),
    )
    progress = int(bar_w * step_num / total_steps)
    draw.rounded_rectangle(
        [bar_margin, bar_y, bar_margin + progress, bar_y + bar_h],
        radius=4, fill=COLORS["accent_pink"],
    )

    # テキストカード背景
    card_margin = 60
    card_top = 700
    card_bottom = 1400
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rounded_rectangle(
        [card_margin, card_top, WIDTH - card_margin, card_bottom],
        radius=30, fill=COLORS["step_bg"],
    )
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    # ステップ本文
    text_font = _get_font(56)
    wrapped = textwrap.fill(text, width=16)
    bbox3 = draw.textbbox((0, 0), wrapped, font=text_font)
    tw = bbox3[2] - bbox3[0]
    th = bbox3[3] - bbox3[1]
    text_x = (WIDTH - tw) // 2
    text_y = card_top + (card_bottom - card_top - th) // 2
    _draw_text_with_shadow(draw, (text_x, text_y), wrapped, text_font, COLORS["text_white"])

    return img


def _create_outro_frame(outro_text: str) -> Image.Image:
    """アウトロフレーム画像を作成。"""
    img = _create_gradient_bg()
    draw = ImageDraw.Draw(img)

    font = _get_font(64, bold=True)
    wrapped = textwrap.fill(outro_text, width=14)
    bbox = draw.textbbox((0, 0), wrapped, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    _draw_text_with_shadow(
        draw,
        ((WIDTH - tw) // 2, (HEIGHT - th) // 2 - 80),
        wrapped,
        font,
        COLORS["accent_yellow"],
        shadow_offset=4,
    )

    # CTA
    cta_font = _get_font(48)
    cta = "❤️ いいね & フォローよろしく！"
    bbox2 = draw.textbbox((0, 0), cta, font=cta_font)
    cw = bbox2[2] - bbox2[0]
    draw.text(((WIDTH - cw) // 2, HEIGHT // 2 + 100), cta, font=cta_font, fill=COLORS["text_white"])

    return img


def _generate_tts(text: str, output_path: str) -> str:
    """gTTSでテキストを音声に変換。"""
    tts = gTTS(text=text, lang="ja", slow=False)
    tts.save(output_path)
    return output_path


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

    clips = []

    # 1. フック
    hook_img_path = os.path.join(tmp_dir, "hook.png")
    hook_audio_path = os.path.join(tmp_dir, "hook.mp3")
    _create_hook_frame(script["hook"]).save(hook_img_path)
    _generate_tts(script["hook"], hook_audio_path)
    hook_audio = AudioFileClip(hook_audio_path)
    hook_clip = ImageClip(hook_img_path).with_duration(max(hook_audio.duration + 0.5, 3))
    hook_clip = hook_clip.with_audio(hook_audio)
    clips.append(hook_clip)

    # 2. ステップ
    steps = script["steps"]
    for i, step in enumerate(steps, 1):
        img_path = os.path.join(tmp_dir, f"step_{i}.png")
        audio_path = os.path.join(tmp_dir, f"step_{i}.mp3")
        _create_step_frame(i, step["text"], len(steps)).save(img_path)
        _generate_tts(step["text"], audio_path)
        step_audio = AudioFileClip(audio_path)
        step_clip = ImageClip(img_path).with_duration(max(step_audio.duration + 0.5, 3))
        step_clip = step_clip.with_audio(step_audio)
        clips.append(step_clip)

    # 3. アウトロ
    outro_img_path = os.path.join(tmp_dir, "outro.png")
    outro_audio_path = os.path.join(tmp_dir, "outro.mp3")
    _create_outro_frame(script["outro"]).save(outro_img_path)
    _generate_tts(script["outro"], outro_audio_path)
    outro_audio = AudioFileClip(outro_audio_path)
    outro_clip = ImageClip(outro_img_path).with_duration(max(outro_audio.duration + 1, 3))
    outro_clip = outro_clip.with_audio(outro_audio)
    clips.append(outro_clip)

    # 結合・書き出し
    final = concatenate_videoclips(clips, method="compose")
    output_path = os.path.join(output_dir, f"lifehack_{job_id}.mp4")
    final.write_videofile(
        output_path,
        fps=24,
        codec="libx264",
        audio_codec="aac",
        preset="fast",
        threads=4,
    )

    # クリーンアップ
    final.close()
    for clip in clips:
        clip.close()

    import shutil
    shutil.rmtree(tmp_dir, ignore_errors=True)

    return output_path
