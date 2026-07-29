# CLAUDE.md

This file provides guidance to AI assistants (e.g. Claude Code) working in this repository.

---

## Read This First: Repository Shape

**This repository has no `main` or `master` branch.** It is not a single application. It is a
collection of independent projects, each living on its own `claude/*` branch. There is no
integration branch, and the branches are not intended to be merged into one another.

Two consequences that will bite you if you miss them:

1. **The files you see depend entirely on which branch is checked out.** Each branch holds a
   different project, and none of them contains the others. If a branch looks sparse, the
   repository is not empty — you are simply on a different project's branch.
2. **`claude/x-auto-posting-system-SjUEl` has an unrelated history.** It has its own root commit and
   shares no ancestor with the other branches (`git merge-base` returns nothing). Never try to
   rebase or merge it against them.

### Branch map

| Branch | Contents | History |
|---|---|---|
| `claude/claude-md-docs-3bgn2h` | **AI依存度診断** — static viral quiz site + this `CLAUDE.md` | From `ba06c52` |
| `claude/claude-md-mm05xnbhma94ky4k-pifkb` | Earlier `CLAUDE.md` only | `ba06c52` |
| `claude/ai-video-generation-tool-EWKRY` | **LifeHack AI** — Python/Flask TikTok video generator | Descends from `ba06c52` |
| `claude/x-auto-posting-system-SjUEl` | **X 自動投稿システム** — Node.js CLI auto-poster | **Orphan root** |

To inspect another project without switching branches:

```bash
git fetch origin <branch-name>
git ls-tree -r --name-only origin/<branch-name>
git show origin/<branch-name>:<path>
```

**Work only on your designated branch.** Do not add code for one project to another project's
branch, and do not push to a branch you were not assigned.

---

## Project: AI依存度診断 (viral quiz site)

*Branch: `claude/claude-md-docs-3bgn2h` (this branch)*

A Japanese share-driven quiz site: six questions, a percentage score, and one of six result types.
Built to be hosted free on GitHub Pages — plain HTML/CSS/JS, **no runtime dependencies and no
external requests**. Open `index.html` in a browser and it works.

```
assets/quiz-data.js   # ALL content: questions, scoring, result copy. Edit this, not the others.
assets/quiz.js        # Quiz flow, scoring, share-link building
assets/style.css      # Styling; palette is the first block
index.html            # The quiz screens (start / question / result)
result/<slug>.html    # GENERATED — one static page per result, each with its own OGP tags
assets/ogp/<slug>.png # GENERATED — 1200x630 share image per result, plus top.png
tools/build.js        # Regenerates both generated sets from quiz-data.js
README.md             # Japanese guide: editing, rebuilding, publishing
```

### The one rule that matters

**`assets/quiz-data.js` is the single source of truth, and `result/` + `assets/ogp/` are generated
from it.** After changing questions, scoring, or result copy, run:

```bash
node tools/build.js
```

Skipping this desyncs the live quiz from what X shows when a result is shared. `build.js` reads
`quiz-data.js` in a `vm` sandbox (the file assigns `window.QUIZ_DATA`), so the same data drives the
browser and the generator with no duplication. Do not hand-edit anything in `result/` or
`assets/ogp/` — it will be overwritten.

Image generation needs `playwright` (`npm install playwright`, optional). Without it `build.js`
still regenerates the HTML and reports that images were skipped. `CHROMIUM_PATH` overrides the
browser binary.

### Why it is built this way

- **Per-result static pages exist for share previews.** Static hosting cannot generate OGP images
  per request, but the result set is finite, so each result gets its own page and pre-rendered
  image. Collapsing these into one shared URL would make every share show the same picture and cost
  most of the click-through. This is the core of the design, not an implementation detail.
- **URLs are resolved at runtime** from `window.location`, so the quiz works from `file://`, from a
  project subpath, and from a custom domain. `siteUrl` in `quiz-data.js` is only used for the
  absolute `og:image` URLs baked in at build time — OGP requires absolute URLs.
- **Result score bands must stay contiguous and cover 0..max.** A gap makes a score fall through to
  the last result. Current bands cover 0–18 across six results.
- Design deliberately avoids the generic purple-gradient "AI product" look (2026 trend research:
  over-polished AI-styled pages blend in). Hence the lime accent, the tilted title block, and the
  SVG noise overlay.

### Content conventions

Questions are 4-choice, never binary, and there are six of them — both taken from research on what
actually gets shared (10+ questions increases drop-off; yes/no-only performs poorly). Result copy
carries a deliberate self-deprecating twist, which measurably increases sharing. Keep new copy in
Japanese and in that register.

### Verifying changes

There is no test suite. Drive the real thing: open `index.html`, play through picking the first
choice each time (expect 0% / 野生児) and the last choice each time (expect 100% / AIの一部), check
the back button, and confirm the share URL points at the matching `result/<slug>.html`.

---

## Project: LifeHack AI

*Branch: `claude/ai-video-generation-tool-EWKRY`*

A Flask web app that generates vertical TikTok-style Japanese "life hack" videos from a topic and a
tone. Designed to run **entirely free** — no paid API is required on any code path.

**Stack:** Python 3.11 · Flask · Pillow (frames) · gTTS (narration) · moviepy/FFmpeg (muxing) ·
gunicorn (production)

### Layout

```
app.py                  # Flask entrypoint, HTTP API, async job orchestration
script_generator.py     # Template-based script generation (no API calls)
video_generator.py      # Frame rendering, TTS, and video assembly
image_generator.py      # Optional AI backgrounds via Hugging Face Inference API
templates/index.html    # Single-page UI
static/css/style.css    # Neon/TikTok-style UI
static/js/app.js        # Frontend: submits job, polls for completion
static/fonts/           # Optional Noto Sans JP (not committed)
static/output/          # Generated videos + job state (gitignored)
requirements.txt · Dockerfile · render.yaml · .env.example
```

### Run it

```bash
pip install -r requirements.txt
python app.py                    # dev server on http://localhost:5000
```

FFmpeg must be present on the system. The `Dockerfile` installs it via `apt-get`; if you run
outside Docker you must provide it yourself.

### HTTP API

| Route | Purpose |
|---|---|
| `GET /` | Serve the UI |
| `POST /api/scripts/preview` | Generate a script only, synchronously |
| `POST /api/generate` | Generate script, then kick off video generation; returns `job_id` |
| `GET /api/jobs/<job_id>` | Poll job status: `processing` / `completed` / `error` |

### Architecture notes — read before changing these

- **Video generation is asynchronous, and deliberately so.** `POST /api/generate` returns a
  `job_id` immediately and renders in a daemon `threading.Thread`. This exists because synchronous
  rendering exceeded the platform's request timeout. Do not make this endpoint blocking again.
- **Job state is stored as JSON files** in `static/output/jobs/`, not in memory. This is required
  for correctness under gunicorn with multiple workers, which do not share process memory. A
  dict-based cache would appear to work locally and silently break in production.
- **Every external dependency degrades instead of failing.** `image_generator.generate_image()`
  returns `False` (never raises) when `HF_API_TOKEN` is unset, when the model is still loading
  (HTTP 503), or when rate-limited (429) past its retries; callers then fall back to Pillow-drawn
  gradient frames. `_get_font()` falls back to the PIL default when Noto Sans JP is absent.
  **Preserve this property** — the app is supposed to work with zero configuration.
- **Render resolution is 720×1280, downscaled from 1080×1920 on purpose,** and Ken Burns panning
  was removed, both to keep generation inside the deploy timeout. Treat these as performance
  budgets, not arbitrary constants.
- `render.yaml` pins gunicorn to `--workers 1 --threads 4 --timeout 120`; video work is CPU- and
  memory-heavy, so raising the worker count is not a free win.

### Script generation

`script_generator.py` is pure template substitution with no network calls. Hooks and outros are
keyed by style (`おもしろ系`, `驚き系`, `実用系`, `裏ワザ系`); body steps are chosen by keyword
matching the topic against `_STEP_SETS`, falling back to a generic pool when nothing matches. Adding
coverage means adding template data, not adding an API.

### Configuration

| Variable | Required | Effect |
|---|---|---|
| `HF_API_TOKEN` | No | Enables SDXL background generation. Without it, template images are used. |

---

## Project: X 自動投稿システム

*Branch: `claude/x-auto-posting-system-SjUEl`*

A Node.js CLI for posting to X (formerly Twitter): immediate posts, threads, and scheduled posts
backed by a local SQLite queue.

**Stack:** Node.js (CommonJS) · `twitter-api-v2` (OAuth 1.0a) · `better-sqlite3` · `node-cron` ·
`commander` · `dotenv`

### Layout

```
src/index.js      # Library entrypoint — re-exports the public surface
src/cli.js        # Commander CLI (the primary interface)
src/client.js     # Singleton authenticated X client
src/config.js     # Loads .env, validates required credentials
src/db.js         # SQLite schema + all queries
src/poster.js     # postTweet / postThread / postScheduledTweet
src/scheduler.js  # node-cron loop that drains due scheduled posts
```

### Run it

```bash
npm install
cp .env.example .env      # then fill in credentials
node src/cli.js verify    # confirm auth works before anything else
```

Commands: `post`, `thread`, `schedule -t "<YYYY-MM-DD HH:mm>"`, `list [-s <status>]`, `show <id>`,
`edit <id>`, `delete <id>`, `daemon`. npm scripts (`start`, `post`, `schedule`, `list`, `daemon`)
wrap the common ones.

### Architecture notes

- **`posts` table statuses are `pending` → `scheduled` → `posted` | `failed`.** `scheduled_at` is
  stored as a local-time string and compared with `datetime('now', 'localtime')`; the whole system
  is local-time based, so do not mix in UTC timestamps.
- **The scheduler polls; it does not hold timers.** `startScheduler()` runs a cron expression
  (every minute by default) and processes everything already due, so a restart cannot lose a
  scheduled post — it simply picks it up on the next tick. Keep that recovery property.
- **`getClient()` and `getDb()` are lazy singletons.** `getClient()` calls `validateConfig()` on
  first use, which is why credential errors surface at first API use rather than at import.
- **Threads chain via `in_reply_to_tweet_id`,** posted sequentially so each reply targets the
  previous tweet's real ID.
- `postScheduledTweet()` marks failure and rethrows; the scheduler swallows the rethrow because the
  error was already logged and persisted. That empty `catch` is intentional, not an oversight.
- Known rough edge: `markFailed(id, error)` accepts an error message but does not persist it — the
  `posts` table has no error column. Add one if you need failure diagnostics.

### Configuration

`X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET` are all required —
`validateConfig()` throws listing whichever are missing. `X_BEARER_TOKEN` is optional and currently
unused by the posting paths. The app needs **OAuth 1.0a with Read and Write** permission; read-only
credentials authenticate fine and then fail at post time.

`posts.db` is created at the repository root and is gitignored, along with `.env`, `node_modules/`,
and `*.log`.

---

## Tooling Status

**There are no tests, linters, formatters, or CI workflows in any branch of this repository.** No
`.github/`, no test suite, no ESLint/Ruff/pytest configuration.

Do not claim a change is "tested" or report passing checks — there is nothing to run. Verify
changes by exercising them directly: start the Flask app and drive a generation, or run
`node src/cli.js verify` and a real command. If you add tooling, document the commands here.

---

## Conventions

### Language

Both applications are Japanese-facing. UI strings, README content, CLI output, log messages, and
code comments are written in Japanese; identifiers and API field names are English. **Match the
surrounding file** — do not translate existing Japanese strings to English, and keep new
user-visible text in Japanese.

### Git

Feature branches follow `claude/<description>-<session-id>`. Always develop on the branch you were
assigned and never push to another branch without explicit permission.

Commit message style differs by project — follow whatever the branch already uses:

- **LifeHack AI branch:** imperative English subjects, e.g. `Add Dockerfile for container-based deployment`,
  `Fix video generation hanging by removing Ken Burns and reducing resolution`.
- **X auto-posting branch:** Conventional Commits with Japanese subjects, e.g.
  `feat: X（旧Twitter）自動投稿システムを実装`, `chore: add package-lock.json for reproducible installs`.

Keep subjects under 72 characters, add a blank line before any body, and reference issues where
applicable (`Fixes #42`).

Push with `git push -u origin <branch-name>`. On network failure, retry up to 4 times with
exponential backoff (2 s, 4 s, 8 s, 16 s). Never force-push a shared branch.

### Remote

The canonical repository is **`koron016/HP`** on GitHub. Locally, `origin` points at a session-local
proxy (`http://local_proxy@127.0.0.1:<port>/git/koron016/HP`) with an `insteadOf` rewrite from
`https://github.com/`. **The proxy port changes between sessions** — read it from
`git remote -v` rather than assuming a previously documented value.

### Detected git configuration

| Setting | Value |
|---|---|
| Committer | Claude (noreply@anthropic.com) |
| GPG signing | Enabled (SSH key format) |
| Auto GC | Disabled (`gc.auto=0`) |

### General working conventions

- Read existing files before modifying them; prefer editing over creating new files.
- Keep changes minimal and scoped; avoid refactoring unrelated code.
- Remove dead code rather than commenting it out.
- Both projects degrade gracefully when optional dependencies or credentials are missing. Preserve
  that — do not introduce hard failures on optional paths.

### Security

- Never commit secrets, credentials, or API keys. `.env` is gitignored in both projects; `.env.example`
  files carry placeholders only and must stay placeholder-only.
- Both apps accept free-form user input that reaches external services (image prompts, tweet bodies)
  and the filesystem (job IDs, output paths). Validate at those boundaries.
- Never log full API tokens or post bodies containing credentials.

---

## Updating This File

Update this file whenever a project gains a framework, tooling, or structural change — and
especially when a **new project branch is added**, since the branch map above is the only index of
what exists in this repository. Verify claims against the actual branches (`git ls-tree`,
`git show`) rather than carrying forward stale text; the previous version of this file described the
repository as empty long after two applications had been committed to it.
