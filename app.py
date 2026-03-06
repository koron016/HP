import os
import uuid
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify

load_dotenv()
from video_generator import generate_video
from script_generator import generate_lifehack_script

app = Flask(__name__)
app.config["OUTPUT_DIR"] = os.path.join(os.path.dirname(__file__), "static", "output")
os.makedirs(app.config["OUTPUT_DIR"], exist_ok=True)


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

    try:
        video_path = generate_video(script, job_id, app.config["OUTPUT_DIR"])
    except Exception as e:
        return jsonify({"error": f"動画生成に失敗しました: {e}"}), 500

    video_url = f"/static/output/{os.path.basename(video_path)}"
    return jsonify({
        "video_url": video_url,
        "script": script,
        "job_id": job_id,
    })


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
