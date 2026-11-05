// Screenshots for the README and the link preview, taken from the built demo: images/{hero,activity,map,timeline}.png and og.jpg.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const pub = path.resolve(process.argv[2] || 'public');
const img = path.join(pub, 'images');
fs.mkdirSync(img, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const p = await ctx.newPage();
await p.goto('file://' + path.join(pub, 'demo/replay.html'));
await p.waitForSelector('#tab-map', { timeout: 60000 });
await p.waitForTimeout(2500);
await p.addStyleTag({ content: '.rw-banner{display:none!important}' });
const hide = await p.addStyleTag({ content: '.tl-state.past{visibility:hidden}' });
await p.click('#tab-activity'); await p.waitForTimeout(1200);
await p.screenshot({ path: path.join(img, 'activity.png') });
await p.click('#tab-map'); await p.waitForTimeout(2500);
await p.screenshot({ path: path.join(img, 'map.png') });
const card = p.locator('text=orders.ts').first();
if (await card.count()) { await card.click(); await p.waitForTimeout(1500); }
await p.screenshot({ path: path.join(img, 'hero.png') });
await p.keyboard.press('Escape'); await hide.evaluate(e => e.remove());
const tr = await p.locator('.track').first().boundingBox();
await p.mouse.move(tr.x + tr.width - 2, tr.y + tr.height / 2); await p.mouse.down();
await p.mouse.move(tr.x + tr.width * 0.45, tr.y + tr.height / 2, { steps: 10 }); await p.mouse.up();
await p.waitForTimeout(2000);
await p.screenshot({ path: path.join(img, 'timeline.png') });
await ctx.close();

const og = await b.newPage({ viewport: { width: 1200, height: 630 } });
const fonts = '../demo/fonts/';
const ogFile = path.join(img, '_og.html');
fs.writeFileSync(ogFile, `<!doctype html><html><head><style>
@font-face{font-family:G;src:url(${fonts}geist-sans-latin-700-normal.woff2);font-weight:700}
@font-face{font-family:GM;src:url(${fonts}geist-mono-latin-500-normal.woff2);font-weight:500}
body{margin:0;width:1200px;height:630px;overflow:hidden;background:#eef0f5;font-family:G;position:relative}
.bl{position:absolute;border-radius:50%;filter:blur(80px)}
.t{position:absolute;left:64px;top:70px;width:520px}
.b{display:flex;align-items:center;gap:12px;font-weight:700;font-size:26px;color:#1d1d1f;letter-spacing:-.01em}
.m{width:38px;height:38px;border-radius:12px;background:conic-gradient(from 210deg,#0a7cff,#a64df0,#f0287a,#ff8a00,#0a7cff)}
h1{font-weight:700;font-size:62px;line-height:1.04;letter-spacing:-.035em;color:#1d1d1f;margin:44px 0 0}
h1 span{background:linear-gradient(90deg,#0a7cff,#a64df0 45%,#f0287a 75%,#ff8a00);-webkit-background-clip:text;color:transparent}
.c{margin-top:34px;display:inline-block;font:500 22px GM;padding:14px 20px;border-radius:14px;background:rgba(255,255,255,.8);box-shadow:0 0 0 1px rgba(0,0,0,.06),0 10px 30px rgba(17,24,39,.08)}
.c b{color:#a64df0;font-weight:500}
.s{position:absolute;left:620px;top:70px;width:820px;border-radius:18px;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.7),0 30px 90px rgba(17,24,39,.25)}
.s img{display:block;width:100%}
</style></head><body>
<div class="bl" style="width:700px;height:700px;left:-200px;top:-350px;background:rgba(10,124,255,.22)"></div>
<div class="bl" style="width:600px;height:600px;right:-180px;bottom:-300px;background:rgba(240,40,122,.15)"></div>
<div class="bl" style="width:500px;height:500px;left:380px;top:330px;background:rgba(255,170,0,.13)"></div>
<div class="t"><div class="b"><span class="m"></span>LiveMap</div>
<h1>See what your agent builds. <span>Live.</span></h1>
<div class="c"><b>$</b> npm i -g livemap</div></div>
<div class="s"><img src="hero.png"></div>
</body></html>`);
await og.goto('file://' + ogFile, { waitUntil: 'load' });
await og.evaluate(() => document.fonts.ready); await og.waitForTimeout(500);
await og.screenshot({ path: path.join(img, 'og.jpg'), type: 'jpeg', quality: 90 });
fs.rmSync(ogFile);
await b.close();
console.log('shots done', fs.readdirSync(img));
