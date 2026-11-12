'use client';
import Link from 'next/link';
import './phase.css';
import { Screen } from '@/components/Screen';
import { BackIcon } from '@/components/screens/Analysis';
import { Ring } from '@/components/ui/Ring';
import { Chevron } from '@/components/ui/Toast';
import { plan } from '@/lib/data';
import { phaseColor, phaseTasks, type PhaseTask } from '@/lib/plan';
import { useApp } from '@/lib/store';

const ROOT = { 1: 'z6e1397', 2: 'z8573a5', 3: 'za66b6f' } as const;
const Mark = ({ kind }: { kind: 'ok' | 'wn' | '' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    {kind === 'ok' ? <path d="m8 12 3 3 5-6" /> : kind === 'wn' ? <path d="M12 7v5l3 2" /> : null}
  </svg>
);
const Lock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--n600)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-label="Locked" role="img">
    <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

function Row({ t, done }: { t: PhaseTask; done: boolean }) {
  const kind = done || t.done ? 'ok' : t.urgent ? 'wn' : '';
  const body = (
    <>
      <span className={`mk ${kind}`}><Mark kind={kind} /></span>
      <div>
        <p className="tt">{t.title}</p>
        <p className="mt">{done ? 'Done · today' : t.meta}</p>
        {t.bar && !done ? (
          <div className="zd9a2f8 trk" role="img" aria-label={`${t.bar.used}% used, target under ${t.bar.target}%`}>
            <i style={{ width: `${t.bar.used}%`, background: 'var(--er600)' }} />
            <b className="ph-notch" style={{ left: `${t.bar.target}%` }} />
          </div>
        ) : null}
      </div>
      {t.locked ? <Lock /> : t.href && !done ? <Chevron /> : <span />}
    </>
  );
  return t.href && !done ? <Link className="lr" href={t.href}>{body}</Link> : <div className="lr">{body}</div>;
}

export function Phase({ n }: { n: 1 | 2 | 3 }) {
  const app = useApp();
  const p = plan.phases[n - 1];
  const tasks = phaseTasks[n];
  const isDone = (t: PhaseTask) => !!t.task && app.isDone(t.task);
  const done = p.done + tasks.filter(isDone).length;
  const when = p.status === 'now' ? 'current' : `starts in ${p.startsInDays} days`;
  const next = tasks.find((t) => t.href && !isDone(t) && !t.done);
  const cta = n === 1
    ? (next ? <Link className="z062d4a btn bp" href={next.href!}>Next up: {next.title.replace(' card minimum', ' minimum').replace(/^Pay/, 'pay').replace(/^Set/, 'set')}</Link> : <Link className="z062d4a btn bp" href="/recovery/phase-complete">See what changes next</Link>)
    : n === 2
      ? <Link className="z062d4a btn bp" href={next?.href ?? '/actions'}>Start early: {(next?.title ?? 'Upload income proof').charAt(0).toLowerCase() + (next?.title ?? 'Upload income proof').slice(1)}</Link>
      : <><button className="z062d4a btn bp" type="button" aria-disabled="true">Starts in {p.startsInDays} days</button><p className="why">Opens on day {p.window.split('–')[0]} of your plan</p></>;
  const tip = {
    1: `${p.outcome}.`,
    2: `${p.outcome}. You can start the last two tasks early.`,
    3: `${p.outcome}. Keep the habits from phase 2 going.`,
  }[n];

  return (
    <Screen name={`V9Phase${n}`} scope="phase" ent="none" className={ROOT[n]}>
      <div className="ph-head">
        <Link className="ib" href="/recovery" aria-label="Back to plan"><BackIcon /></Link>
        <p className="z7023da t-headline">Phase {n} of {plan.phases.length}</p>
        <span />
      </div>
      <div className="ph-ring">
        <Ring size={72} stroke={5} value={done} total={p.total} color={phaseColor(n)} label={`${done} of ${p.total} done`}>
          <span className="mono-m">{done}/{p.total}</span>
        </Ring>
      </div>
      <h1 className="zb0043e t-title2">{p.title}</h1>
      <p className="za18ac8 t-subhead c2">{p.window} · {when}</p>
      <div className="ph-sec">
        <h2 className="t-headline">Action plan</h2>
        <p className="t-footnote c3">{done} of {p.total} done</p>
      </div>
      <div className="lg hero cascade">
        {tasks.map((t) => <Row key={t.title} t={t} done={isDone(t)} />)}
      </div>
      <p className="z062d4a tip">{tip}</p>
      {cta}
    </Screen>
  );
}
