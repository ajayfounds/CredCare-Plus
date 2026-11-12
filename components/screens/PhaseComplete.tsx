'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import './phasecomplete.css';
import { Screen } from '@/components/Screen';
import { BackIcon } from '@/components/screens/Analysis';
import { Ring } from '@/components/ui/Ring';
import { Stamp } from '@/components/ui/Stamp';
import { Chevron } from '@/components/ui/Toast';
import { plan } from '@/lib/data';
import { dur, haptic, reducedMotion } from '@/lib/motion';
import { phaseTasks } from '@/lib/plan';

const [p1, p2] = plan.phases;
const Open = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /></svg>);
const FLIP_DELAY = 700;

/** Phase 1's page turns over (rotateY −180°, 900 ms) onto Phase 2; the stamp slams in after it lands. */
export function PhaseComplete() {
  useEffect(() => {
    if (reducedMotion()) return;
    const t = setTimeout(() => haptic('stamp'), FLIP_DELAY + dur.celebrate);
    return () => clearTimeout(t);
  }, []);
  const t2 = phaseTasks[2];
  return (
    <Screen name="V9PhaseComplete" scope="phasecomplete" className="z0fbfaa">
      <div className="pc-head">
        <Link className="ib" href="/actions" aria-label="Back to actions"><BackIcon /></Link>
        <span /><span />
      </div>
      <div className="z04317a in">
        <div className="zaaae7b flipbox">
          <div className="z3d1dfb card">
            <i className="pc-edge" style={{ background: 'var(--ph2)' }} />
            <p className="t-footnote c2">Phase 2 of 3</p>
            <p className="z37de9a t-headline">{p2.title}</p>
            <Ring size={48} value={0} total={p2.total} color="var(--ph2)" label={`0 of ${p2.total} done`}><span className="mono-s">0/{p2.total}</span></Ring>
          </div>
          <div className="zb8263d card top" aria-hidden="true">
            <i className="pc-edge" style={{ background: 'var(--ph1)' }} />
            <p className="t-footnote c2">Phase 1 of 3</p>
            <p className="z37de9a t-headline">{p1.title}</p>
            <Ring size={48} value={p1.total} total={p1.total} color="var(--ok600)" label={`${p1.total} of ${p1.total} done`}><span className="mono-s">{p1.total}/{p1.total}</span></Ring>
          </div>
          <span className="pc-stamp"><Stamp word="PHASE 1 DONE" tone="brand" large land className="zc6516b" /></span>
        </div>
        <h1 className="z3ae1f6 t-title1">You stopped the damage</h1>
        <p className="zc36aa9 t-body c2">All {p1.total} phase 1 tasks are done. Phase 2 builds the clean record lenders look for.</p>
      </div>
      <div className="pc-sec in"><h2 className="t-headline">Next: {p2.title}</h2><p className="t-footnote c3">{p2.window}</p></div>
      <div className="z9218c6 in">
        <div className="lg cascade">
          <div className="lr"><span className="mk"><Open /></span><div><p className="tt">{t2[0].title}</p><p className="mt">{t2[0].meta}</p></div><span /></div>
          <div className="lr"><span className="mk"><Open /></span><div><p className="tt">{t2[1].title}</p><p className="mt">Builds the clean record lenders look for</p></div><span /></div>
          <Link className="lr" href="/recovery/phase/2"><span className="mk"><Open /></span><div><p className="tt">{t2.length - 2} more tasks</p><p className="mt">Income proof and the Bajaj enquiry dispute</p></div><Chevron /></Link>
        </div>
      </div>
      <Link className="z599519 btn bp in" href="/recovery/phase/2">See phase 2</Link>
    </Screen>
  );
}
