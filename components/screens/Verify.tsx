'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import './verify.css';
import { Screen } from '@/components/Screen';
import { BackIcon } from '@/components/screens/Analysis';
import { Printer } from '@/components/ui/Printer';
import { Stamp } from '@/components/ui/Stamp';
import { user, verify } from '@/lib/data';
import { haptic } from '@/lib/motion';

export type VerifyState = 'default' | 'otp' | 'fetching' | 'done';

const STEPS = ['Connecting to CIBIL', 'Reading your accounts', 'Building your plan'] as const;
const SEND_MS = 900;
const CONFIRM_MS = 500;
const STEP_MS = 1100;
const LAST = 4;

export function Verify({ state = 'default' }: { state?: VerifyState }) {
  const [ph, setPh] = useState<'form' | 'otp' | 'run'>(state === 'otp' ? 'otp' : state === 'fetching' || state === 'done' ? 'run' : 'form');
  const [k, setK] = useState(state === 'done' ? LAST : state === 'fetching' ? 1 : 0);
  const [code, setCode] = useState(state === 'otp' ? verify.demoCode.slice(0, 4) : '');
  const [left, setLeft] = useState<number>(verify.resendSeconds);
  const [sending, setSending] = useState(false);
  const [okc, setOkc] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ph !== 'otp') return;
    const iv = setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, [ph]);
  useEffect(() => {
    if (ph !== 'run' || k >= LAST) return;
    t.current = setTimeout(() => setK((x) => x + 1), STEP_MS);
    return () => clearTimeout(t.current);
  }, [ph, k]);
  useEffect(() => { if (k >= LAST && ph === 'run') haptic('stamp'); }, [k, ph]);
  useEffect(() => () => clearTimeout(t.current), []);

  const run = () => { setPh('run'); setK(1); };
  const send = () => {
    if (sending) return;
    setSending(true);
    t.current = setTimeout(() => { setSending(false); setPh('otp'); setLeft(verify.resendSeconds); setCode(''); setTimeout(() => input.current?.focus(), 50); }, SEND_MS);
  };
  const onCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const c = e.target.value.replace(/\D/g, '').slice(0, verify.otpLength);
    setCode(c);
    if (c.length === verify.otpLength) {
      setOkc(true);
      haptic('selection');
      clearTimeout(t.current);
      t.current = setTimeout(run, CONFIRM_MS);
    }
  };
  const short = code.length < verify.otpLength;
  const boxes = Array.from({ length: verify.otpLength }, (_, i) => ({ k: i, d: code[i] ?? '', cls: i < code.length ? 'f' : i === Math.min(code.length, verify.otpLength - 1) ? 'cur' : '' }));

  return (
    <Screen name="V9Verify" scope="verify" className="z0fbfaa">
      <Link className="ib" href="/sign-up" aria-label="Back"><BackIcon /></Link>
      {ph === 'form' ? (
        <>
          <h1 className="z062d4a in t-title1">Verify your identity</h1>
          <p className="za56e29 in t-body">We’ll send a one-time code to the number you signed up with</p>
          <div className="z3621a4 in">
            <div><p className="t-footnote c2">Mobile number</p><p className="zf005b8 fig-m">{user.phone}</p></div>
            <Link href="/sign-up" className="z07e757 t-subhead-m">Edit</Link>
          </div>
          <p className="zb8a1f6 t-footnote c2 in">
            <span className="vf-ok"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg></span>
            Soft enquiry, it won’t affect your score
          </p>
          <div className="z527449 in">
            <button className="btn bp" type="button" aria-busy={sending} onClick={send}>
              {sending ? <span className="spin" aria-hidden="true" /> : null}
              {sending ? 'Sending code' : 'Send code'}
            </button>
          </div>
        </>
      ) : null}
      {ph === 'otp' ? (
        <>
          <h1 className="z062d4a t-title1">Enter the code</h1>
          <p className="zd43169 t-body">Sent to {user.phone}</p>
          <div className="vf-mt32">
            <label htmlFor="v5v-otp" className="zc6b2f3 t-footnote">{verify.otpLength}-digit code</label>
            <div className={`otp ${okc ? 'ok' : ''}`}>
              {boxes.map((b) => <span key={b.k} className={b.cls} style={{ '--k': b.k } as CSSProperties} aria-hidden="true">{b.d}</span>)}
              <input ref={input} id="v5v-otp" inputMode="numeric" autoComplete="one-time-code" maxLength={verify.otpLength} aria-describedby="v5v-rs" value={code} onChange={onCode} />
            </div>
            <div className="vf-row">
              <p id="v5v-rs" className="t-footnote" aria-live="polite">{left > 0 ? `Resend code in 0:${String(left).padStart(2, '0')}` : 'Didn’t get it?'}</p>
              <button className="z1f9ee5 btn bg" type="button" disabled={left > 0} onClick={() => setLeft(verify.resendSeconds)}>Resend</button>
            </div>
          </div>
          <button className="z56115e btn bp" type="button" aria-disabled={short} onClick={() => { if (!short) run(); }}>Verify and fetch report</button>
          <p className="zb97a3d why" aria-live="polite">{short ? `Enter all ${verify.otpLength} digits` : ''}</p>
        </>
      ) : null}
      {ph === 'run' ? (
        <>
          <h1 className="z062d4a t-title1">{k >= LAST ? 'Your plan is ready' : 'Getting your report'}</h1>
          <p className="zd43169 t-body">This usually takes under a minute</p>
          <div className="vf-mt32">
            {k < LAST ? (
              <Printer lines={STEPS} mode={state === 'fetching' && k === 1 ? 'paused' : 'live'} caption="Soft enquiry, no score impact" />
            ) : (
              <div className="vf-rel">
                <Printer lines={STEPS} mode="once" />
                <span className="vf-stamp"><Stamp word="REPORT READY" tone="brand" large land live className="z875fa1" /></span>
              </div>
            )}
          </div>
          {k >= LAST ? (
            <Link className="ze94a92 btn bp" href="/home">
              See my plan
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}
