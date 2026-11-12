// Type in rem so it follows the reader's text size (200 % zoom). Converts px in font, font-size, line-height and
// the --f-* typography tokens. Card internals stay in px: the card is a fixed-proportion object.
// Usage: node tools/to-rem.mjs <file.css>...
import fs from 'node:fs';
import postcss from 'postcss';

const rem = (v) => v.replace(/(-?\d*\.?\d+)px/g, (_, n) => `${+(n / 16).toFixed(4)}rem`);
const CARD = /\.(cc|ccv|ccbrand|cckind|card-|minichip|chipg)\b|\bcc\b/;

for (const f of process.argv.slice(2)) {
  const root = postcss.parse(fs.readFileSync(f, 'utf8'));
  let n = 0;
  root.walkDecls((d) => {
    const typo = d.prop === 'font' || d.prop === 'font-size' || d.prop === 'line-height' || d.prop.startsWith('--f-');
    if (!typo || !/px/.test(d.value)) return;
    const sel = d.parent && d.parent.selector ? d.parent.selector : '';
    if (CARD.test(sel)) return;
    d.value = rem(d.value);
    n++;
  });
  fs.writeFileSync(f, root.toString());
  console.log(f, n);
}
