// Porting aid: turns a reference frame's markup into JSX so layout and class names carry over exactly.
// Usage: node tools/port-frame.mjs <frame.dc.html> <out-dir>
import fs from 'node:fs';
import path from 'node:path';
import { parseFragment } from 'parse5';
import { linkFor } from './routes.mjs';
import { tokenizeStyle, tokenizeValue } from './colors.mjs';

const [file, out] = process.argv.slice(2);
const src = fs.readFileSync(file, 'utf8');
const name = path.basename(file, '.dc.html');
const body = src.slice(src.indexOf('</helmet>') + 9, src.indexOf('</x-dc>'));
const script = src.slice(src.indexOf('<script type="text/x-dc"'), src.lastIndexOf('</script>'));

const SVG_KEEP = new Set(['viewBox', 'preserveAspectRatio', 'gradientUnits', 'gradientTransform', 'patternUnits', 'stdDeviation', 'xmlns']);
const RENAME = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength',
  inputmode: 'inputMode', autocomplete: 'autoComplete', autocapitalize: 'autoCapitalize', spellcheck: 'spellCheck',
  enterkeyhint: 'enterKeyHint', autofocus: 'autoFocus', novalidate: 'noValidate', 'xlink:href': 'xlinkHref',
  colspan: 'colSpan', rowspan: 'rowSpan', defaultchecked: 'defaultChecked', srcset: 'srcSet', crossorigin: 'crossOrigin',
};
const BOOL = new Set(['hidden', 'disabled', 'required', 'multiple', 'open', 'inert']);
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const scopes = [];
const ref = (p) => {
  p = p.trim();
  if (p === 'true' || p === 'false' || /^-?\d/.test(p)) return p;
  return scopes.includes(p.split('.')[0]) ? p : 'v.' + p;
};
const isB = (x) => /^\{\{/.test(x);
const hasB = (s) => /\{\{/.test(s);
const interp = (s) => {
  const parts = s.split(/(\{\{[^}]*\}\})/).filter((x) => x !== '');
  if (parts.length === 1 && isB(parts[0])) return '{' + ref(parts[0].slice(2, -2)) + '}';
  const body = parts.map((x) => (isB(x) ? '${' + ref(x.slice(2, -2)) + '}' : x.replace(/`/g, '\\`'))).join('');
  return '{`' + body + '`}';
};
const styleObj = (s) => {
  const decl = s.split(/;(?![^(]*\))/).map((d) => d.trim()).filter(Boolean);
  const kv = decl.map((d) => {
    const i = d.indexOf(':');
    const k = d.slice(0, i).trim();
    const val = d.slice(i + 1).trim();
    const key = k.startsWith('--') ? JSON.stringify(k) : camel(k);
    return key + ': ' + (hasB(val) ? interp(val).slice(1, -1) : JSON.stringify(val));
  });
  return '{{ ' + kv.join(', ') + ' } as CSSProperties}';
};
const esc = (t) => t.replace(/[{}<>]/g, (c) => '{' + JSON.stringify(c) + '}');
const inSvg = (n) => { for (let p = n; p; p = p.parentNode) if (p.nodeName === 'svg') return true; return false; };

function attrs(n) {
  const a = Object.fromEntries((n.attrs || []).map((x) => [x.prefix ? x.prefix + ':' + x.name : x.name, x.value]));
  const tag = n.nodeName;
  const svg = inSvg(n);
  const res = [];
  const isField = tag === 'input' || tag === 'textarea' || tag === 'select';
  const ctl = a.oninput || a.onchange;
  for (let [k, val] of Object.entries(a)) {
    if (k.startsWith('hint-placeholder')) continue;
    if (k === 'style') { res.push('style=' + styleObj(tokenizeStyle(val))); continue; }
    if (k !== 'href' && k !== 'd') val = tokenizeValue(k, val);
    if (k.startsWith('on')) {
      const ev = 'on' + k[2].toUpperCase() + k.slice(3).replace(/^([a-z]+)$/, (m) => m);
      res.push((isField && /^oninput$/i.test(k) ? 'onChange' : fixEv(k)) + '={' + ref(val.replace(/[{}]/g, '')) + '}');
      void ev; continue;
    }
    if (isField && k === 'value') { res.push((hasB(val) && ctl ? 'value' : 'defaultValue') + '=' + (hasB(val) ? interp(val) : JSON.stringify(val))); continue; }
    if (isField && k === 'checked') { res.push((hasB(val) && a.onchange ? 'checked' : 'defaultChecked') + '=' + (hasB(val) ? interp(val) : '{true}')); continue; }
    if (k === 'href' && tag === 'a') {
      const m = val.match(/^(V9[A-Za-z]+)\.dc\.html$/);
      if (m) { res.push('href=' + JSON.stringify(linkFor(m[1]) || '/')); continue; }
    }
    let nk = RENAME[k] || k;
    if (svg && !k.startsWith('aria-') && !k.startsWith('data-') && !SVG_KEEP.has(k) && k.includes('-')) nk = camel(k);
    if (BOOL.has(k) && val === '') { res.push(nk); continue; }
    res.push(nk + '=' + (hasB(val) ? interp(val) : JSON.stringify(val)));
  }
  return res;
}
const EVENTS = ['click', 'input', 'change', 'keydown', 'pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerleave', 'focus', 'blur', 'submit', 'scroll'];
const EVN = { click: 'Click', input: 'Input', change: 'Change', keydown: 'KeyDown', pointerdown: 'PointerDown', pointermove: 'PointerMove', pointerup: 'PointerUp', pointercancel: 'PointerCancel', pointerleave: 'PointerLeave', focus: 'Focus', blur: 'Blur', submit: 'Submit', scroll: 'Scroll' };
function fixEv(k) { const e = k.slice(2).toLowerCase(); return EVENTS.includes(e) ? 'on' + EVN[e] : k; }

// Whitespace beside a block box never renders, so it is not carried into JSX.
const BLOCK = new Set(['div', 'section', 'header', 'footer', 'main', 'nav', 'p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'form', 'fieldset', 'aside', 'article', 'dl', 'dt', 'dd', 'hr', 'sc-if', 'sc-for', 'details', 'summary', 'table']);
const prevOf = (s) => { const c = s.parentNode.childNodes; return c[c.indexOf(s) - 1]; };
const nextOf = (s) => { const c = s.parentNode.childNodes; return c[c.indexOf(s) + 1]; };
let linkUsed = false;
function node(n, ind) {
  const pad = '  '.repeat(ind);
  if (n.nodeName === '#comment') return '';
  if (n.nodeName === '#text') {
    const t = n.value.replace(/\s+/g, ' ');
    if (t === ' ') {
      const p = n.parentNode && n.parentNode.nodeName;
      const sib = (d) => { let s = n; do { s = d < 0 ? prevOf(s) : nextOf(s); } while (s && s.nodeName === '#comment'); return s; };
      const blockish = (s) => !s || BLOCK.has(s.nodeName);
      if (inSvg(n) || ['tr', 'tbody', 'table', 'thead', 'select', 'ul', 'ol'].includes(p)) return '';
      if (blockish(sib(-1)) || blockish(sib(1))) return '';
      return pad + '{" "}\n';
    }
    if (!t.trim()) return '';
    const parts = t.split(/(\{\{[^}]*\}\})/).filter((x) => x !== '');
    return parts.map((x) => {
      if (isB(x)) return pad + '{' + ref(x.slice(2, -2)) + '}\n';
      if (/^\s|\s$/.test(x)) return pad + '{' + JSON.stringify(x) + '}\n';
      return pad + esc(x) + '\n';
    }).join('');
  }
  const tag = n.nodeName;
  const a = Object.fromEntries((n.attrs || []).map((x) => [x.name, x.value]));
  if (tag === 'sc-if') {
    return `${pad}{${ref(a.value.replace(/[{}]/g, ''))} ? (\n${pad}  <>\n${kids(n, ind + 2)}${pad}  </>\n${pad}) : null}\n`;
  }
  if (tag === 'sc-for') {
    scopes.push(a.as);
    const c = kids(n, ind + 2);
    scopes.pop();
    return `${pad}{(${ref(a.list.replace(/[{}]/g, ''))} || []).map((${a.as}: Row, ${a.as}i: number) => (\n${pad}  <Fragment key={${a.as}i}>\n${c}${pad}  </Fragment>\n${pad}))}\n`;
  }
  let jt = tag;
  const at = attrs(n);
  if (tag === 'a' && at.some((x) => x.startsWith('href="/'))) { jt = 'Link'; linkUsed = true; }
  const open = `${pad}<${jt}${at.length ? ' ' + at.join(' ') : ''}`;
  const c = kids(tag === 'template' ? n.content : n, ind + 1);
  if (!c.trim()) return open + ' />\n';
  return `${open}>\n${c}${pad}</${jt}>\n`;
}
const kids = (n, ind) => (n.childNodes || []).map((c) => node(c, ind)).join('');
const jsx = kids(parseFragment(body), 2);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, name + '.jsx.txt'), jsx);
fs.writeFileSync(path.join(out, name + '.logic.txt'), script);
console.log(name, jsx.length, linkUsed ? 'Link' : '');
