document.addEventListener("DOMContentLoaded", () => {
    const topicInput = document.getElementById("topic");
    const styleBtns = document.querySelectorAll(".style-btn");
    const btnPreview = document.getElementById("btn-preview");
    const btnGenerate = document.getElementById("btn-generate");
    const btnClosePreview = document.getElementById("btn-close-preview");
    const btnNew = document.getElementById("btn-new");
    const btnRetry = document.getElementById("btn-retry");
    const btnDownload = document.getElementById("btn-download");

    const inputSection = document.querySelector(".input-section");
    const loadingSection = document.getElementById("loading");
    const previewSection = document.getElementById("script-preview");
    const resultSection = document.getElementById("result");
    const errorSection = document.getElementById("error");
    const loaderText = document.querySelector(".loader-text");

    let selectedStyle = "おもしろ系";

    // スタイル選択
    styleBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            styleBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            selectedStyle = btn.dataset.style;
        });
    });

    // セクション表示切り替え
    function showSection(section) {
        [inputSection, loadingSection, previewSection, resultSection, errorSection]
            .forEach((s) => s.classList.add("hidden"));
        section.classList.remove("hidden");
    }

    function showError(message) {
        document.getElementById("error-message").textContent = message;
        showSection(errorSection);
    }

    // ローディングステップ更新
    function updateLoaderStep(stepName) {
        const steps = document.querySelectorAll(".loader-step");
        let found = false;
        steps.forEach((step) => {
            if (step.dataset.step === stepName) {
                step.classList.add("active");
                found = true;
            } else if (!found) {
                step.classList.remove("active");
                step.classList.add("done");
                step.textContent = "✅ " + step.textContent.replace(/^[^\s]+\s/, "");
            }
        });
    }

    // ローディングステップリセット
    function resetLoaderSteps() {
        const originals = [
            { step: "script", text: "📝 台本生成" },
            { step: "image", text: "🖼️ 画像生成" },
            { step: "audio", text: "🔊 音声合成" },
            { step: "video", text: "🎬 動画合成" },
        ];
        const steps = document.querySelectorAll(".loader-step");
        steps.forEach((step, i) => {
            step.classList.remove("active", "done");
            step.textContent = originals[i].text;
        });
        steps[0].classList.add("active");
        loaderText.textContent = "AIが台本を作成中...";
    }

    // 台本HTMLを生成
    function renderScript(script) {
        let html = "";
        html += `<div class="script-hook">🎯 ${escapeHtml(script.hook)}</div>`;
        script.steps.forEach((step, i) => {
            html += `<div class="script-step">`;
            html += `<span class="script-step-num">STEP ${i + 1}</span>`;
            html += escapeHtml(step.text);
            html += `</div>`;
        });
        html += `<div class="script-outro">💬 ${escapeHtml(script.outro)}</div>`;
        return html;
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    // 台本プレビュー
    btnPreview.addEventListener("click", async () => {
        const topic = topicInput.value.trim();
        if (!topic) {
            topicInput.focus();
            topicInput.style.borderColor = "var(--accent-pink)";
            setTimeout(() => topicInput.style.borderColor = "", 2000);
            return;
        }

        showSection(loadingSection);
        resetLoaderSteps();
        loaderText.textContent = "AIが台本を作成中...";

        try {
            const res = await fetch("/api/scripts/preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, style: selectedStyle }),
            });
            const data = await res.json();
            if (!res.ok) {
                showError(data.error || "エラーが発生しました");
                return;
            }
            document.getElementById("script-content").innerHTML = renderScript(data.script);
            showSection(previewSection);
        } catch (e) {
            showError("通信エラーが発生しました。もう一度お試しください。");
        }
    });

    // 動画生成
    btnGenerate.addEventListener("click", async () => {
        const topic = topicInput.value.trim();
        if (!topic) {
            topicInput.focus();
            topicInput.style.borderColor = "var(--accent-pink)";
            setTimeout(() => topicInput.style.borderColor = "", 2000);
            return;
        }

        showSection(loadingSection);
        resetLoaderSteps();

        // ローディングアニメーション（進捗シミュレーション）
        const stepTimers = [
            setTimeout(() => {
                updateLoaderStep("image");
                loaderText.textContent = "画像を生成中...";
            }, 5000),
            setTimeout(() => {
                updateLoaderStep("audio");
                loaderText.textContent = "音声を合成中...";
            }, 10000),
            setTimeout(() => {
                updateLoaderStep("video");
                loaderText.textContent = "動画を合成中...";
            }, 18000),
        ];

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, style: selectedStyle }),
            });
            stepTimers.forEach(clearTimeout);

            const data = await res.json();
            if (!res.ok) {
                showError(data.error || "エラーが発生しました");
                return;
            }

            // 結果表示
            const video = document.getElementById("result-video");
            video.querySelector("source").src = data.video_url;
            video.load();

            document.getElementById("result-script").innerHTML = renderScript(data.script);
            btnDownload.href = data.video_url;
            btnDownload.download = `lifehack_${data.job_id}.mp4`;

            showSection(resultSection);
        } catch (e) {
            stepTimers.forEach(clearTimeout);
            showError("通信エラーが発生しました。もう一度お試しください。");
        }
    });

    // 閉じる・再試行・新規
    btnClosePreview.addEventListener("click", () => showSection(inputSection));
    btnRetry.addEventListener("click", () => showSection(inputSection));
    btnNew.addEventListener("click", () => {
        topicInput.value = "";
        showSection(inputSection);
    });

    // Enter キーで生成
    topicInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") btnGenerate.click();
    });
});
