'use client';
import { Fragment, type CSSProperties } from 'react';
import Link from 'next/link';
import './signup.css';
import { Screen } from '@/components/Screen';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { user } from '@/lib/data';
import { haptic } from '@/lib/motion';

type Row = { c: string };
const BAR = ['var(--n200)', 'var(--er600)', 'var(--wn600)', 'var(--b700)', 'var(--ok600)'];
const INK = ['var(--n700)', 'var(--er700)', 'var(--wn700)', 'var(--b700)', 'var(--ok700)'];
const LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strength = (p: string) => (p.length >= 8 ? 1 : 0) + (/[A-Z]/.test(p) && /[a-z]/.test(p) ? 1 : 0) + (/\d/.test(p) ? 1 : 0) + (/[^A-Za-z0-9]/.test(p) ? 1 : 0);
const demoMobile = user.phone.replace('+91 ', '');

export function SignUp({ state: forced }: { state?: 'error' }) {
  const router = useRouter();
  const [p, setP] = useState('');
  const [err, setErr] = useState(forced === 'error');
  const [shakeKey, setShakeKey] = useState(0);
  const s = strength(p);
  const submit = () => {
    const m = (document.getElementById('v5su-m') as HTMLInputElement | null)?.value.replace(/\D/g, '') ?? '';
    const e = (document.getElementById('v5su-e') as HTMLInputElement | null)?.value ?? '';
    if (m.length !== 10 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) { setErr(true); setShakeKey((k) => k + 1); haptic('error'); return; }
    router.push('/verify');
  };
  const v = {
    bars: [0, 1, 2, 3].map((i) => ({ c: i < s ? BAR[s] : BAR[0] })), sLabel: LABELS[s], hasPass: p.length > 0, sCol: INK[s === 0 ? 0 : s],
    onPass: (e: React.ChangeEvent<HTMLInputElement>) => setP(e.target.value),
    isErr: err, mob: forced === 'error' ? demoMobile.slice(0, 9) : '', mail: forced === 'error' ? user.email : '',
    mobCls: err ? 'well err shake' : 'well', mailCls: err ? 'well err shake' : 'well', shakeKey, submit,
  };
  return (
      <Screen name="V9SignUp" scope="signup" className="z6d3072">
        <div className="z661f89 band">
          <h1 className="in t-title1">
            Create your account
          </h1>
          <p className="z18fd28 in t-body">
            You’ll verify your number next
          </p>
        </div>
        <section className="sheet">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" } as CSSProperties}>
            <label className="z9218c6 well in" htmlFor="v5su-n">
              <span className="k">
                Full name
              </span>
              <span className="v">
                <input id="v5su-n" autoComplete="name" placeholder="As on your PAN card" />
              </span>
            </label>
            <div className="ze01f12 in">
              <label key={"m" + v.shakeKey} className={v.mobCls} htmlFor="v5su-m">
                <span className="k">
                  Mobile
                </span>
                <span className="v">
                  <span className="zeccc95 t-body">
                    +91
                  </span>
                  <input id="v5su-m" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" defaultValue={v.mob} aria-invalid={v.isErr} aria-describedby="v5su-mm" />
                </span>
              </label>
              {v.isErr ? (
                <>
                  <p className="ferr" id="v5su-mm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    Enter all 10 digits
                  </p>
                </>
              ) : null}
            </div>
            <div className="zd3f99e in">
              <label key={"e" + v.shakeKey} className={v.mailCls} htmlFor="v5su-e">
                <span className="k">
                  Email
                </span>
                <span className="v">
                  <input id="v5su-e" type="email" autoComplete="email" placeholder="you@example.com" defaultValue={v.mail} aria-invalid={v.isErr} aria-describedby="v5su-em" />
                </span>
              </label>
              {v.isErr ? (
                <>
                  <p className="ferr" id="v5su-em">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    {"This email already has an account. "}
                    <Link className="z497f5e" href="/sign-in">
                      Sign in
                    </Link>
                  </p>
                </>
              ) : null}
            </div>
            <div className="zd77e4a in">
              <label className="well" htmlFor="v5su-p">
                <span className="k">
                  Password
                </span>
                <span className="v">
                  <input id="v5su-p" type="password" autoComplete="new-password" placeholder="At least 8 characters" aria-describedby="v5su-ps" onChange={v.onPass} />
                </span>
              </label>
              {v.hasPass ? (
                <>
                  <div className="meter" aria-hidden="true">
                    {(v.bars || []).map((b: Row, bi: number) => (
                      <Fragment key={bi}>
                        <i style={{ background: b.c } as CSSProperties} />
                      </Fragment>
                    ))}
                  </div>
                  <p id="v5su-ps" className="z140796 t-footnote" aria-live="polite">
                    <b style={{ fontWeight: "600", color: v.sCol } as CSSProperties}>
                      {v.sLabel}
                    </b>
                  </p>
                </>
              ) : null}
            </div>
          </div>
          <button className="z80d446 btn bp in" type="button" onClick={v.submit}>Create account</button>
          <div className="za77d7f in">
            <div className="or">
              or
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" } as CSSProperties}>
              <button className="z1dd022 btn bs" type="button" onClick={() => router.push('/home')} aria-label="Sign up with Google">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path className="f-g1" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v5.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z" />
                  <path className="f-g2" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.8 0-5.2-1.9-6.1-4.5H2.2v2.8A11 11 0 0 0 12 23z" />
                  <path className="f-g3" d="M5.9 14.2a6.6 6.6 0 0 1 0-4.3V9.1H2.2a11 11 0 0 0 0 9.9z" />
                  <path className="f-g4" d="M12 5.4c1.6 0 3 .6 4.1 1.6l3.1-3.1A11 11 0 0 0 2.2 7.1l3.7 2.8C6.8 7.3 9.2 5.4 12 5.4z" />
                </svg>
                Google
              </button>
              <button className="z1dd022 btn bs" type="button" onClick={() => router.push('/home')} aria-label="Sign up with Facebook">
                <svg className="f-fb" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" } as CSSProperties}>
            <p className="sw">
              {"Have an account? "}
              <Link href="/sign-in">
                Sign in
              </Link>
            </p>
            <p className="z7023da lg t-footnote">
              {"By continuing, you agree to our "}
              <a className="z93d1d3" href="#terms">
                Terms
              </a>
              {" and "}
              <a className="z93d1d3" href="#privacy">
                Privacy Policy
              </a>
            </p>
          </div>
        </section>
      </Screen>
  );
}
