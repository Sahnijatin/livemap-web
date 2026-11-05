#!/usr/bin/env bash
# Vercel build: builds LiveMap from source, assembles the site into public/ and takes the screenshots.
set -euo pipefail
cd "$(dirname "$0")/.."
git clone --depth 1 https://github.com/Sahnijatin/livemap lm
(cd lm && npm ci --no-audit --no-fund && npm --prefix ui ci --no-audit --no-fund && npm run build)
rm -rf public
mkdir -p public/demo/fonts public/images
node build/compose.mjs lm/dist build public/demo/replay.html
cp src/index.html public/demo/index.html
for w in 400 500 600 700; do cp "lm/ui/node_modules/@fontsource/geist-sans/files/geist-sans-latin-$w-normal.woff2" public/demo/fonts/; done
cp lm/ui/node_modules/@fontsource/geist-mono/files/geist-mono-latin-500-normal.woff2 public/demo/fonts/
npm install --prefix build --no-save --no-package-lock --no-audit --no-fund playwright-core@1.56.1 @sparticuz/chromium@141.0.0
SHOTS_SERVERLESS=1 node build/shots.mjs public
ls -la public public/demo public/images
