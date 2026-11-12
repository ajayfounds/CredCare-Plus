'use client';
import { type CSSProperties } from 'react';
import Link from 'next/link';
import './datause.css';
import { Screen } from '@/components/Screen';

export function DataUse() {
  return (
      <Screen name="V9DataUse" scope="datause" className="z0fbfaa">
        <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 44px", alignItems: "center" } as CSSProperties}>
          <Link className="ib" href="/safe-space" aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <div className="dots" role="img" aria-label="Step 3 of 3">
            <i />
            <i />
            <i className="on" />
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
          </svg>
        </div>
        <h1 className="z61c2b5 turn t-title1">
          How we use your data
        </h1>
        <p className="za56e29 in t-body">
          We only ask for what we need to build your plan
        </p>
        <div className="z05801e sec in">
          <p>
            What we access
          </p>
        </div>
        <div className="z706dd3 card in">
          <div className="zdb071a row">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="5" width="20" height="14" rx="3" />
                <path d="M2 10h20" />
              </svg>
            </span>
            <div>
              <p className="t-headline">
                Credit history
              </p>
              <p className="zf005b8 t-subhead">
                To find missed payments and what’s pulling your score down
              </p>
            </div>
          </div>
          <div className="zdb071a row">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <circle cx="9" cy="11" r="2.5" />
                <path d="M14 10h4M14 14h4M6 16c.6-1.4 1.7-2 3-2s2.4.6 3 2" />
              </svg>
            </span>
            <div>
              <p className="t-headline">
                Identity verification
              </p>
              <p className="zf005b8 t-subhead">
                To make sure it’s really you
              </p>
            </div>
          </div>
        </div>
        <div className="z8d0cab sec in">
          <p>
            What we never do
          </p>
        </div>
        <div className="zcf0733 card in">
          <div className="z1138ec row">
            <span style={{ width: "24px", flex: "none", display: "grid", placeItems: "center", color: "var(--er600)" } as CSSProperties}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6M9 9l6 6" />
              </svg>
            </span>
            <p className="t-body">
              Sell your data to lenders
            </p>
          </div>
          <div className="z1138ec row">
            <span style={{ width: "24px", flex: "none", display: "grid", placeItems: "center", color: "var(--er600)" } as CSSProperties}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6M9 9l6 6" />
              </svg>
            </span>
            <p className="t-body">
              Run a hard enquiry on your report
            </p>
          </div>
        </div>
        <div className="z706f65 in">
          <p className="zc5e1d4 lg t-footnote">
            {"By continuing, you agree to our "}
            <a className="z93d1d3" href="#terms">
              Terms
            </a>
            {" and "}
            <a className="z93d1d3" href="#privacy">
              Privacy Policy
            </a>
          </p>
          <Link className="btn bp" href="/sign-up">
            Agree and continue
          </Link>
        </div>
      </Screen>
  );
}
