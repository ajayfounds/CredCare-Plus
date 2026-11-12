'use client';
import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import './help.css';
import { Screen } from '@/components/Screen';
import { user } from '@/lib/data';

const FAQ = [
  { q: 'How often is my score updated?', a: 'Once a month, when the credit bureau refreshes your report. We notify you as soon as it changes.' },
  { q: 'Is my data safe?', a: 'Yes. Everything is encrypted, and we never sell your personal information to banks or lenders.' },
  { q: 'How do I close my account?', a: 'Contact support and we’ll close it for you. You can download a copy of your data first from Data permissions.' },
];
const CONNECT_MS = 1000;
type Row = (typeof FAQ)[number] & { open: boolean; rows: string; rot: string; op: number; toggle: () => void };

export function Help({ state }: { state?: 'sent' }) {
  const [open, setOpen] = useState(0);
  const [sent, setSent] = useState(state === 'sent');
  const [busy, setBusy] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const faqs: Row[] = FAQ.map((f, i) => {
    const o = open === i;
    return { ...f, open: o, rows: o ? '1fr' : '0fr', rot: o ? 'rotate(180deg)' : 'none', op: o ? 1 : 0, toggle: () => setOpen(o ? -1 : i) };
  });
  const v = {
    faqs, sent, notSent: !sent, busy, busyB: busy, cLabel: busy ? 'Connecting you' : 'Contact support',
    contact: () => { if (busy) return; setBusy(true); t.current = setTimeout(() => { setBusy(false); setSent(true); }, CONNECT_MS); },
  };
  return (
      <Screen name="V9Help" scope="help" ent="none" className="zccfae7">
        <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 44px", alignItems: "center" } as CSSProperties}>
          <Link className="ib" href="/profile" aria-label="Back to profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <p className="z7023da t-headline">
            Help and support
          </p>
          <span />
        </div>
        <section className="z062d4a in" aria-labelledby="v5h-t">
          <p id="v5h-t" className="t-title1">
            Need help?
          </p>
          <p className="z962484 t-callout c2">
            A person answers Mon–Fri, 9 am to 6 pm IST
          </p>
          {v.notSent ? (
            <>
              <button className="z3ae1f6 btn bp" type="button" aria-busy={v.busy} onClick={v.contact}>
                {v.busyB ? (
                  <>
                    <span className="spin" aria-hidden="true" />
                  </>
                ) : null}
                {v.cLabel}
              </button>
            </>
          ) : null}
          {v.sent ? (
            <>
              <div className="z705a97" role="status">
                <span style={{ flex: "none", display: "grid", color: "var(--ok600)" } as CSSProperties}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m8 12 3 3 5-6" />
                  </svg>
                </span>
                <span className="t-subhead">
                  <b style={{ display: "block", fontWeight: "600" } as CSSProperties}>
                    Request sent
                  </b>
                  <span style={{ color: "var(--t2)" } as CSSProperties}>
                    We’ll reply to {user.email} during support hours
                  </span>
                </span>
              </div>
            </>
          ) : null}
        </section>
        <h2 className="za7e2a6 t-headline in">
          Common questions
        </h2>
        <div className="za358bd card in">
          {(v.faqs || []).map((f: Row, fi: number) => (
            <Fragment key={fi}>
              <div className="faq">
                <button className="q" type="button" aria-expanded={f.open} onClick={f.toggle}>
                  <span style={{ flex: "1" } as CSSProperties}>
                    {f.q}
                  </span>
                  <span className="pm" style={{ transform: f.rot } as CSSProperties}>
                    <svg className="z8fcf47" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                </button>
                <div className="a" style={{ gridTemplateRows: f.rows } as CSSProperties} aria-hidden={!f.open}>
                  <div>
                    <p className="t-subhead" style={{ padding: "0 20px 16px", opacity: f.op } as CSSProperties}>
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </Screen>
  );
}
