'use client';
import { type CSSProperties } from 'react';
import Link from 'next/link';
import './dataperms.css';
import { Screen } from '@/components/Screen';
import { useEffect, useState } from 'react';
import { useToggles } from '@/lib/useToggles';

const DEFAULTS = { b0: true, b1: false };
const NAMES = { b0: 'Credit bureau access', b1: 'SMS parsing' };
type K = keyof typeof DEFAULTS;

export function DataPerms() {
  const tg = useToggles(DEFAULTS, NAMES);
  const [asking, setAsking] = useState(false);
  useEffect(() => {
    if (!asking) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setAsking(false); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [asking]);
  // Turning bureau access off stops the plan updating, so it asks first.
  const tog = (k: K) => (e: React.ChangeEvent<HTMLInputElement>) => (k === 'b0' && !e.target.checked ? setAsking(true) : tg.set(k, e.target.checked));
  const v = { asking, cancel: () => setAsking(false), confirmOff: () => { setAsking(false); tg.set('b0', false); } };
  return (
      <Screen name="V9DataPerms" scope="dataperms" ent="none" className="zccfae7">
        <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 44px", alignItems: "center" } as CSSProperties}>
          <Link className="ib" href="/profile" aria-label="Back to profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <p className="z7023da t-headline">
            Data permissions
          </p>
          <span />
        </div>
        <p className="z6e16cc t-footnote c3 in">
          Encrypted in transit and at rest
        </p>
        <h2 className="z3094ac t-headline in">
          Permissions
        </h2>
        <div className="za358bd card in">
          <label className="row">
            <span style={{ flex: "1", minWidth: "0" } as CSSProperties}>
              <b className="z96ce7e t-headline">
                Credit bureau access
              </b>
              <span className="z4738a1 t-footnote">
                Refreshes your credit report once a month, needed for your plan
              </span>
            </span>
            <input className="sw" type="checkbox" role="switch" checked={tg.vals.b0} aria-busy={tg.busy === 'b0'} onChange={tog('b0')} />
          </label>
          <label className="row">
            <span style={{ flex: "1", minWidth: "0" } as CSSProperties}>
              <b className="z96ce7e t-headline">
                SMS parsing
              </b>
              <span className="z4738a1 t-footnote">
                Reads bank alerts to track card spends, off unless you turn it on
              </span>
            </span>
            <input className="sw" type="checkbox" role="switch" checked={tg.vals.b1} aria-busy={tg.busy === 'b1'} onChange={tog('b1')} />
          </label>
        </div>
        <h2 className="z7357f5 t-headline in">
          Your data
        </h2>
        <div className="z706dd3 card in">
          <a className="z1138ec row" href="#download">
            <span className="zd2dc0a t-headline">
              Download a copy
            </span>
            <span className="chev">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
              </svg>
            </span>
          </a>
        </div>
        <div className="z9f0217 card in">
          <a className="zed2a13 row" href="#delete">
            <span className="zd2dc0a t-headline">
              Delete my data
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
          </a>
        </div>
        {tg.toast ? (
          <>
            <div className="z1c13e0 toast" role="status">
              <span className="ic">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              {tg.toast}
              <button className="ac" type="button" onClick={tg.undo}>
                Undo
              </button>
            </div>
          </>
        ) : null}
        {v.asking ? (
          <>
            <div className="scrim" onClick={v.cancel} />
            <div className="sheet" role="alertdialog" aria-modal="true" aria-labelledby="v5bo">
              <p id="v5bo" className="t-title2">
                Turn off bureau access?
              </p>
              <p className="za18ac8 t-subhead c2">
                We won't refresh your credit report, so your score, plan and tasks stop updating. You can turn it back on any time.
              </p>
              <button className="zcdf73f btn" type="button" onClick={v.confirmOff}>
                Turn off
              </button>
              <button className="za18ac8 btn bg" type="button" onClick={v.cancel}>
                Keep it on
              </button>
            </div>
          </>
        ) : null}
      </Screen>
  );
}
