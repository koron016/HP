import os
import uuid
import json
import threading
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify

load_dotenv()
from video_generator import generate_video
from script_generator import generate_lifehack_script

app = Flask(__name__)
app.config["OUTPUT_DIR"] = os.path.join(os.path.dirname(__file__), "static", "output")
os.makedirs(app.config["OUTPUT_DIR"], exist_ok=True)

# ジョブ状態をファイルで管理（gunicornマルチワーカー対応）
JOBS_DIR = os.path.join(os.path.dirname(__file__), "static", "output", "jobs")
os.makedirs(JOBS_DIR, exist_ok=True)


def _save_job(job_id, data):
    path = os.path.join(JOBS_DIR, f"{job_id}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)


def _load_job(job_id):
    path = os.path.join(JOBS_DIR, f"{job_id}.json")
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/generate", methods=["POST"])
def api_generate():
    data = request.get_json()
    topic = data.get("topic", "").strip()
    style = data.get("style", "おもしろ系")

    if not topic:
        return jsonify({"error": "トピックを入力してください"}), 400

    try:
        script = generate_lifehack_script(topic, style)
    except Exception as e:
        return jsonify({"error": f"台本生成に失敗しました: {e}"}), 500

    job_id = str(uuid.uuid4())[:8]
    _save_job(job_id, {
        "status": "processing",
        "script": script,
        "video_url": None,
        "error": None,
    })

    output_dir = app.config["OUTPUT_DIR"]
    thread = threading.Thread(
        target=_run_video_generation,
        args=(job_id, script, output_dir),
        daemon=True,
    )
    thread.start()

    return jsonify({"job_id": job_id, "script": script})


def _run_video_generation(job_id, script, output_dir):
    """バックグラウンドで動画を生成する。"""
    try:
        video_path = generate_video(script, job_id, output_dir)
        video_url = f"/static/output/{os.path.basename(video_path)}"
        _save_job(job_id, {
            "status": "completed",
            "script": script,
            "video_url": video_url,
            "error": None,
        })
    except Exception as e:
        _save_job(job_id, {
            "status": "error",
            "script": script,
            "video_url": None,
            "error": str(e),
        })


@app.route("/api/jobs/<job_id>", methods=["GET"])
def api_job_status(job_id):
    """ジョブの進捗状況を返す。"""
    job = _load_job(job_id)
    if not job:
        return jsonify({"error": "ジョブが見つかりません"}), 404
    return jsonify(job)


@app.route("/api/scripts/preview", methods=["POST"])
def api_script_preview():
    data = request.get_json()
    topic = data.get("topic", "").strip()
    style = data.get("style", "おもしろ系")

    if not topic:
        return jsonify({"error": "トピックを入力してください"}), 400

    try:
        script = generate_lifehack_script(topic, style)
        return jsonify({"script": script})
    except Exception as e:
        return jsonify({"error": f"台本生成に失敗しました: {e}"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
