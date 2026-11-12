'use client';
import { type CSSProperties } from 'react';
import Link from 'next/link';
import './signin.css';
import { Screen } from '@/components/Screen';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { user } from '@/lib/data';
import { haptic } from '@/lib/motion';

export function SignIn({ state: forced }: { state?: "error" }) {
  const router = useRouter();
  const [err, setErr] = useState(forced === 'error');
  const [shakeKey, setShakeKey] = useState(0);
  const [show, setShow] = useState(false);
  const submit = () => {
    const f = document.getElementById('v5si-e') as HTMLInputElement | null;
    const p = document.getElementById('v5si-p') as HTMLInputElement | null;
    if (!f?.value || !p?.value) { setErr(true); setShakeKey((k) => k + 1); haptic('error'); return; }
    router.push('/home');
  };
  const v = {
    isErr: err, em: forced === 'error' ? user.email : '',
    pwCls: err ? 'well err in shake' : 'well in', passType: show ? 'text' : 'password',
    eyeLabel: show ? 'Hide password' : 'Show password', toggleEye: () => setShow(!show), shakeKey, submit,
  };
  return (
      <Screen name="V9SignIn" scope="signin" className="z6d3072">
        <div className="band">
          <div className="in">
            <h1 className="t-title1">
              Welcome back
            </h1>
            <p className="z6e6a93 t-body">
              Pick up your plan where you left it
            </p>
          </div>
        </div>
        <section className="sheet">
          {v.isErr ? (
            <>
              <div className="z134702" role="alert">
                <svg className="z680829" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                That email and password don&apos;t match. Try again or reset your password.
              </div>
            </>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" } as CSSProperties}>
            <label className="z9218c6 well in" htmlFor="v5si-e">
              <span className="k">
                Email
              </span>
              <span className="v">
                <input id="v5si-e" type="email" autoComplete="email" placeholder="you@example.com" defaultValue={v.em} />
              </span>
            </label>
            {" "}
            <label key={v.shakeKey} className={`ze01f12 ${v.pwCls}`} htmlFor="v5si-p">
              <span className="k">
                <span>
                  Password
                </span>
                <a className="z93d1d3" href="#forgot">
                  Forgot?
                </a>
              </span>
              <span className="v">
                <input id="v5si-p" type={v.passType} autoComplete="current-password" placeholder="Enter your password" />
                <button className="eye" type="button" aria-label={v.eyeLabel} onClick={v.toggleEye}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </span>
            </label>
          </div>
          <button className="z301c22 btn bp in" type="button" onClick={v.submit}>Sign in</button>
          <div className="za555bf in">
            <div className="or">
              or
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" } as CSSProperties}>
              <button className="z1dd022 btn bs" type="button" onClick={() => router.push('/home')} aria-label="Sign in with Google">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path className="f-g1" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v5.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z" />
                  <path className="f-g2" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.8 0-5.2-1.9-6.1-4.5H2.2v2.8A11 11 0 0 0 12 23z" />
                  <path className="f-g3" d="M5.9 14.2a6.6 6.6 0 0 1 0-4.3V9.1H2.2a11 11 0 0 0 0 9.9z" />
                  <path className="f-g4" d="M12 5.4c1.6 0 3 .6 4.1 1.6l3.1-3.1A11 11 0 0 0 2.2 7.1l3.7 2.8C6.8 7.3 9.2 5.4 12 5.4z" />
                </svg>
                Google
              </button>
              <button className="z1dd022 btn bs" type="button" onClick={() => router.push('/home')} aria-label="Sign in with Facebook">
                <svg className="f-fb" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" } as CSSProperties}>
            <p className="sw">
              {"New here? "}
              <Link href="/sign-up">
                Create an account
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
