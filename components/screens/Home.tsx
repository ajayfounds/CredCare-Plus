'use client';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import './home.css';
import { Screen } from '@/components/Screen';
import { MiniCard } from '@/components/card/MiniCard';
import { BandTrack, bandOf } from '@/components/chart/BandTrack';
import { Sparkline } from '@/components/chart/Sparkline';
import { ScoreRoll, WriteIn } from '@/components/home/ScoreRoll';
import { WeekLegend, WeekStrip, weekDays } from '@/components/home/WeekStrip';
import { Printer, CIBIL_STEPS } from '@/components/ui/Printer';
import { Ring } from '@/components/ui/Ring';
import { Stamp } from '@/components/ui/Stamp';
import { CalendarIcon, Chevron, Toast } from '@/components/ui/Toast';
import { TODAY, deltaVsLastMonth, hoursLeftToday, plan, score } from '@/lib/data';
import { card } from '@/lib/model';
import { dayMonth, inr, signed } from '@/lib/format';
import { dur, gesture, haptic } from '@/lib/motion';
import { useApp } from '@/lib/store';

export type HomeState = 'default' | 'loading' | 'done' | 'offline' | 'refreshing' | 'pulling' | 'missed';

const phase1 = plan.phases[0];
const REFRESH_MS = 2700;
const RETRY_MS = 2400;

export function Home({ state: forced }: { state?: HomeState }) {
  const app = useApp();
  const paid = app.isDone('pay');
  const st: HomeState = forced ?? (paid ? 'done' : 'default');

  const [selDay, setSelDay] = useState(() => Math.max(0, weekDays({ paidToday: false, missed: false }).findIndex((d) => d.today)));
  const [snoozed, setSnoozed] = useState(false);
  const [offline, setOffline] = useState(st === 'offline');
  const [retrying, setRetrying] = useState(false);
  const [refreshing, setRefreshing] = useState(st === 'refreshing');
  const [pull, setPull] = useState(st === 'pulling' ? gesture.pull + 8 : 0);
  const [hoursLeft, setHoursLeft] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  useEffect(() => {
    setHoursLeft(hoursLeftToday());
    if (typeof navigator !== 'undefined' && navigator.onLine === false) setOffline(true);
  }, []);

  const loading = st === 'loading';
  const done = st === 'done';
  const missed = st === 'missed';
  const days = weekDays({ paidToday: done, missed });
  const phaseDone = phase1.done + (app.isDone('pay') ? 1 : 0) + (app.isDone('autopay') ? 1 : 0);
  const prevMonth = score.history[score.history.length - 2].month;
  const band = bandOf(score.current);

  const retry = () => {
    setRetrying(true);
    later(() => { setRetrying(false); setOffline(false); }, RETRY_MS);
  };
  const snooze = () => {
    setSnoozed(true);
    app.snooze('pay');
    later(() => setSnoozed(false), dur.toast);
  };

  // Pull to refresh: the ledger line rubber-bands, then the printer runs.
  const start = useRef<number | null>(null);
  const pullRef = useRef(pull);
  pullRef.current = pull;
  const atTop = () => (document.getElementById('scroller')?.scrollTop ?? 0) <= 0;
  const begin = (y: number) => { if (!refreshing && atTop()) start.current = y; };
  const moveTo = (y: number) => {
    if (start.current == null) return false;
    const dy = y - start.current;
    if (dy <= 0) { setPull(0); return false; }
    const rubber = Math.min(120, dy * 0.5);
    if (pullRef.current < gesture.pull && rubber >= gesture.pull) haptic('selection');
    setPull(rubber);
    return true;
  };
  const release = useCallback(() => {
    if (start.current == null) return;
    start.current = null;
    if (pullRef.current >= gesture.pull) {
      setRefreshing(true);
      timers.current.push(setTimeout(() => setRefreshing(false), REFRESH_MS));
    }
    setPull(0);
  }, []);
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const ts = (e: TouchEvent) => begin(e.touches[0].clientY);
    const tm = (e: TouchEvent) => { if (moveTo(e.touches[0].clientY) && e.cancelable) e.preventDefault(); };
    el.addEventListener('touchstart', ts, { passive: true });
    el.addEventListener('touchmove', tm, { passive: false });
    el.addEventListener('touchend', release);
    el.addEventListener('touchcancel', release);
    return () => {
      el.removeEventListener('touchstart', ts);
      el.removeEventListener('touchmove', tm);
      el.removeEventListener('touchend', release);
      el.removeEventListener('touchcancel', release);
    };
  });

  const pulling = pull > 0 || st === 'pulling';
  const depth = 6 + Math.min(28, (pull / gesture.pull) * 28);

  return (
    <Screen name="V9Home" scope="home" tab={0}>
      <div ref={mainRef} className="home-pull" onPointerDown={(e) => { if (e.pointerType === 'mouse') begin(e.clientY); }} onPointerMove={(e) => { if (e.pointerType === 'mouse' && e.buttons) moveTo(e.clientY); }} onPointerUp={release}>
        <section className="hb" aria-label="Credit score">
          <header className="z5dbef2 in">
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="t-footnote c2">{dayMonth(TODAY)}</p>
              <h1 className="zf005b8 t-title2">Day {plan.day} of your plan</h1>
            </div>
            <Link className="z019b32 ib" href="/profile/notifications" aria-label="Notifications, 1 new">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <i className="home-bell-dot" />
            </Link>
          </header>
          {loading ? (
            <div aria-busy="true" aria-label="Loading your score">
              <div className="z718a61 sk" />
              <div className="zd0d674 sk" />
              <div className="zcf2db9 sk" />
              <div className="z1c7c14 sk" />
            </div>
          ) : (
            <>
              <div className="home-score">
                <ScoreRoll value={score.current} />
                <div className="home-score-meta" aria-live="polite">
                  <span className="zdc21c7 chip8"><i className="home-band-dot" style={{ background: `var(--band-${band.key}-i)` }} />{band.label}</span>
                  <span className="zdbecec t-callout"><span className="mono">{signed(deltaVsLastMonth)}</span> vs {prevMonth}</span>
                  <span className="z93f731 t-footnote">Updated {score.updated}</span>
                </div>
              </div>
              <div className="home-mt12"><BandTrack value={score.current} /></div>
              <div className="home-mt12"><Sparkline /></div>
              <Link className="lnk" href="/analysis">See why it dropped<Chevron size={16} stroke="currentColor" /></Link>
            </>
          )}
        </section>
        <div className="sh">
          {pulling ? (
            <div className="zd2a8b9" role="status">
              <svg width="200" height="28" viewBox="0 0 200 28" fill="none" aria-hidden="true">
                <path className="zdb1770" d={`M4 6 Q100 ${st === 'pulling' && pull > gesture.pull ? 34 : depth.toFixed(1)} 196 6`} strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="t-footnote c2">{pull >= gesture.pull || st === 'pulling' ? 'Release to refresh' : 'Pull to refresh'}</p>
            </div>
          ) : null}
          {offline ? (
            <div className="home-mb16">
              <div className="banner" role="status">
                <span style={{ flex: 1 }}>Couldn’t refresh. Showing your report from {score.updated}</span>
                <button className="z62f18e btn bs" type="button" onClick={retry} disabled={retrying}>{retrying ? 'Retrying' : 'Retry'}</button>
              </div>
              {retrying ? <div className="home-mt12"><Printer lines={CIBIL_STEPS} /></div> : null}
            </div>
          ) : null}
          {refreshing ? (
            <div className="home-mb20"><Printer lines={CIBIL_STEPS} mode={st === 'refreshing' ? 'paused' : 'live'} caption="Refreshing your report" /></div>
          ) : null}
          {loading ? (
            <>
              <div className="z77c4bc card"><div className="za56d5f sk" /><div className="z37f803 sk" /><div className="z7eafc3 sk" /></div>
              <div className="zc2df40 card" />
            </>
          ) : (
            <>
              <section className="ze01f12 in" aria-label="Today">
                {!done ? (
                  <div className="z7fa563 card hero">
                    <div className="home-row-between">
                      <h2 className="t-title2">Today</h2>
                      <span className="tchip"><CalendarIcon size={14} />{hoursLeft == null ? '' : `${hoursLeft} h left`}</span>
                    </div>
                    <div className="home-today">
                      <MiniCard size={64} />
                      <div style={{ minWidth: 0 }}>
                        <p className="z0098fd mono-xl"><WriteIn text={inr(card.minimumDue)} delay={450} /></p>
                        <p className="z0098fd t-subhead-m">HDFC card minimum · due today</p>
                      </div>
                    </div>
                    <p className="z002535 t-subhead c2">Paying today keeps a late mark off your report</p>
                    <div className="home-actions">
                      <Link className="zd2dc0a btn bp" href="/actions?sheet=pay">Pay {inr(card.minimumDue)}</Link>
                      <button className="z07e4c9 ib" type="button" onClick={snooze} aria-label="Remind me later"><CalendarIcon /></button>
                    </div>
                  </div>
                ) : (
                  <div className="z20303a card hero" role="status">
                    <MiniCard size={64} />
                    <div style={{ flex: 1 }}>
                      <p className="t-headline">HDFC minimum paid</p>
                      <p className="zf005b8 mono-s c2">{inr(card.minimumDue)} · {dayMonth(TODAY)}</p>
                    </div>
                    <Stamp word="PAID" land delay={400} />
                  </div>
                )}
              </section>
              <section className="z031404 in" aria-label="This week">
                <div className="home-week-head">
                  <h2 className="t-title2">This week</h2>
                  <p className="home-streak"><span className="zce31f5 mono-l">{missed ? 0 : plan.streakDays}</span><span className="t-subhead c2">day streak</span></p>
                </div>
                <div className="z6f83e5 card">
                  <WeekStrip days={days} selected={selDay} onSelect={setSelDay} />
                  <p className="z55ea80 t-subhead-m" aria-live="polite">{days[selDay].name} · {days[selDay].note}</p>
                  <WeekLegend />
                  <div className="home-ruler">
                    <div className="ruler" role="img" aria-label={`Day ${plan.statement.day} of ${plan.statement.of} in this statement cycle`}>
                      <i style={{ width: `${(plan.statement.day / plan.statement.of) * 100}%` } as CSSProperties} />
                    </div>
                    <div className="home-ruler-l t-subhead c2"><span>Day {plan.statement.day} of {plan.statement.of}</span><span>Statement in {plan.statement.nextInDays} days</span></div>
                  </div>
                </div>
              </section>
              <section className="zc61268 in" aria-label="Your plan">
                <h2 className="zfa3e1c t-title2">Your plan</h2>
                <Link className="z1025f0 card tap" href="/recovery">
                  <Ring size={56} value={phaseDone} total={phase1.total} label={`${phaseDone} of ${phase1.total} done`}>
                    <span className="mono-s">{phaseDone}/{phase1.total}</span>
                  </Ring>
                  <span style={{ flex: 1 }}>
                    <span className="z96ce7e t-headline">{phase1.title}</span>
                    <span className="z4738a1 t-subhead c2">Phase {phase1.n} · {phaseDone} of {phase1.total} tasks done</span>
                  </span>
                  <Chevron />
                </Link>
              </section>
            </>
          )}
        </div>
      </div>
      {snoozed ? (
        <Toast icon={<CalendarIcon />} action="Undo" onAction={() => { setSnoozed(false); app.snooze(null); }}>
          We&apos;ll remind you at 6 pm
        </Toast>
      ) : null}
    </Screen>
  );

}
