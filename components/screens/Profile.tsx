'use client';
import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import './profile.css';
import { Screen } from '@/components/Screen';
import { plan, user } from '@/lib/data';

export function Profile() {
  const [asking, setAsking] = useState(false);
  useEffect(() => {
    if (!asking) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setAsking(false); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [asking]);
  const current = plan.phases.find((p) => p.status === 'now') ?? plan.phases[0];
  const v = { asking, ask: () => setAsking(true), cancel: () => setAsking(false) };
  return (
      <Screen name="V9Profile" scope="profile" tab={4} className="zfbe1dc">
        <h1 className="in t-title1">
          Profile
        </h1>
        <div className="zf423a6 in">
          <Link className="z0bb82a tap" href="/profile/personal-info" aria-label={`${user.name}, ${user.phone}. Edit personal info`}>
            <span className="z587503 t-title2" aria-hidden="true">
              {user.name.charAt(0)}
            </span>
            {" "}
            <span style={{ flex: "1" } as CSSProperties}>
              <b className="z96ce7e t-title2">
                {user.name}
              </b>
              <span className="z4738a1 t-subhead c2">
                {user.phone}
              </span>
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="chev">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", boxShadow: "inset 0 1px 0 var(--b700-12)" } as CSSProperties}>
            <Link className="z8e86e5 tap" href="/home">
              <span className="z2cb308 mono-l">
                {plan.day}
              </span>
              <span className="t-subhead c2">
                Day of plan
              </span>
            </Link>
            {" "}
            <Link className="z1bac79 tap" href="/recovery">
              <span className="z2cb308 mono-l">
                {current.n}/{plan.phases.length}
              </span>
              <span className="t-subhead c2">
                Phase
              </span>
            </Link>
            {" "}
            <Link className="z1bac79 tap" href="/home">
              <span className="zc7b7d5 mono-l">
                {plan.streakDays}
              </span>
              <span className="t-subhead c2">
                Day streak
              </span>
            </Link>
          </div>
        </div>
        <div className="z900056 card in">
          <Link className="row" href="/profile/personal-info">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </span>
            <span className="zd2dc0a t-headline">
              Personal information
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="chev">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
          <Link className="row" href="/profile/privacy">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
            <span className="zd2dc0a t-headline">
              Privacy and security
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="chev">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
          <Link className="row" href="/profile/data-permissions">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8" />
              </svg>
            </span>
            <span className="zd2dc0a t-headline">
              Data permissions
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="chev">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
        <div className="z25a527 card in">
          <Link className="row" href="/profile/notifications">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </span>
            <span className="zd2dc0a t-headline">
              Notifications
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="chev">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
          <Link className="row" href="/profile/help">
            <span className="tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </span>
            <span className="zd2dc0a t-headline">
              Help and support
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="chev">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
        <div className="zd1895e card in">
          <button className="zd79f02 row" type="button" onClick={v.ask}>
            <span className="z78cf98 tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="m16 17 5-5-5-5M21 12H9" />
              </svg>
            </span>
            <span className="zdd8767 t-headline">
              Log out
            </span>
          </button>
        </div>
        <p className="z46fc5f in t-footnote">
          Version {user.build}
        </p>
        {v.asking ? (
          <>
            <div className="scrim" onClick={v.cancel} />
            <div className="sheet" role="alertdialog" aria-modal="true" aria-labelledby="v5lo">
              <p id="v5lo" className="t-title2">
                Log out of CredCare?
              </p>
              <p className="za18ac8 t-subhead c2">
                Your plan and progress stay saved. You'll need your password to sign back in.
              </p>
              <Link className="zcdf73f btn" href="/sign-in">
                Log out
              </Link>
              <button className="za18ac8 btn bg" type="button" onClick={v.cancel}>
                Cancel
              </button>
            </div>
          </>
        ) : null}
      </Screen>
  );
}
