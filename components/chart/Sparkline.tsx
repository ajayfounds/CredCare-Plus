import type { CSSProperties } from 'react';
import { score } from '@/lib/data';
import { monthLong } from '@/lib/format';

const W = 350, H = 56, X0 = 6, X1 = 344, Y_TOP = 10.4, Y_BOT = 41.2;

/** Six-month trend on the ink band. Not interactive: the full chart lives in Analysis. */
export function Sparkline() {
  const h = score.history;
  const vals = h.map((p) => p.value);
  const hi = Math.max(...vals), lo = Math.min(...vals);
  const pts = h.map((p, i) => [X0 + ((X1 - X0) * i) / (h.length - 1), Y_TOP + ((hi - p.value) / (hi - lo)) * (Y_BOT - Y_TOP)] as const);
  const path = (a: readonly (readonly [number, number])[]) => a.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const len = (a: readonly (readonly [number, number])[]) => a.slice(1).reduce((s, [x, y], i) => s + Math.hypot(x - a[i][0], y - a[i][1]), 0);
  const past = pts.slice(0, -1), now = pts.slice(-2);
  const drops = h.map((p, i) => ({ p, i })).filter(({ p }) => p.note !== 'No change' && p.month !== h[h.length - 1].month);
  const first = h[0], last = h[h.length - 1];
  const label = `Six-month trend: ${first.value} in ${monthLong(first.month)} to ${last.value} in ${monthLong(last.month)}, with drops in ${drops.map(({ p }) => monthLong(p.month)).join(' and ')}`;
  return (
    <svg className="spk" width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <path style={{ '--len': Math.round(len(past)) } as CSSProperties} d={path(past)} />
      <path className="now" style={{ '--len': Math.round(len(now)) } as CSSProperties} d={path(now)} />
      {drops.map(({ i }) => <circle key={i} className="e" cx={pts[i][0].toFixed(1)} cy={pts[i][1].toFixed(1)} r="3.5" />)}
      <circle className="n" cx={pts[pts.length - 1][0].toFixed(1)} cy={pts[pts.length - 1][1].toFixed(1)} r="4" />
    </svg>
  );
}
