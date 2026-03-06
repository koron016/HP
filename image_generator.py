"""Hugging Face Inference APIを使ったAI画像生成モジュール。

無料のServerless Inference APIを使用。
HF_API_TOKEN が未設定の場合はフォールバック画像を返す。
"""

import io
import os
import time
import requests
from PIL import Image

HF_API_TOKEN = os.environ.get("HF_API_TOKEN", "")
# 無料で使える高品質モデル
MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0"
API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"

# リトライ設定
MAX_RETRIES = 3
RETRY_WAIT = 10  # モデルロード待ち（秒）


def generate_image(prompt: str, output_path: str, width: int = 1080, height: int = 1920) -> bool:
    """プロンプトからAI画像を生成して保存する。

    Args:
        prompt: 英語の画像生成プロンプト
        output_path: 画像の保存先パス
        width: 画像幅
        height: 画像高さ

    Returns:
        True: AI画像生成に成功
        False: 失敗（フォールバックが必要）
    """
    if not HF_API_TOKEN:
        return False

    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    # SDXL は 1024x1024 が最適。縦長は後でリサイズ
    payload = {
        "inputs": prompt,
        "parameters": {
            "width": 768,
            "height": 1344,
            "guidance_scale": 7.5,
            "num_inference_steps": 25,
        },
    }

    for attempt in range(MAX_RETRIES):
        try:
            response = requests.post(API_URL, headers=headers, json=payload, timeout=120)

            if response.status_code == 200:
                image = Image.open(io.BytesIO(response.content))
                # TikTokサイズにリサイズ
                image = image.resize((width, height), Image.LANCZOS)
                image.save(output_path, "PNG")
                return True

            if response.status_code == 503:
                # モデルがロード中
                try:
                    wait_time = response.json().get("estimated_time", RETRY_WAIT)
                except Exception:
                    wait_time = RETRY_WAIT
                print(f"[image_generator] Model loading, waiting {wait_time:.0f}s... (attempt {attempt + 1})")
                time.sleep(min(wait_time, 60))
                continue

            if response.status_code == 429:
                # レート制限
                print(f"[image_generator] Rate limited, waiting {RETRY_WAIT}s...")
                time.sleep(RETRY_WAIT)
                continue

            print(f"[image_generator] API error {response.status_code}: {response.text[:200]}")
            return False

        except requests.exceptions.Timeout:
            print(f"[image_generator] Timeout (attempt {attempt + 1})")
            continue
        except Exception as e:
            print(f"[image_generator] Error: {e}")
            return False

    return False


def build_prompt(scene_description: str, topic: str) -> str:
    """日本語のシーン説明から英語の画像生成プロンプトを構築する。

    TikTokでバズるようなカラフルで目を引く3Dスタイルの画像を生成する。
    """
    base_style = (
        "3D rendered, Pixar style, cute cartoon character, "
        "vibrant colors, dramatic lighting, cinematic composition, "
        "TikTok viral style, highly detailed, 8k quality, "
        "Japanese lifestyle theme"
    )

    # トピック→英語キーワードの簡易マッピング
    topic_keywords = {
        "料理": "cooking, kitchen, food",
        "キッチン": "kitchen, cooking utensils",
        "掃除": "cleaning, household",
        "収納": "storage, organization, tidy room",
        "スマホ": "smartphone, technology",
        "iPhone": "iPhone, smartphone, technology",
        "ペットボトル": "plastic bottle, DIY craft",
        "ボトル": "bottle, container",
        "洗濯": "laundry, washing",
        "節約": "saving money, budget",
        "時短": "time saving, efficiency",
        "美容": "beauty, skincare",
        "健康": "health, wellness",
        "勉強": "studying, education",
        "DIY": "DIY, crafting, handmade",
    }

    # トピックに合うキーワードを探す
    extra_keywords = ""
    for jp_key, en_val in topic_keywords.items():
        if jp_key in topic:
            extra_keywords = en_val
            break

    if not extra_keywords:
        extra_keywords = "lifestyle hack, daily life"

    prompt = f"{base_style}, {extra_keywords}, {scene_description}"

    # ネガティブ要素を除外
    negative = (
        "Avoid: text, watermark, blurry, low quality, "
        "deformed, ugly, bad anatomy"
    )

    return prompt
