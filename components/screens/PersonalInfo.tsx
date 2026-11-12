'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import './pinfo.css';
import { Screen } from '@/components/Screen';
import { user } from '@/lib/data';
import { haptic } from '@/lib/motion';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function PersonalInfo({ state }: { state?: 'error' }) {
  const err = state === 'error';
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(err ? user.email.replace(/\.com$/, '') : user.email);
  const [phone, setPhone] = useState(user.phone);
  const [tried, setTried] = useState(err);
  const [dirty, setDirty] = useState(err);
  const [saved, setSaved] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const valid = EMAIL.test(email.trim());
  const bad = tried && !valid;
  const edit = (f: (s: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => { f(e.target.value); setDirty(true); setSaved(false); };
  const v = {
    name, email, phone, onName: edit(setName), onEmail: edit(setEmail), onPhone: edit(setPhone),
    emailBad: bad, emailCls: bad ? 'well err' : 'well',
    clean: !dirty && !saved, saved, label: saved ? 'Saved' : 'Save changes',
    save: () => {
      if (saved) return;
      if (!valid) { setTried(true); haptic('error'); return; }
      setDirty(false);
      setSaved(true);
      setTried(false);
      clearTimeout(t.current);
      t.current = setTimeout(() => setSaved(false), 1800);
    },
  };
  return (
      <Screen name="V9PersonalInfo" scope="pinfo" ent="none" className="zccfae7">
        <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 44px", alignItems: "center" } as CSSProperties}>
          <Link className="ib" href="/profile" aria-label="Back to profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <p className="z7023da t-headline">
            Personal info
          </p>
          <span />
        </div>
        <div className="z062d4a in">
          <label className="well" htmlFor="v5pi-n">
            <span className="k">
              Full name
            </span>
            <span className="v">
              <input id="v5pi-n" autoComplete="name" value={v.name} onChange={v.onName} />
            </span>
          </label>
          {" "}
          <label className={v.emailCls} htmlFor="v5pi-e">
            <span className="k">
              Email
            </span>
            <span className="v">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="m22 7-10 6L2 7" />
              </svg>
              <input id="v5pi-e" type="email" autoComplete="email" value={v.email} onChange={v.onEmail} aria-invalid={v.emailBad} aria-describedby="v5pi-ee" />
            </span>
          </label>
          {v.emailBad ? (
            <>
              <p id="v5pi-ee" className="z8dcdf4 t-footnote" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                Enter a full email address, like name@example.com
              </p>
            </>
          ) : null}
          <label className="well" htmlFor="v5pi-p">
            <span className="k">
              <span>
                Phone
              </span>
              <span style={{ display: "inline-flex", gap: "4px", alignItems: "center", color: "var(--ok700)" } as CSSProperties}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Verified
              </span>
            </span>
            <span className="v">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="6" y="2" width="12" height="20" rx="3" />
                <path d="M11 18h2" />
              </svg>
              <input id="v5pi-p" type="tel" autoComplete="tel" value={v.phone} onChange={v.onPhone} />
            </span>
          </label>
        </div>
        <p className="z17bf30 in t-footnote">
          Changing your name or phone may ask you to verify your identity again
        </p>
        <button className="z599519 btn bp in" type="button" disabled={v.clean} onClick={v.save}>
          {v.saved ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </>
          ) : null}
          {v.label}
        </button>
      </Screen>
  );
}
