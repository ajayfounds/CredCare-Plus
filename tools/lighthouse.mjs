// Lighthouse on a route, mobile emulation (Lighthouse defaults), against the running production build.
// Usage: node tools/lighthouse.mjs [url]
import fs from 'node:fs';
import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';

const url = process.argv[2] || 'http://localhost:3010/home';
const PORT = 9229;
const browser = await chromium.launch({ args: [`--remote-debugging-port=${PORT}`], headless: true });
const r = await lighthouse(url, { port: PORT, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices'] });
await browser.close();
fs.mkdirSync('audit', { recursive: true });
fs.writeFileSync('audit/lighthouse-home.json', r.report);
const lhr = r.lhr;
for (const [k, c] of Object.entries(lhr.categories)) console.log(k, Math.round(c.score * 100));
for (const a of ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index']) console.log(' ', a, lhr.audits[a].displayValue);
const fails = lhr.categories.accessibility.auditRefs.map((x) => lhr.audits[x.id]).filter((a) => a.score !== null && a.score < 1);
if (fails.length) console.log('accessibility issues:', fails.map((a) => a.id).join(', '));
