// Porting aid: merges the frame-local CSS of every state frame of one screen, swaps raw colours for tokens,
// scopes every selector to the screen's root class and drops the fixed 390 px canvas size.
// Usage: node tools/scope-css.mjs <key> <out.css> <frame.dc.html>...
import fs from 'node:fs';
import postcss from 'postcss';
import { tokenizeValue } from './colors.mjs';

const [key, out, ...files] = process.argv.slice(2);
const MARK = '@media (prefers-reduced-transparency:reduce){.cc::after{background:none}}';
const scope = '.s-' + key;
const seen = new Map();
const root = postcss.root();
const frames = [];

for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  const css = t.slice(t.indexOf('<style>') + 7, t.indexOf('</style>'));
  frames.push(css.slice(css.lastIndexOf(MARK) + MARK.length));
}

// The frame's root classes sit on .r itself, so they scope as .s-key.zX rather than as descendants.
const rootCls = new Set();
for (const f of files) { const m = fs.readFileSync(f, 'utf8').match(/<main class="([^"]*)"/); if (m) m[1].split(/\s+/).filter((c) => /^z[0-9a-f]{6}$/.test(c)).forEach((c) => rootCls.add(c)); }
const keyframes = new Set();
for (const css of frames) postcss.parse(css).walkAtRules('keyframes', (r) => keyframes.add(r.params));
const renameAnim = (v) => v.replace(/[A-Za-z][\w-]*/g, (w) => (keyframes.has(w) ? `${w}--${key}` : w));

const scopeSel = (sel) => sel.split(',').map((s) => {
  s = s.trim();
  if (/^\.r(?![\w-])/.test(s)) return s.replace(/^\.r(?![\w-])/, '.r' + scope);
  if (/^(html|body|:root)\b/.test(s)) return s;
  const m = s.match(/^\.(z[0-9a-f]{6})(?![\w-])/);
  if (m && rootCls.has(m[1])) return scope + s;
  return `${scope} ${s}`;
}).join(',');

for (const css of frames) {
  const parsed = postcss.parse(css);
  parsed.walkDecls((d) => {
    d.value = tokenizeValue(d.prop, d.value);
    if (/^(animation|animation-name)$/.test(d.prop)) d.value = renameAnim(d.value);
  });
  parsed.walkRules((r) => {
    if (r.parent && r.parent.type === 'atrule' && /keyframes/.test(r.parent.name)) return;
    const canvas = r.nodes.some((d) => d.prop === 'width' && /^390px/.test(d.value));
    if (canvas) r.walkDecls((d) => { if (d.prop === 'width' || d.prop === 'height') d.remove(); });
    r.selector = scopeSel(r.selector);
  });
  parsed.walkAtRules('keyframes', (a) => { a.params = `${a.params}--${key}`; });
  for (const n of parsed.nodes) {
    const sig = n.toString().replace(/\s+/g, ' ');
    if (seen.has(sig)) continue;
    seen.set(sig, true);
    root.append(n.clone());
  }
}
const head = `/* ${key}: frame-local CSS ported from ${files.map((f) => f.split(/[\\/]/).pop()).join(', ')} */\n`;
fs.writeFileSync(out, head + root.toString().replace(/\n{3,}/g, '\n\n').trim() + '\n');
const left = (root.toString().match(/#[0-9a-fA-F]{3,8}\b|rgba?\(/g) || []);
console.log(key, 'rules', root.nodes.length, left.length ? 'RAW LEFT: ' + left.join(' ') : '');
