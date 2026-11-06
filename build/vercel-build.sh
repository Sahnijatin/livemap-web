#!/usr/bin/env bash
# Vercel build: builds LiveMap from source, assembles the site into public/ and takes the screenshots.
set -euo pipefail
cd "$(dirname "$0")/.."
git clone --depth 1 https://github.com/Sahnijatin/livemap lm
(cd lm && npm ci --no-audit --no-fund && npm --prefix ui ci --no-audit --no-fund && npm run build)
rm -rf public
mkdir -p public/demo/fonts public/images
node build/compose.mjs lm/dist build public/demo/replay.html
cp src/home.html public/index.html
cp src/demo.html public/demo/index.html
# Vercel Web Analytics (cookieless page views) on the two pages people land on.
node -e 'const fs=require("fs");const tag="<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};</script><script defer src=\"/_vercel/insights/script.js\"></script>";for(const f of ["public/index.html","public/demo/index.html"]){const h=fs.readFileSync(f,"utf8");if(!h.includes("</head>"))throw new Error(f+": no </head>");fs.writeFileSync(f,h.replace("</head>",tag+"</head>"))}'
for w in 400 500 600 700; do cp "lm/ui/node_modules/@fontsource/geist-sans/files/geist-sans-latin-$w-normal.woff2" public/demo/fonts/; done
cp lm/ui/node_modules/@fontsource/geist-mono/files/geist-mono-latin-500-normal.woff2 public/demo/fonts/
npm install --prefix build --no-save --no-package-lock --no-audit --no-fund playwright-core@1.56.1 @sparticuz/chromium@141.0.0
SHOTS_SERVERLESS=1 node build/shots.mjs public
ls -la public public/demo public/images
