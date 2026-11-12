// Raw colour literals found in the reference frames, mapped to tokens (styles/tokens.css).
const HEX = {
  '#E9EBF1': '--n100', '#DCDFE8': '--n200', '#1A33B8': '--b700', '#D33A2C': '--er600', '#B45309': '--wn600',
  '#B4231A': '--er700', '#8A4B00': '--wn700', '#4E5260': '--n700', '#138A4D': '--ok600', '#0F7A43': '--ok700',
  '#000': '--mask',
};
const RGBA = {
  'rgba(11,11,15,.4)': '--sh-40', 'rgba(11,11,15,.18)': '--sh-18', 'rgba(11,11,15,.08)': '--sh-08',
  'rgba(42,68,216,.55)': '--sh-ac', 'rgba(22,24,29,.32)': '--scrim', 'rgba(180,83,9,.25)': '--wn-rule',
  'rgba(22,24,29,.25)': '--n900-25', 'rgba(22,24,29,.12)': '--n900-12', 'rgba(22,24,29,.42)': '--n900-42',
  'rgba(255,255,255,.88)': '--on-ink-2', 'rgba(255,255,255,.12)': '--on-ink-rule', 'rgba(26,51,184,.12)': '--b700-12',
  'rgba(15,31,112,.3)': '--b900-30', 'rgba(15,31,112,.25)': '--b900-25',
};
const INK_PROPS = /^(color|fill|stroke|stop-color|caret-color|-webkit-text-fill-color)$/;

/** Replace raw colours in one declaration value. `prop` decides whether white is ink text or a surface. */
export function tokenizeValue(prop, value) {
  let v = value.replace(/rgba\(\s*([^)]*)\)/g, (m, inner) => {
    const key = 'rgba(' + inner.replace(/\s+/g, '').replace(/0\./g, '.') + ')';
    return RGBA[key] ? `var(${RGBA[key]})` : m;
  });
  v = v.replace(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g, (m) => {
    const u = m.toUpperCase();
    if (u === '#FFF' || u === '#FFFFFF') return INK_PROPS.test(prop) ? 'var(--on-ink-1)' : 'var(--n0)';
    const t = HEX[u] || HEX[m];
    return t ? `var(${t})` : m;
  });
  return v;
}

/** Inline style attribute string: tokenize each declaration. */
export function tokenizeStyle(style) {
  return style.split(/;(?![^(]*\))/).map((d) => {
    const i = d.indexOf(':');
    if (i < 0) return d;
    return d.slice(0, i) + ':' + tokenizeValue(d.slice(0, i).trim(), d.slice(i + 1));
  }).join(';');
}
