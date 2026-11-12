'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import './privacy.css';
import { Screen } from '@/components/Screen';
import { dur } from '@/lib/motion';

export function Privacy() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const v = {
    showMac: !gone, macOp: fading ? 0 : 1, macTx: fading ? 'translateX(16px)' : 'none', removed: gone,
    signOut: () => { setFading(true); t.current = setTimeout(() => setGone(true), dur.exit); },
  };
  return (
      <Screen name="V9Privacy" scope="privacy" ent="none" className="zccfae7">
        <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 44px", alignItems: "center" } as CSSProperties}>
          <Link className="ib" href="/profile" aria-label="Back to profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <p className="z7023da t-headline">
            Privacy and security
          </p>
          <span />
        </div>
        <div className="zf69a28 card in">
          <a className="row" href="#password">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <span className="zd2dc0a t-headline">
              Change password
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="chev">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
          <label className="row">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
              </svg>
            </span>
            <span style={{ flex: "1", minWidth: "0" } as CSSProperties}>
              <b className="z96ce7e t-headline">
                Face ID login
              </b>
            </span>
            <input className="sw" type="checkbox" role="switch" defaultChecked={true} />
          </label>
        </div>
        <h2 className="za7e2a6 t-headline in">
          Signed-in devices
        </h2>
        <div className="za358bd card in">
          <div className="row">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="6" y="2" width="12" height="20" rx="3" />
                <path d="M11 18h2" />
              </svg>
            </span>
            <span style={{ flex: "1" } as CSSProperties}>
              <b className="z96ce7e t-headline">
                iPhone 14 Pro
              </b>
              <span className="t-footnote">
                Mumbai · This device
              </span>
            </span>
            <span className="zce31f5 t-footnote">
              Active
            </span>
          </div>
          {v.showMac ? (
            <>
              <div className="row" style={{ opacity: v.macOp, transform: v.macTx, transition: "opacity var(--d-exit) linear, transform var(--d-exit) var(--ease-in)" } as CSSProperties}>
                <span className="tile">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="12" rx="2" />
                    <path d="M2 20h20" />
                  </svg>
                </span>
                <span style={{ flex: "1" } as CSSProperties}>
                  <b className="z96ce7e t-headline">
                    Chrome on Mac
                  </b>
                  <span className="t-footnote">
                    Mumbai · 2 days ago
                  </span>
                </span>
                <button className="z4b49a3 btn" type="button" onClick={v.signOut} aria-label="Sign out Chrome on Mac">
                  Sign out
                </button>
              </div>
            </>
          ) : null}
        </div>
        {v.removed ? (
          <>
            <p className="z9fe7ca t-footnote" role="status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Chrome on Mac was signed out
            </p>
          </>
        ) : null}
      </Screen>
  );
}
