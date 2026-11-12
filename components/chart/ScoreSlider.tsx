'use client';
import { useRef, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { causes, score } from '@/lib/data';
import { monthLong, signed, spokenSigned } from '@/lib/format';
import { haptic } from '@/lib/motion';

const W = 310, H = 190, X0 = 30, X1 = 302, BASE = 168, PER_POINT = 1.15, FLOOR = 600;
const h = score.history;
const step = (X1 - X0) / (h.length - 1);
const x = (i: number) => X0 + step * i;
const y = (v: number) => BASE - (v - FLOOR) * PER_POINT;
const pts = h.map((p, i) => [x(i), y(p.value)] as const);
const dpath = (a: readonly (readonly [number, number])[]) => a.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');
const plen = (a: readonly (readonly [number, number])[]) => a.slice(1).reduce((s, [px, py], i) => s + Math.hypot(px - a[i][0], py - a[i][1]), 0);
const lc1 = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const delta = (i: number) => (i === 0 ? 0 : h[i].value - h[i - 1].value);

/** "Dec 2025 · −37 missed EMI" */
export function monthNote(i: number) {
  const d = delta(i);
  const head = `${h[i].month} ${h[i].year}`;
  if (i === h.length - 1) return `${head} · ${signed(d)} vs ${h[i - 1].month}`;
  return d === 0 ? `${head} · no change` : `${head} · ${signed(d)} ${lc1(h[i].note)}`;
}

/** "January 2026, 640, minus 31, high utilisation" */
export function monthAria(i: number) {
  const d = delta(i);
  const what = i === h.length - 1 ? `${spokenSigned(d)} versus ${monthLong(h[i - 1].month)}` : d === 0 ? 'no change' : `${spokenSigned(d)}, ${lc1(h[i].note)}`;
  return `${monthLong(h[i].month)} ${h[i].year}, ${h[i].value}, ${what}`;
}

/**
 * The six-month chart as one slider: drag, tap or arrow keys move the month; Home and End jump.
 * A selection haptic ticks per month.
 */
export function ScoreSlider({ sel, onChange }: { sel: number; onChange: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const last = h.length - 1;
  const set = (k: number) => {
    const n = Math.max(0, Math.min(last, k));
    if (n !== sel) { haptic('selection'); onChange(n); }
  };
  const scrub = (e: PointerEvent<HTMLDivElement>) => {
    if (e.type === 'pointermove' && e.pointerType !== 'mouse' && e.buttons === 0) return;
    if (e.type === 'pointerdown') e.currentTarget.setPointerCapture?.(e.pointerId);
    const r = e.currentTarget.getBoundingClientRect();
    const scale = r.width / W;
    set(Math.round((e.clientX - r.left - X0 * scale) / (step * scale)));
  };
  const key = (e: KeyboardEvent) => {
    let k = sel;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') k--;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') k++;
    else if (e.key === 'Home') k = 0;
    else if (e.key === 'End') k = last;
    else return;
    e.preventDefault();
    set(k);
  };
  const ticks = [600, 650, 700];
  const drops = h.map((p, i) => ({ i, d: delta(i) })).filter(({ i, d }) => d < 0 && i < last);
  const util = causes.find((c) => c.utilisation)!;
  const missed = causes.find((c) => !c.utilisation)!;
  const label = `Score fell from ${h[0].value} in ${monthLong(h[0].month)} to ${h[last].value} in ${monthLong(h[last].month)}: ${spokenSigned(missed.points)} after a missed EMI in ${monthLong(h[drops[0].i].month)}, ${spokenSigned(util.points)} from high utilisation across ${monthLong(h[last - 1].month)} and ${monthLong(h[last].month)}`;
  return (
    <div
      ref={ref}
      className="scr chart"
      role="slider"
      tabIndex={0}
      aria-label="Month"
      aria-valuemin={0}
      aria-valuemax={last}
      aria-valuenow={sel}
      aria-valuetext={monthAria(sel)}
      onKeyDown={key}
      onPointerDown={scrub}
      onPointerMove={scrub}
    >
      <svg className="sl" width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        {ticks.map((t) => (
          <g key={t}>
            <line className="gl" x1={X0} x2={X1} y1={y(t).toFixed(1)} y2={y(t).toFixed(1)} />
            <text x="0" y={(y(t) + 4).toFixed(1)}>{t}</text>
          </g>
        ))}
        <path className="ln" style={{ '--len0': Math.round(plen(pts.slice(0, -1))) } as CSSProperties} d={dpath(pts.slice(0, -1))} />
        <path className="hi" style={{ '--len': Math.round(plen(pts.slice(-2))) } as CSSProperties} d={dpath(pts.slice(-2))} />
        {pts.map(([px, py], i) => (
          <g key={i} className="cu" style={{ opacity: i === sel && sel !== last ? 1 : 0 }}>
            <line x1={px.toFixed(1)} x2={px.toFixed(1)} y1="8" y2={BASE} />
            <circle cx={px.toFixed(1)} cy={py.toFixed(1)} r="5" />
          </g>
        ))}
        <circle className="ev pin" style={{ '--k': 0 } as CSSProperties} cx={pts[drops[0].i][0].toFixed(1)} cy={pts[drops[0].i][1].toFixed(1)} r="3.5" />
        <text className="evl" x={(pts[drops[0].i][0] + 8).toFixed(1)} y={(pts[drops[0].i][1] - 8).toFixed(1)} textAnchor="start">{signed(missed.points)} {missed.title}</text>
        <circle className="ev pin" style={{ '--k': 1 } as CSSProperties} cx={pts[last - 1][0].toFixed(1)} cy={pts[last - 1][1].toFixed(1)} r="3.5" />
        <text className="evl" x={(pts[last - 1][0] - 2).toFixed(1)} y={(pts[last - 1][1] + 18).toFixed(1)} textAnchor="end">{signed(util.points)} Utilisation</text>
        <circle className="end" cx={pts[last][0].toFixed(1)} cy={pts[last][1].toFixed(1)} r="4" />
        {h.map((p, i) => <text key={i} x={x(i).toFixed(1)} y="186" textAnchor="middle" className={i === last ? 'on' : undefined}>{p.month}</text>)}
      </svg>
    </div>
  );
}
