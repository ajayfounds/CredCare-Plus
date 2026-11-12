'use client';
import { type CSSProperties } from 'react';
import Link from 'next/link';
import './notifications.css';
import { Screen } from '@/components/Screen';
import { useToggles } from '@/lib/useToggles';

const DEFAULTS = { n0: true, n1: true, n2: false, n3: true, n4: true, n5: false };
const NAMES = { n0: 'Payment reminders', n1: 'Score changes', n2: 'New offers', n3: 'Push notifications', n4: 'Email', n5: 'WhatsApp' };
type K = keyof typeof DEFAULTS;

export function Notifications() {
  const tg = useToggles(DEFAULTS, NAMES);
  const tog = (k: K) => (e: React.ChangeEvent<HTMLInputElement>) => tg.set(k, e.target.checked);
  return (
      <Screen name="V9Notifications" scope="notifications" ent="none" className="zccfae7">
        <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 44px", alignItems: "center" } as CSSProperties}>
          <Link className="ib" href="/profile" aria-label="Back to profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <p className="z7023da t-headline">
            Notifications
          </p>
          <span />
        </div>
        <h2 className="z75ee02 t-headline in">
          Alerts
        </h2>
        <div className="z2959c3 card in">
          <label className="row">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="3" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </span>
            <span style={{ flex: "1", minWidth: "0" } as CSSProperties}>
              <b className="z96ce7e t-headline">
                Payment reminders
              </b>
              <span className="z4738a1 t-footnote">
                3 days before and on the due date
              </span>
            </span>
            <input className="sw" type="checkbox" role="switch" checked={tg.vals.n0} aria-busy={tg.busy === 'n0'} onChange={tog('n0')} />
          </label>
          <label className="row">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 7l-8.5 8.5-5-5L2 17" />
                <path d="M16 7h6v6" />
              </svg>
            </span>
            <span style={{ flex: "1", minWidth: "0" } as CSSProperties}>
              <b className="z96ce7e t-headline">
                Score changes
              </b>
              <span className="z4738a1 t-footnote">
                When your monthly report updates
              </span>
            </span>
            <input className="sw" type="checkbox" role="switch" checked={tg.vals.n1} aria-busy={tg.busy === 'n1'} onChange={tog('n1')} />
          </label>
          <label className="row">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="5" width="20" height="14" rx="3" />
                <path d="M2 10h20" />
              </svg>
            </span>
            <span style={{ flex: "1", minWidth: "0" } as CSSProperties}>
              <b className="z96ce7e t-headline">
                New offers
              </b>
              <span className="z4738a1 t-footnote">
                Cards and loans you may qualify for
              </span>
            </span>
            <input className="sw" type="checkbox" role="switch" checked={tg.vals.n2} aria-busy={tg.busy === 'n2'} onChange={tog('n2')} />
          </label>
        </div>
        <h2 className="za7e2a6 t-headline in">
          Channels
        </h2>
        <div className="za358bd card in">
          <label className="row">
            <span style={{ flex: "1", minWidth: "0" } as CSSProperties}>
              <b className="z96ce7e t-headline">
                Push notifications
              </b>
            </span>
            <input className="sw" type="checkbox" role="switch" checked={tg.vals.n3} aria-busy={tg.busy === 'n3'} onChange={tog('n3')} />
          </label>
          <label className="row">
            <span style={{ flex: "1", minWidth: "0" } as CSSProperties}>
              <b className="z96ce7e t-headline">
                Email
              </b>
            </span>
            <input className="sw" type="checkbox" role="switch" checked={tg.vals.n4} aria-busy={tg.busy === 'n4'} onChange={tog('n4')} />
          </label>
          <label className="row">
            <span style={{ flex: "1", minWidth: "0" } as CSSProperties}>
              <b className="z96ce7e t-headline">
                WhatsApp
              </b>
            </span>
            <input className="sw" type="checkbox" role="switch" checked={tg.vals.n5} aria-busy={tg.busy === 'n5'} onChange={tog('n5')} />
          </label>
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
      </Screen>
  );
}
