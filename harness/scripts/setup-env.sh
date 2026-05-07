#!/usr/bin/env sh
set -eu

if command -v pnpm >/dev/null 2>&1; then
  pnpm install
else
  echo "pnpm is required. Install pnpm, then rerun this script." >&2
  exit 1
fi
