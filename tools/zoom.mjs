// 200 % text zoom check: doubles the root font size (what a browser's text-size setting does to rem) and
// reports any text element whose content is clipped by its box, plus horizontal overflow. Writes audit/zoom/*.png.
// Usage: node tools/zoom.mjs [baseUrl]
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:3009';
const ROUTES = { home: '/home', pay: '/actions?sheet=pay', actions: '/actions' };
fs.mkdirSync('audit/zoom', { recursive: true });
const b = await chromium.launch();
let bad = 0;
for (const [k, r] of Object.entries(ROUTES)) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.addInitScript(() => { try { ['V9Home', 'V9Actions'].forEach((n) => sessionStorage.setItem('cc9-in-' + n, '1')); } catch {} });
  await p.goto(base + r, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: 'html{font-size:200%!important}' });
  await p.waitForTimeout(1200);
  const res = await p.evaluate(() => {
    const out = [];
    const sc = document.getElementById('scroller');
    for (const el of document.querySelectorAll('p,span,b,h1,h2,h3,a,button,label')) {
      if (el.closest('.cc,[aria-hidden="true"],.roll,svg,.sr')) continue;
      if (!el.textContent.trim() || el.children.length > 3) continue;
      const cs = getComputedStyle(el);
      if (cs.overflow === 'visible' && cs.textOverflow !== 'ellipsis') continue;
      if (el.scrollHeight > el.clientHeight + 2 || (cs.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 2)) out.push(`${el.tagName}.${el.className} "${el.textContent.trim().slice(0, 40)}"`);
    }
    return { clipped: out, hOverflow: sc.scrollWidth > sc.clientWidth + 1 };
  });
  await p.screenshot({ path: `audit/zoom/${k}.png`, fullPage: false });
  console.log(k, res.hOverflow ? 'H-OVERFLOW' : 'no h-overflow', res.clipped.length ? '\n  CLIPPED: ' + res.clipped.join('\n  ') : 'nothing clipped');
  bad += res.clipped.length + (res.hOverflow ? 1 : 0);
  await p.close();
}
await b.close();
process.exitCode = bad ? 1 : 0;
