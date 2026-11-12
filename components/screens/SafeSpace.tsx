'use client';
import { type CSSProperties } from 'react';
import Link from 'next/link';
import './safespace.css';
import { Screen } from '@/components/Screen';

export function SafeSpace() {
  return (
      <Screen name="V9SafeSpace" scope="safespace" className="z0fbfaa">
        <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 44px", alignItems: "center" } as CSSProperties}>
          <Link className="ib" href="/welcome" aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <div className="dots" role="img" aria-label="Step 2 of 3">
            <i />
            <i className="on" />
            <i />
          </div>
          <span />
        </div>
        <div className="z3ae1f6 turn">
          <svg width="96" height="96" viewBox="0 0 120 120" fill="none" aria-hidden="true">
            <rect className="f-n0 s-n200" x="26" y="16" width="72" height="88" rx="8" transform="rotate(5 62 60)" />
            <rect className="f-n0 s-n200" x="20" y="18" width="80" height="90" rx="8" strokeWidth="1.5" />
            <rect className="f-b600" x="30" y="25" width="30" height="4" rx="2" fillOpacity=".9" />
            <line className="s-n200" x1="30" x2="90" y1="44" y2="44" />
            <line className="s-n200" x1="30" x2="90" y1="58" y2="58" />
            <line className="s-n200" x1="30" x2="90" y1="72" y2="72" />
            <line className="s-n200" x1="30" x2="90" y1="86" y2="86" />
            <rect className="f-n200" x="30" y="35" width="26" height="4" rx="2" />
            <rect className="f-n200" x="74" y="35" width="16" height="4" rx="2" />
            <rect className="f-n200" x="30" y="49" width="34" height="4" rx="2" />
            <rect className="f-n200" x="78" y="49" width="12" height="4" rx="2" />
            <rect className="f-n200" x="30" y="63" width="22" height="4" rx="2" />
            <rect className="f-n200" x="72" y="63" width="18" height="4" rx="2" />
            <g transform="rotate(-8 78 96)">
              <rect className="f-n0 s-b600" x="56" y="84" width="46" height="22" rx="5" strokeWidth="1.5" />
              <rect className="s-b600" x="58.5" y="86.5" width="41" height="17" rx="3.5" fill="none" strokeOpacity=".4" />
              <path className="s-b600" d="m66 95 3 3 6-6" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <rect className="f-b600" x="79" y="93.5" width="15" height="3" rx="1.5" />
            </g>
          </svg>
        </div>
        <h1 className="z61c2b5 turn t-title1">
          Checking your score won’t lower it
        </h1>
        <p className="zb86f87 in t-body">
          Here’s how we handle your data
        </p>
        <div className="z435dc3 card in">
          <div className="zdb071a row">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <div>
              <p className="t-headline">
                Soft enquiry only
              </p>
              <p className="zf005b8 t-subhead">
                Viewing your score here never lowers it, so check as often as you like
              </p>
            </div>
          </div>
          <div className="zdb071a row">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <div>
              <p className="t-headline">
                Private and secure
              </p>
              <p className="zf005b8 t-subhead">
                Your data is encrypted. We never sell your personal information to banks or lenders.
              </p>
            </div>
          </div>
          <div className="zdb071a row">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
              </svg>
            </span>
            <div>
              <p className="t-headline">
                You’re in control
              </p>
              <p className="zf005b8 t-subhead">
                Turn any data permission off from your profile, at any time
              </p>
            </div>
          </div>
        </div>
        <Link className="z706f65 btn bp in" href="/data-use">
          I understand
        </Link>
      </Screen>
  );
}
