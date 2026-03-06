import os
import textwrap
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from gtts import gTTS
from moviepy import (
    ImageClip,
    AudioFileClip,
    CompositeVideoClip,
    concatenate_videoclips,
    vfx,
)
from image_generator import generate_image, build_prompt


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

# トランジション・アニメーション設定
FADE_DURATION = 0.5  # フェードイン・アウトの長さ(秒)
ZOOM_RATIO = 0.08  # Ken Burns ズーム量 (8%)
PAN_PIXELS = 40  # パンの移動ピクセル数


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

    padding = 30
    if position == "center":
        text_x = (WIDTH - tw) // 2
        text_y = (HEIGHT - th) // 2
    elif position == "bottom":
        text_x = (WIDTH - tw) // 2
        text_y = HEIGHT - th - 300
    elif position == "top":
        text_x = (WIDTH - tw) // 2
        text_y = 200

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
                                     font_size=72, color=COLORS["accent_cyan"])

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
    tip = "最後まで見てね！"
    bbox2 = draw.textbbox((0, 0), tip, font=small_font)
    tw2 = bbox2[2] - bbox2[0]
    draw.text(((WIDTH - tw2) // 2, HEIGHT - 250), tip, font=small_font, fill=COLORS["accent_yellow"])

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
                                     font_size=48, color=COLORS["accent_cyan"])
            # 本文を下に表示
            img = _add_text_overlay(img, text, position="bottom",
                                     font_size=56, color=COLORS["text_white"])
            return img

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


def _create_outro_frame(outro_text: str, tmp_dir: str = None, topic: str = "") -> Image.Image:
    """アウトロフレーム画像を作成。AI画像があればそれを使う。"""
    # AI画像生成を試みる
    if tmp_dir and topic:
        ai_path = os.path.join(tmp_dir, "ai_outro.png")
        prompt_desc = f"celebration scene, thumbs up, like button, follow, happy ending, social media"
        if _try_ai_image(prompt_desc, topic, ai_path):
            img = Image.open(ai_path).resize((WIDTH, HEIGHT), Image.LANCZOS)
            return _add_text_overlay(img, outro_text, position="center",
                                     font_size=64, color=COLORS["accent_yellow"])

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
    cta = "いいね＆フォローよろしく！"
    bbox2 = draw.textbbox((0, 0), cta, font=cta_font)
    cw = bbox2[2] - bbox2[0]
    draw.text(((WIDTH - cw) // 2, HEIGHT // 2 + 100), cta, font=cta_font, fill=COLORS["text_white"])

    return img


def _generate_tts(text: str, output_path: str) -> str:
    """gTTSでテキストを音声に変換。"""
    tts = gTTS(text=text, lang="ja", slow=False)
    tts.save(output_path)
    return output_path


def _apply_ken_burns(clip, duration, direction="zoom_in"):
    """Ken Burns効果（ズーム＋パン）を適用して動きのある映像にする。

    大きめの画像からクロップしてズーム・パンをシミュレートする。
    """
    w, h = clip.size

    # 余白を持たせるためにリサイズ（少し大きくする）
    margin = ZOOM_RATIO
    scale_start = 1.0 + margin
    scale_end = 1.0

    if direction == "zoom_in":
        scale_start, scale_end = 1.0, 1.0 + margin
    elif direction == "zoom_out":
        scale_start, scale_end = 1.0 + margin, 1.0
    elif direction == "pan_left":
        scale_start = scale_end = 1.0 + margin

    # 拡大した画像を作成
    big_w = int(w * (1.0 + margin))
    big_h = int(h * (1.0 + margin))
    resized_clip = clip.resized((big_w, big_h))

    def make_frame_func(get_frame):
        def new_get_frame(t):
            progress = t / duration if duration > 0 else 0
            progress = min(progress, 1.0)

            if direction in ("zoom_in", "zoom_out"):
                current_scale = scale_start + (scale_end - scale_start) * progress
                crop_w = int(w / current_scale * (1.0 + margin))
                crop_h = int(h / current_scale * (1.0 + margin))
                # 中心からクロップ
                cx, cy = big_w // 2, big_h // 2
                x1 = max(0, cx - crop_w // 2)
                y1 = max(0, cy - crop_h // 2)
                x2 = min(big_w, x1 + crop_w)
                y2 = min(big_h, y1 + crop_h)
            elif direction == "pan_left":
                crop_w, crop_h = w, h
                max_offset = big_w - w
                x_offset = int(max_offset * (1 - progress))
                x1 = x_offset
                y1 = (big_h - h) // 2
                x2 = x1 + crop_w
                y2 = y1 + crop_h
            elif direction == "pan_right":
                crop_w, crop_h = w, h
                max_offset = big_w - w
                x_offset = int(max_offset * progress)
                x1 = x_offset
                y1 = (big_h - h) // 2
                x2 = x1 + crop_w
                y2 = y1 + crop_h
            else:
                return get_frame(t)

            frame = get_frame(t)
            # フレームからクロップしてリサイズ
            cropped = frame[y1:y2, x1:x2]
            if cropped.shape[0] == 0 or cropped.shape[1] == 0:
                return frame[:h, :w]
            # numpy でリサイズ（PILを使用）
            pil_img = Image.fromarray(cropped)
            pil_img = pil_img.resize((w, h), Image.LANCZOS)
            return np.array(pil_img)

        return new_get_frame

    new_clip = resized_clip.transform(make_frame_func)
    new_clip = new_clip.resized((w, h))
    return new_clip.with_duration(duration)


# Ken Burns方向のローテーション
_KB_DIRECTIONS = ["zoom_in", "zoom_out", "pan_left", "pan_right"]


def _make_animated_clip(img_path, audio_clip, clip_index):
    """静止画+音声からアニメーション付きクリップを作成。"""
    duration = max(audio_clip.duration + 0.8, 3.0)

    base_clip = ImageClip(img_path).with_duration(duration)

    # Ken Burns効果を適用（クリップごとに方向を変える）
    direction = _KB_DIRECTIONS[clip_index % len(_KB_DIRECTIONS)]
    animated = _apply_ken_burns(base_clip, duration, direction)

    # フェードイン・フェードアウト
    animated = animated.with_effects([
        vfx.FadeIn(FADE_DURATION),
        vfx.FadeOut(FADE_DURATION),
    ])

    # 音声をつける
    animated = animated.with_audio(audio_clip)

    return animated


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
    clip_index = 0

    # 1. フック
    hook_img_path = os.path.join(tmp_dir, "hook.png")
    hook_audio_path = os.path.join(tmp_dir, "hook.mp3")
    _create_hook_frame(script["hook"], tmp_dir=tmp_dir, topic=topic).save(hook_img_path)
    _generate_tts(script["hook"], hook_audio_path)
    hook_audio = AudioFileClip(hook_audio_path)
    hook_clip = _make_animated_clip(hook_img_path, hook_audio, clip_index)
    clips.append(hook_clip)
    clip_index += 1

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
        step_clip = _make_animated_clip(img_path, step_audio, clip_index)
        clips.append(step_clip)
        clip_index += 1

    # 3. アウトロ
    outro_img_path = os.path.join(tmp_dir, "outro.png")
    outro_audio_path = os.path.join(tmp_dir, "outro.mp3")
    _create_outro_frame(script["outro"], tmp_dir=tmp_dir, topic=topic).save(outro_img_path)
    _generate_tts(script["outro"], outro_audio_path)
    outro_audio = AudioFileClip(outro_audio_path)
    outro_clip = _make_animated_clip(outro_img_path, outro_audio, clip_index)
    clips.append(outro_clip)

    # クロスフェードで結合
    final = concatenate_videoclips(clips, method="compose", padding=-FADE_DURATION)
    output_path = os.path.join(output_dir, f"lifehack_{job_id}.mp4")
    final.write_videofile(
        output_path,
        fps=30,
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
