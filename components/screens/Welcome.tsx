'use client';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import './welcome.css';
import { Screen } from '@/components/Screen';
import { WriteIn } from '@/components/home/ScoreRoll';
import { Stamp } from '@/components/ui/Stamp';
import { TODAY, causes, completed, score } from '@/lib/data';
import { dayMonth, inr, monthLong, signed, spokenSigned } from '@/lib/format';
import { card } from '@/lib/model';

const missed = causes.find((c) => !c.utilisation)!;
const util = causes.find((c) => c.utilisation)!;
const lender = missed.meta.split(' · ')[0];
const missedOn = missed.meta.split(' · ')[1];
const paidOn = completed[0].when.replace('Done ', '');
const h = score.history;
const months = h.slice(-3);

// A small trend: the last five months ending on the current one, 262×72.
const W = 262, X0 = 4, X1 = 254, Y_TOP = 33.4, Y_BOT = 57.2;
const pts = h.slice(1).map((p, i, a) => [X0 + ((X1 - X0) * i) / (a.length - 1), p.value] as const);
const vals = h.map((p) => p.value);
const hi = Math.max(...vals), lo = Math.min(...vals);
const xy = pts.map(([x, v]) => [x, Y_TOP + ((hi - v) / (hi - lo)) * (Y_BOT - Y_TOP)] as const);
const d = (a: readonly (readonly [number, number])[]) => a.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
const len = (a: readonly (readonly [number, number])[]) => Math.round(a.slice(1).reduce((s, [x, y], i) => s + Math.hypot(x - a[i][0], y - a[i][1]), 0));
const dec = xy[xy.length - 3], jan = xy[xy.length - 2], feb = xy[xy.length - 1];
const trendLabel = `Score fell from ${h[0].value} in ${monthLong(h[0].month)} to ${score.current} in ${monthLong(h[h.length - 1].month)}: ${spokenSigned(missed.points)} after a missed EMI in ${monthLong(h[3].month)}, ${spokenSigned(util.points)} from high utilisation across ${monthLong(h[4].month)} and ${monthLong(h[5].month)}`;

export function Welcome() {
  return (
    <Screen name="V9Welcome" scope="welcome" className="zfcaa6d">
      <div className="dots" role="img" aria-label="Step 1 of 3"><i className="on" /><i /><i /></div>
      <div
        className="z862645 card hero in pb cascade"
        role="img"
        aria-label={`Example record: missed ${lender} EMI on ${missedOn.replace('Dec', 'December')} cost ${Math.abs(missed.points)} points, the overdue was paid on ${paidOn.replace('Jan', 'January')}, HDFC card minimum of ${card.minimumDue.toLocaleString('en-IN')} rupees due ${dayMonth(TODAY).replace('Feb', 'February')}. Score now ${score.current}`}
      >
        <div className="wl-head"><p className="t-footnote c2">Your record</p><p className="t-caption c3">{months[0].month}–{months[2].month}</p></div>
        <div className="pbh"><span>Date</span><span>Entry</span><span>Amount</span></div>
        <div className="pbr"><span className="c3">{missedOn}</span><span>{lender} EMI missed</span><span className="wl-neg">{signed(missed.points)} pts</span></div>
        <div className="pbr"><span className="c3">{paidOn}</span><span>{lender} overdue</span><span><Stamp word="PAID" land className="zffd616" /></span></div>
        <div className="pbr"><span className="c3">{dayMonth(TODAY)}</span><span>{card.bank.split(' ')[0]} card minimum</span><span>{inr(card.minimumDue)}</span></div>
        <div className="pbr tot"><span className="c3">Score</span><span className="c2">Running total</span><span className="fig-m"><span className="z55a47e"><WriteIn text={String(score.current)} /></span></span></div>
        <div className="wl-trend">
          <svg className="sl" width={W} height="72" viewBox={`0 0 ${W} 72`} role="img" aria-label={trendLabel}>
            <path className="ln" style={{ '--len0': len(xy.slice(0, -1)) } as CSSProperties} d={d(xy.slice(0, -1))} />
            <path className="hi" style={{ '--len': len(xy.slice(-2)) } as CSSProperties} d={d(xy.slice(-2))} />
            <circle className="ev pin" style={{ '--k': 0 } as CSSProperties} cx={dec[0].toFixed(1)} cy={dec[1].toFixed(1)} r="3.5" />
            <text className="evl" x={(dec[0] + 8).toFixed(1)} y={(dec[1] - 8).toFixed(1)} textAnchor="start">{signed(missed.points)} {missed.title}</text>
            <circle className="ev pin" style={{ '--k': 1 } as CSSProperties} cx={jan[0].toFixed(1)} cy={jan[1].toFixed(1)} r="3.5" />
            <text className="evl" x={(jan[0] - 2).toFixed(1)} y={(jan[1] + 18).toFixed(1)} textAnchor="end">{signed(util.points)} Utilisation</text>
            <circle className="end" cx={feb[0].toFixed(1)} cy={feb[1].toFixed(1)} r="4" />
          </svg>
        </div>
      </div>
      <h1 className="z599519 t-title1 in">A plan to fix your credit score, one payment at a time</h1>
      <p className="z056d8e t-body c2 in">See what pulled your score down, then fix it in the right order</p>
      <div className="zb0207b in">
        <Link className="btn bp" href="/safe-space">
          Get started
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </Link>
        <Link className="z970539 btn bg" href="/sign-in">I already have an account</Link>
      </div>
    </Screen>
  );
}
