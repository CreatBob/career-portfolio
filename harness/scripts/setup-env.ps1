if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  Write-Error "pnpm is required. Install pnpm, then rerun this script."
  exit 1
}

pnpm install
