// Stitches audit/compare images into one contact sheet at reduced scale for quick review.
// Usage: node tools/contact.mjs out.png Frame1 Frame2 ...
import fs from 'node:fs';
import { chromium } from '@playwright/test';
const [out, ...frames] = process.argv.slice(2);
const imgs = frames.map((f) => `<figure style="margin:0;font:12px sans-serif"><img style="width:400px" src="data:image/png;base64,${fs.readFileSync('audit/compare/' + f + '.png').toString('base64')}"><figcaption>${f}</figcaption></figure>`).join('');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1240, height: 400 } });
await p.setContent(`<body style="margin:0;display:flex;flex-wrap:wrap;gap:8px;background:#fff">${imgs}</body>`);
await p.screenshot({ path: out, fullPage: true });
await b.close();
