#!/bin/bash
set -uo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Installs the "watch" skill (video analysis: ffmpeg + yt-dlp) since this
# container is ephemeral and rebuilt fresh on every session. Idempotent and
# best-effort: network/install hiccups must never block session start.

SKILL_DIR="$HOME/.claude/skills/watch"

if ! command -v ffmpeg >/dev/null 2>&1; then
  apt-get update -qq && apt-get install -y -qq ffmpeg || echo "warn: ffmpeg install failed" >&2
fi

if ! command -v yt-dlp >/dev/null 2>&1; then
  pip3 install --quiet --break-system-packages yt-dlp || echo "warn: yt-dlp install failed" >&2
fi

if [ ! -f "$SKILL_DIR/SKILL.md" ]; then
  tmp_tar="$(mktemp -d)/claude-video.tar.gz"
  if curl -sSL -o "$tmp_tar" https://codeload.github.com/bradautomates/claude-video/tar.gz/refs/heads/main; then
    mkdir -p "$SKILL_DIR"
    tar -xzf "$tmp_tar" -C "$SKILL_DIR" --strip-components=1 || echo "warn: skill extraction failed" >&2
  else
    echo "warn: skill download failed" >&2
  fi
fi

exit 0
