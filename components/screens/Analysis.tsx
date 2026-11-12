'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import './analysis.css';
import { Screen } from '@/components/Screen';
import { ScoreSlider, monthNote } from '@/components/chart/ScoreSlider';
import { WriteIn } from '@/components/home/ScoreRoll';
import { causes, score } from '@/lib/data';
import { signed } from '@/lib/format';

const h = score.history;
const total = h[h.length - 1].value - h[0].value;

export const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
);
const Fix = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
);

export function Analysis({ collapsed: forced }: { collapsed?: boolean }) {
  const [sel, setSel] = useState(h.length - 1);
  const [collapsed, setCollapsed] = useState(!!forced);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (forced || !titleRef.current) return;
    const io = new IntersectionObserver(([e]) => setCollapsed(!e.isIntersecting), { threshold: 0 });
    io.observe(titleRef.current);
    return () => io.disconnect();
  }, [forced]);

  return (
    <Screen name="V9Analysis" scope="analysis" ent="none" className="z39bb65">
      <div className={`an-head ${collapsed ? 'on' : ''}`}>
        <Link className="ib" href="/home" aria-label="Back to home"><BackIcon /></Link>
        <p className="z7023da t-headline an-mini" aria-hidden={!collapsed}>Why it dropped</p>
        <span />
      </div>
      {!forced ? (
        <>
          <h1 ref={titleRef} className="zb0043e t-title1">Why it dropped</h1>
          <p className="zd43169 t-body c2">Two events since November explain the whole {Math.abs(total)}-point drop</p>
        </>
      ) : null}
      <section className="z022793 card hero" aria-label="Score trend, last 6 months">
        <div className="an-row"><p className="t-subhead-m c2">Last 6 months</p><p className="t-caption c3">{signed(total)} pts</p></div>
        <p className="an-fig">
          <span className="fig-l">{h[sel].value}</span>
          <span className="t-footnote c2" aria-live="polite">{monthNote(sel)}</span>
        </p>
        <div className="an-mt12"><ScoreSlider sel={sel} onChange={setSel} /></div>
        <p className="zd43169 t-caption c3">Drag across the chart, or use the arrow keys, to see each month</p>
      </section>
      <h2 className="z4b87ae t-headline">Two causes</h2>
      <div className="z9ce4f9 cascade">
        {causes.map((c) => (
          <article key={c.title} className="card cz">
            <p className="pts"><span className="zf5fdc7"><WriteIn text={signed(c.points)} delay={300} /></span><small>points</small></p>
            <div>
              <h3 className="t-headline">{c.title}</h3>
              <p className="zf005b8 t-subhead c2">{c.meta}</p>
              {c.utilisation ? (
                <div className="z002535" role="img" aria-label={`${c.utilisation.used}% of limit used now. Target is under ${c.utilisation.target}%`}>
                  <div className="zaf3f30 trk">
                    <i style={{ width: `${c.utilisation.used}%`, background: 'var(--er600)', animationDelay: '300ms' }} />
                    <b className="notch an-notch" style={{ left: `${c.utilisation.target}%` } as CSSProperties} />
                  </div>
                  <div className="an-row t-subhead c2 an-mt8">
                    <span><b className="z0098fd mono">{c.utilisation.used}%</b>{' used'}</span>
                    <span>Healthy under {c.utilisation.target}%</span>
                  </div>
                </div>
              ) : null}
              <Link className="fx" href={c.fixHref}>Fix this<Fix /></Link>
            </div>
          </article>
        ))}
      </div>
      <Link className="z062d4a btn bp" href="/recovery">See my recovery plan</Link>
    </Screen>
  );
}
