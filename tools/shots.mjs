// Visual audit: renders every frame's route at 390 px and writes audit/screens/<Frame>.png,
// plus audit/compare/<Frame>.png with the reference on the left and the build on the right.
// Usage: node tools/shots.mjs [baseUrl] [FrameFilter]
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { ROUTES } from './routes.mjs';

const base = process.argv[2] || 'http://localhost:3009';
const only = process.argv[3];
const REF = path.resolve('../credcare-v9-handoff/reference/screens');
fs.mkdirSync('audit/screens', { recursive: true });
fs.mkdirSync('audit/compare', { recursive: true });

const pngSize = (f) => { const b = fs.readFileSync(f); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; };

const browser = await chromium.launch();
for (const [frame, route] of Object.entries(ROUTES)) {
  if (only && !frame.includes(only)) continue;
  const ref = path.join(REF, frame + '.png');
  const { h } = fs.existsSync(ref) ? pngSize(ref) : { h: 844 };
  const ctx = await browser.newContext({ viewport: { width: 390, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  // Entrances are once per session: mark them seen so the shot shows the settled screen.
  await ctx.addInitScript(() => { try { sessionStorage.setItem('cc9-audit', '1'); } catch {} });
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  const out = path.join('audit/screens', frame + '.png');
  await page.screenshot({ path: out });
  if (fs.existsSync(ref)) {
    const cmp = await ctx.newPage();
    await cmp.setViewportSize({ width: 800, height: h });
    const a = fs.readFileSync(ref).toString('base64');
    const b = fs.readFileSync(out).toString('base64');
    await cmp.setContent(`<body style="margin:0;display:flex;gap:20px;background:#888"><img src="data:image/png;base64,${a}"><img src="data:image/png;base64,${b}"></body>`);
    await cmp.screenshot({ path: path.join('audit/compare', frame + '.png'), fullPage: true });
  }
  await ctx.close();
  console.log(frame, route);
}
await browser.close();
