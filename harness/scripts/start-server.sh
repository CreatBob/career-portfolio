#!/usr/bin/env sh
set -eu

PORT="${PORT:-3000}"
export PORT
pnpm dev
