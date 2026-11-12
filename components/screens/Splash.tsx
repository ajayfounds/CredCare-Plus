'use client';
import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import './splash.css';
import { Screen } from '@/components/Screen';

export function Splash() {
  // The cover opens on every visit; a tap anywhere skips straight to the page.
  const [skip, setSkip] = useState(false);
  return (
      <Screen name="V9Splash" scope="splash" mode="always" className="z6d3072">
        <div style={{ position: "absolute", inset: "0", background: "var(--b900)", perspective: "1400px" } as CSSProperties} onPointerDown={() => setSkip(true)}>
          <div className="z599721 ruled">
            <p className="z8e12e4 t-headline">
              <svg className="z5414ac" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 5h18M3 12h18M3 19h18" strokeOpacity=".35" />
                <path d="M3 17l5-4 4 2 9-8" />
              </svg>
              CredCare
            </p>
            <div style={{ marginTop: "var(--cover-gap)" } as CSSProperties}>
              <p className="t-subhead c2">
                Your record starts today
              </p>
              <h1 className="zd43169 t-title1">
                One payment at a time
              </h1>
            </div>
            <Link className="ze221f0 btn bp" href="/welcome">
              Begin
            </Link>
          </div>
          <div className={`zcb0423 cover ${skip ? "skip" : ""}`} aria-hidden="true">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 5h18M3 12h18M3 19h18" strokeOpacity=".35" />
              <path className="z062278" d="M3 17l5-4 4 2 9-8" strokeDasharray="26" strokeDashoffset="26" />
            </svg>
            <p className="zb0043e t-title1">
              CredCare
            </p>
            <p className="zf86e68 t-callout">
              Credit recovery, one step at a time
            </p>
            <i style={{ position: "absolute", left: "16px", top: "0", bottom: "0", width: "2px", background: "var(--on-ink-rule)" } as CSSProperties} />
          </div>
        </div>
      </Screen>
  );
}
