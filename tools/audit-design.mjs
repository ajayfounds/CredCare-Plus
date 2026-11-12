// Design audit (npm run audit:design). Static checks over components/ and app/, then a browser pass over every
// route at 390 px. Writes audit/design-report.json and exits non-zero on any failure.
// Usage: node tools/audit-design.mjs [baseUrl]   (needs the app running; default http://localhost:3010)
import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import { chromium } from '@playwright/test';
import { ROUTES } from './routes.mjs';

const base = process.argv[2] || 'http://localhost:3010';
const report = { raw: [], spacing: [], routes: {} };
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = [...walk('components'), ...walk('app')].filter((f) => /\.(tsx?|css)$/.test(f));

// 1. No hard-coded hex or rgba in components/ and app/. Data-module ids and SVG path data are not colours.
const COLOR = /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b(?![\w-])|rgba?\(/g;
for (const f of files) {
  if (f.endsWith('facets.ts')) continue;
  fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const code = line.replace(/\bd="[^"]*"|d=\{[^}]*\}|href="#[a-z]+"/g, '');
    const m = code.match(COLOR);
    if (m) report.raw.push(`${f}:${i + 1} ${m.join(' ')}`);
  });
}

// 2. Spacing (margin, padding, gap, inset offsets used as spacing) on the token scale. Hairlines (1–2 px) allowed.
const SCALE = new Set([0, 1, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48]);
const SPACE = /^(margin|padding|gap|row-gap|column-gap)(-|$)|^margin|^padding/;
const offScale = (v) => (v.match(/-?\d*\.?\d+px/g) || []).map((x) => Math.abs(parseFloat(x))).filter((n) => !SCALE.has(n));
for (const f of files.filter((x) => x.endsWith('.css'))) {
  postcss.parse(fs.readFileSync(f, 'utf8')).walkDecls((d) => {
    if (!SPACE.test(d.prop)) return;
    const bad = offScale(d.value);
    if (bad.length) report.spacing.push(`${f} ${d.parent.selector} { ${d.prop}: ${d.value} }`);
  });
}
for (const f of files.filter((x) => x.endsWith('.tsx'))) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/(margin\w*|padding\w*|gap)\s*:\s*['"]([^'"]+)['"]/g)) {
    if (offScale(m[2]).length) report.spacing.push(`${f} inline ${m[1]}: ${m[2]}`);
  }
}

// 3–6. Browser checks per route.
const lum = (c) => {
  const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const browser = await chromium.launch();
const seen = new Set();
for (const [frame, route] of Object.entries(ROUTES)) {
  if (seen.has(route)) continue;
  seen.add(route);
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript((ns) => { try { ns.forEach((n) => sessionStorage.setItem('cc9-in-' + n, '1')); } catch {} }, Object.keys(ROUTES));
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => {
    const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[\s,/]+/).map(Number); return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 }; };
    const blend = (top, bot) => top.rgb.map((v, i) => v * top.a + bot[i] * (1 - top.a));
    const bgOf = (el) => {
      const stack = [];
      for (let e = el; e; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.backgroundImage !== 'none' && !/linear-gradient\(180deg, transparent/.test(cs.backgroundImage)) return { unknown: true };
        const c = parse(cs.backgroundColor);
        if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; }
      }
      let rgb = [255, 255, 255];
      for (const c of stack.reverse()) rgb = blend(c, rgb);
      return { rgb };
    };
    const vis = (el) => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden' && cs.opacity !== '0' && !el.closest('[aria-hidden="true"],.sr,[inert]'); };
    const sizes = new Set();
    const pairs = [];
    const tw = document.createTreeWalker(document.querySelector('#phone'), NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      if (!n.textContent.trim()) continue;
      const el = n.parentElement;
      if (!el || !vis(el) || el.closest('svg,.cc')) continue;
      const cs = getComputedStyle(el);
      sizes.add(cs.fontSize);
      const fg = parse(cs.color);
      const bg = bgOf(el);
      if (!fg || bg.unknown) continue;
      pairs.push({ text: n.textContent.trim().slice(0, 30), fg: blend(fg, bg.rgb), bg: bg.rgb, size: parseFloat(cs.fontSize), weight: +cs.fontWeight });
    }
    const small = [];
    for (const el of document.querySelectorAll('#phone a[href], #phone button, #phone [role="slider"], #phone [role="tab"], #phone input:not([type="checkbox"]):not([type="range"])')) {
      if (!vis(el)) continue;
      // Inputs inside a field: the whole label row is the target (spec/accessibility.md, Targets).
      const b = (el.tagName === 'INPUT' && el.closest('label')) ? el.closest('label').getBoundingClientRect() : el.getBoundingClientRect();
      const inline = getComputedStyle(el).display === 'inline' && el.closest('p');
      if ((b.width < 44 || b.height < 44) && !inline) small.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent).trim().slice(0, 30)}" ${Math.round(b.width)}×${Math.round(b.height)}`);
    }
    const sc = document.getElementById('scroller');
    return { sizes: [...sizes], pairs, small, overflow: sc.scrollWidth > sc.clientWidth + 1 };
  });
  const lowText = r.pairs.filter((p) => {
    const L1 = lum(p.fg), L2 = lum(p.bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const large = p.size >= 24 || (p.size >= 18.66 && p.weight >= 600);
    p.ratio = +ratio.toFixed(2);
    return ratio < (large ? 3 : 4.5);
  }).map((p) => `"${p.text}" ${p.ratio}:1`);
  report.routes[route] = { typeSizes: r.sizes.length, sizes: r.sizes, lowContrast: [...new Set(lowText)], smallTargets: [...new Set(r.small)], overflow: r.overflow };
  await page.close();
}
await browser.close();

// Graphics ≥ 3:1: the non-text pairs the design relies on, from the tokens.
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const ratio = (a, b) => { const L1 = lum(hex(a)), L2 = lum(hex(b)); return +((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2); };
report.graphics = {
  'n500 ring/radio on n0': ratio('#868B99', '#FFFFFF'),
  'b600 focus ring on n0': ratio('#2140E0', '#FFFFFF'),
  'b600 focus ring on n25': ratio('#2140E0', '#F8F9FC'),
  'ok600 week mark on n0': ratio('#138A4D', '#FFFFFF'),
  'er600 missed mark on n0': ratio('#D33A2C', '#FFFFFF'),
  'wn600 due mark on wn50': ratio('#B45309', '#FFF3DC'),
  'chip-2 plate on card-2': ratio('#A8B1C4', '#141E57'),
  'b700 tab indicator on n0': ratio('#1A33B8', '#FFFFFF'),
  'n0 band marker on b700': ratio('#FFFFFF', '#1A33B8'),
};

const routes = Object.values(report.routes);
const summary = {
  rawColours: report.raw.length,
  offScaleSpacing: report.spacing.length,
  maxTypeSizes: Math.max(...routes.map((r) => r.typeSizes)),
  routesOver6Sizes: Object.entries(report.routes).filter(([, r]) => r.typeSizes > 6).map(([k, r]) => `${k} (${r.typeSizes})`),
  lowContrastText: routes.reduce((n, r) => n + r.lowContrast.length, 0),
  graphicsUnder3: Object.entries(report.graphics).filter(([, v]) => v < 3).map(([k, v]) => `${k} ${v}`),
  smallTargets: routes.reduce((n, r) => n + r.smallTargets.length, 0),
  overflowRoutes: Object.entries(report.routes).filter(([, r]) => r.overflow).map(([k]) => k),
};
report.summary = summary;
fs.mkdirSync('audit', { recursive: true });
fs.writeFileSync('audit/design-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(summary, null, 2));
const fail = summary.rawColours || summary.offScaleSpacing || summary.routesOver6Sizes.length || summary.lowContrastText || summary.graphicsUnder3.length || summary.smallTargets || summary.overflowRoutes.length;
process.exitCode = fail ? 1 : 0;
