// Builds demo/replay.html from a LiveMap build: the export page, the grammars it needs, the demo payload,
// a slower playback speed and the autoplay hook.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
const [dist, here, out] = process.argv.slice(2);
let html = fs.readFileSync(path.join(dist, 'ui-export/index.html'), 'utf8');
const gdir = path.join(dist, 'ui-export/grammars');
const byName = new Map();
for (const id of ['json', 'prisma', 'sql', 'tsx', 'typescript']) {
  for (const g of JSON.parse(fs.readFileSync(path.join(gdir, `${id}.json`), 'utf8'))) if (!byName.has(g.name)) byName.set(g.name, g);
}
const grammars = { langs: [...byName.values()], wasm: fs.readFileSync(path.join(gdir, 'onig.wasm.b64'), 'utf8').trim() };
const payload = fs.readFileSync(path.join(here, 'payload.b64'), 'utf8').replace(/\s+/g, '');
JSON.parse(zlib.gunzipSync(Buffer.from(payload, 'base64')).toString('utf8')); // throws if the payload is damaged
const tag = `<script type="application/json" id="livemap-grammars">${JSON.stringify(grammars).replace(/</g, '\\u003c')}</script>`
  + `<script type="application/octet-stream" id="livemap-data">${payload}</script>`;
const at = html.lastIndexOf('</body>');
html = html.slice(0, at) + tag + html.slice(at);
const speed = /([A-Za-z_$][\w$]*)=8,([A-Za-z_$][\w$]*)=400/;
if (!speed.test(html)) throw new Error('playback speed constants not found');
html = html.replace(speed, '$1=4,$2=900');
const hook = fs.readFileSync(path.join(here, 'autoplay.html'), 'utf8');
const end = html.lastIndexOf('</body>');
html = html.slice(0, end) + hook + html.slice(end);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log('wrote', out, html.length);
