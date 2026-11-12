// Porting aid: writes components/screens/<Component>.tsx from a converted frame (tools/port-frame.mjs output).
// The result is the frame's markup inside <Screen>; logic and data bindings are then ported by hand.
// Usage: node tools/emit-screen.mjs <jsx.txt> <Component> <scope> <V9Name> [tab]
import fs from 'node:fs';

const [src, comp, scope, name, tab] = process.argv.slice(2);
let t = fs.readFileSync(src, 'utf8');
t = t.replace(/<svg className="fkt"[\s\S]*?<\/svg>\n/g, (m) => `<CardFacets field="${{ 583: 'mini', 338: 'front', 285: 'back' }[(m.match(/M0 0L(\d+)/) || [])[1]]}" />\n`);
t = t.replace(/<svg className="chipg"[^>]*width="(\d+)" height="(\d+)"[\s\S]*?<\/svg>\n/g, '<EmvChip width={$1} height={$2} />\n');
t = t.replace(/ *<nav className="tb"[\s\S]*?<\/nav>\n/, '');
const m = t.match(/<main className="([^"]*?)\s*r" data-first=\{v\.__first\} data-dx=\{v\.__dx\} data-ent="(\w+)">/);
const root = m ? m[1].trim() : '';
const ent = m ? m[2] : 'on';
t = t.replace(/<main [^>]*>/, `<Screen name="${name}" scope="${scope}"${tab ? ` tab={${tab}}` : ''}${ent === 'none' ? ' ent="none"' : ''}${root ? ` className="${root}"` : ''}>`);
t = t.replace(/<\/main>/, '</Screen>');
t = t.replace(/^\s*\{" "\}\n/, '');
const uses = (s) => t.includes(s);
const imports = [
  "'use client';",
  uses('Fragment') || uses('CSSProperties') ? `import { ${[uses('Fragment') && 'Fragment', uses('CSSProperties') && 'type CSSProperties'].filter(Boolean).join(', ')} } from 'react';` : '',
  uses('<Link') ? "import Link from 'next/link';" : '',
  `import './${scope}.css';`,
  "import { Screen } from '@/components/Screen';",
  uses('<CardFacets') ? "import { CardFacets } from '@/components/card/CardFacets';" : '',
  uses('<EmvChip') ? "import { EmvChip } from '@/components/card/EmvChip';" : '',
].filter(Boolean).join('\n');
const out = `${imports}\n\nexport function ${comp}() {\n  return (\n${t.replace(/^/gm, '  ').replace(/^\s+$/gm, '')}  );\n}\n`;
fs.writeFileSync(`components/screens/${comp}.tsx`, out);
console.log(comp, out.length, uses('v.') ? 'HAS BINDINGS' : 'static');
