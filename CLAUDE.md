# CLAUDE.md

This file provides guidance to AI assistants (e.g. Claude Code) working in this repository.

---

## Repository Status

This repository is currently **empty** — no source code, dependencies, or configuration files have been added yet. This CLAUDE.md will be updated as the project evolves.

**Remote:** `http://local_proxy@127.0.0.1:31504/git/koron016/HP`

---

## Git Conventions

### Branch Naming

Feature branches developed by Claude Code follow the pattern:

```
claude/<description>-<session-id>
```

Example: `claude/claude-md-mm05xnbhma94ky4k-pifkb`

Always develop on the designated feature branch and never push directly to `main` or `master` without explicit permission.

### Commit Messages

- Use clear, imperative-mood subject lines (e.g. "Add authentication module", "Fix null pointer in parser")
- Keep subject lines under 72 characters
- Add a blank line between the subject and body when additional context is needed
- Reference issue numbers when applicable (e.g. `Fixes #42`)

### Push Protocol

- Always push with: `git push -u origin <branch-name>`
- If a push fails due to a network error, retry up to 4 times with exponential backoff (2 s, 4 s, 8 s, 16 s)
- Never force-push to shared branches

---

## Git Configuration (Detected)

| Setting | Value |
|---|---|
| Committer | Claude (noreply@anthropic.com) |
| GPG Signing | Enabled (SSH key format) |
| Auto GC | Disabled |

---

## Development Workflow

Since the project is not yet defined, the following is a recommended baseline workflow to adopt as code is added:

1. **Fetch latest changes** before starting work:
   ```bash
   git fetch origin <branch-name>
   git pull origin <branch-name>
   ```

2. **Make changes** on the designated feature branch.

3. **Run tests and linting** (commands to be documented once tooling is set up).

4. **Commit** with a descriptive message.

5. **Push** to the feature branch:
   ```bash
   git push -u origin <branch-name>
   ```

---

## Project Structure

_To be documented once source files are added._

Suggested sections to add here when the project grows:

- **`src/` or equivalent** — main source code
- **`tests/`** — test suite
- **`docs/`** — project documentation
- **Build & dependency files** — e.g. `package.json`, `Cargo.toml`, `go.mod`, `requirements.txt`
- **CI/CD** — e.g. `.github/workflows/`

---

## Key Conventions for AI Assistants

### General

- Read existing files before modifying them.
- Prefer editing existing files over creating new ones.
- Keep changes minimal and focused on the task at hand; avoid refactoring unrelated code.
- Do not introduce security vulnerabilities (SQL injection, XSS, command injection, etc.).
- Remove dead code rather than leaving it commented out.

### When Code Is Added

Once source code exists, update this file with:

- The primary language and framework in use.
- How to install dependencies.
- How to run the test suite.
- How to run the linter/formatter.
- Any environment variables required (use `.env.example` as a reference).
- Architectural decisions and design patterns in use.

### Security

- Never commit secrets, credentials, or API keys.
- Validate all external input at system boundaries.
- Follow least-privilege principles when writing permission/auth logic.

---

## Updating This File

Whenever a significant change is made to the project (new framework, new tooling, structural reorganisation), update this file to reflect the current state of the repository so that future AI assistants have accurate context.
