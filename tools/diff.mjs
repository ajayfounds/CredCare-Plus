// Pixel diff of audit/screens/<Frame>.png against the reference renders. Writes audit/diff/<Frame>.png and
// audit/diff.json with the share of pixels that differ (pixelmatch threshold 0.1, anti-aliasing ignored).
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const REF = path.resolve('../credcare-v9-handoff/reference/screens');
fs.mkdirSync('audit/diff', { recursive: true });
const out = {};
for (const f of fs.readdirSync('audit/screens').filter((x) => x.endsWith('.png'))) {
  const a = PNG.sync.read(fs.readFileSync(path.join(REF, f)));
  const b = PNG.sync.read(fs.readFileSync(path.join('audit/screens', f)));
  const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height);
  const crop = (img) => { const o = new PNG({ width: w, height: h }); PNG.bitblt(img, o, 0, 0, w, h, 0, 0); return o; };
  const A = crop(a), B = crop(b), D = new PNG({ width: w, height: h });
  const n = pixelmatch(A.data, B.data, D.data, w, h, { threshold: 0.1 });
  fs.writeFileSync(path.join('audit/diff', f), PNG.sync.write(D));
  out[f.replace('.png', '')] = +((n / (w * h)) * 100).toFixed(2);
}
fs.writeFileSync('audit/diff.json', JSON.stringify(out, null, 2));
const vals = Object.entries(out).sort((x, y) => y[1] - x[1]);
console.log('frames', vals.length, 'median %', vals[Math.floor(vals.length / 2)][1]);
console.log(vals.slice(0, 15).map(([k, v]) => `${k} ${v}%`).join('\n'));
