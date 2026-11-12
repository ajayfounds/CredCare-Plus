'use client';
import Link from 'next/link';
import './recovery.css';
import { Screen } from '@/components/Screen';
import { PhaseStack, type StackPage } from '@/components/plan/PhaseStack';
import { Ring } from '@/components/ui/Ring';
import { daysLeftInPlan, plan } from '@/lib/data';
import { phaseColor, stackRows } from '@/lib/plan';
import { useApp } from '@/lib/store';

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
);

/** 180-day ruler: three phase bands, the elapsed fill and a marker at today. */
function DayRuler() {
  const pct = (d: number) => `${((d / plan.totalDays) * 100).toFixed(1)}%`;
  const ends = plan.phases.map((p) => +p.window.split('–')[1].split(' ')[0]);
  const spans = ends.map((e, i) => e - (i ? ends[i - 1] : 0));
  return (
    <div className="z32c83a card in" role="img" aria-label={`Day ${plan.day} of ${plan.totalDays}. Phase 1 runs to day ${ends[0]}, phase 2 to day ${ends[1]}, phase 3 to day ${ends[2]}`}>
      <div className="rc-row"><p className="t-headline">Day {plan.day} of {plan.totalDays}</p><p className="t-footnote c2">{daysLeftInPlan} days to go</p></div>
      <div className="rc-bands">
        {spans.map((s, i) => <i key={i} className={`rc-band rc-band-${i + 1}`} style={{ flex: s }} />)}
        <b className="zeae596 rfill" style={{ width: pct(plan.day) }} />
        <b className="z8ff0db rmk" style={{ left: pct(plan.day) }} />
      </div>
      <div className="zcd70cc t-footnote c2">
        <span className="rc-tick" style={{ left: 0 }}>0</span>
        <span className="rc-tick rc-mid" style={{ left: pct(ends[0]) }}>{ends[0]}</span>
        <span className="rc-tick rc-mid" style={{ left: pct(ends[1]) }}>{ends[1]}</span>
        <span className="rc-tick" style={{ right: 0 }}>{ends[2]}</span>
      </div>
    </div>
  );
}

const Clock = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 7v5l3 2" /></svg>);
const Open = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /></svg>);
const Done = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></svg>);

export function Recovery() {
  const app = useApp();
  const pages: StackPage[] = plan.phases.map((p) => {
    const n = p.n as 1 | 2 | 3;
    const extra = n === 1 ? (app.isDone('pay') ? 1 : 0) + (app.isDone('autopay') ? 1 : 0) : 0;
    const done = p.done + extra;
    const strip = p.status === 'now' ? `Now · ${done} of ${p.total} done` : `Starts in ${p.startsInDays} days`;
    return {
      n, title: p.title, status: p.status, strip,
      body: (
        <>
          <div className="rc-head">
            <Ring size={64} stroke={5} value={done} total={p.total} color={phaseColor(n)} label={`${done} of ${p.total} done`}>
              <span className="mono-m">{done}/{p.total}</span>
            </Ring>
            <h3 className="t-title2">{p.title}</h3>
          </div>
          <div className="rc-rows">
            {stackRows(n).map((t) => {
              const ok = !!t.task && app.isDone(t.task);
              return (
                <div key={t.title} className="rc-line">
                  <span className={`mk rc-mk ${ok ? 'rc-ok' : t.urgent ? 'rc-wn' : ''}`}>{ok ? <Done /> : t.urgent ? <Clock /> : <Open />}</span>
                  <span className="z0098fd t-subhead-m">{t.title}</span>
                  <span className="t-footnote c2">{ok ? 'Done' : t.short}</span>
                </div>
              );
            })}
          </div>
          <p className="z002535 t-subhead c2">{p.outcome}</p>
          <Link className="za18ac8 lnk" href={`/recovery/phase/${n}`}>Open phase {n}<Arrow /></Link>
        </>
      ),
    };
  });

  return (
    <Screen name="V9Recovery" scope="recovery" tab={1} className="z0f7229">
      <h1 className="t-title1 in">Recovery plan</h1>
      <p className="za18ac8 t-subhead c2 in">Three phases, one payment at a time</p>
      <DayRuler />
      <h2 className="z7357f5 t-headline in">Your phases</h2>
      <PhaseStack pages={pages} className="z8575db in" />
      <p className="z7a17a5 tip">Lenders look at recent behaviour first. Finishing phase 1 matters most right now.</p>
    </Screen>
  );
}
