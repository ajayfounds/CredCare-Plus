'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import './actions.css';
import { Screen } from '@/components/Screen';
import { MiniCard } from '@/components/card/MiniCard';
import { PaidCardFlip, PaymentCard } from '@/components/card/PaymentCard';
import { SwipeRow } from '@/components/list/SwipeRow';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { HoldButton } from '@/components/ui/HoldButton';
import { Sheet } from '@/components/ui/Sheet';
import { Stamp } from '@/components/ui/Stamp';
import { CheckIcon, Chevron, InfoIcon, Toast } from '@/components/ui/Toast';
import { causes, completed, dispute, hoursLeftToday, outstandingAfterPay, payFrom, tasks, upload } from '@/lib/data';
import { dayMonthYear, inr, masked } from '@/lib/format';
import { card, loans, sbiLoan } from '@/lib/model';
import { dur, haptic, spring } from '@/lib/motion';
import { useApp, type TaskId } from '@/lib/store';

export type SheetId = 'pay' | 'autopay' | 'upload' | 'dispute';
export type Stage = 'processing' | 'failed' | 'success' | 'uploading' | 'uploadError' | 'submitted' | 'holding' | 'released' | 'toastError';

const CIR = 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20';
const CLK = CIR + 'M12 7v5l3 2';
const OK = CIR + 'm-4 10 3 3 5-6';

const DONE_TITLE: Record<SheetId, string> = {
  pay: `Pay ${card.bank.split(' ')[0]} card minimum`,
  autopay: 'Set up auto-pay for SBI loan',
  upload: 'Upload income proof',
  dispute: 'Dispute submitted to CIBIL',
};
const LABEL: Record<SheetId, string> = {
  pay: `Pay ${card.bank.split(' ')[0]} Credit Card`,
  autopay: 'Set up auto-pay',
  upload: 'Upload income proof',
  dispute: 'Dispute CIBIL error',
};
const PAY = inr(card.minimumDue);
const ordinal = (n: number) => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
const sbiDay = parseInt(sbiLoan.nextOn, 10);
const LAND_MS = 200 + 700;
const PROCESS_MS = 1200;
const UPLOAD_MS = 1300;

type ToastState = { msg: string; undo: TaskId | null; snooze?: boolean } | null;

type Props = { sheet?: SheetId; view?: 'tasks' | 'loans' | 'empty'; stage?: Stage };

export function Actions({ sheet: sheet0, view = 'tasks', stage: stage0 }: Props) {
  const app = useApp();
  const router = useRouter();
  const reduce = useReducedMotion();
  const pre = stage0 === 'holding' || stage0 === 'released' || stage0 === 'toastError';
  const initialSheet: SheetId | null =
    stage0 === 'toastError' ? null
    : stage0 === 'submitted' ? 'dispute'
    : stage0 === 'processing' || stage0 === 'failed' || stage0 === 'success' || stage0 === 'holding' || stage0 === 'released' ? 'pay'
    : stage0 === 'uploading' || stage0 === 'uploadError' ? 'upload'
    : sheet0 ?? null;

  const [tab, setTab] = useState<'tasks' | 'loans'>(view === 'loans' ? 'loans' : 'tasks');
  const [sheet, setSheet] = useState<SheetId | null>(initialSheet);
  const [stage, setStage] = useState<Stage | null>(pre ? null : stage0 ?? null);
  const [landing, setLanding] = useState<TaskId | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [terr, setTerr] = useState(stage0 === 'toastError');
  const [confirm, setConfirm] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [dlg, setDlg] = useState(false);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const later = (k: string, fn: () => void, ms: number) => { clearTimeout(timers.current[k]); timers.current[k] = setTimeout(fn, ms); };
  useEffect(() => { const t = timers.current; return () => Object.values(t).forEach(clearTimeout); }, []);

  const done: Partial<Record<TaskId, number>> = view === 'empty' ? { pay: 4, autopay: 3, upload: 2, dispute: 1 } : app.done;
  const settled = view === 'empty' || app.settled;

  const close = () => {
    if (sheet === 'pay' && stage === 'success') { complete('pay', `Payment of ${PAY} sent`); return; }
    setSheet(null);
    setStage(null);
    setConfirm(false);
    setNudge(false);
  };

  const showToast = (t: ToastState) => { setToast(t); later('toast', () => setToast(null), dur.toast); };

  function complete(id: TaskId, msg: string) {
    setSheet(null);
    setStage(null);
    setLanding(id);
    haptic('stamp');
    showToast({ msg, undo: id });
    later('land', () => { setLanding(null); app.completeTask(id); }, LAND_MS);
  }

  const undo = () => {
    const id = toast?.undo;
    clearTimeout(timers.current.toast);
    if (id) {
      if (landing === id) { clearTimeout(timers.current.land); setLanding(null); }
      else app.undo(id);
    } else if (toast?.snooze) app.snooze(null);
    setToast(null);
  };
  const snooze = (id: SheetId | null) => {
    if (sheet) close();
    if (id) app.snooze(id);
    showToast({ msg: 'We’ll remind you at 6 pm', undo: null, snooze: true });
  };

  const holdDone = () => {
    setDlg(false);
    if (sheet === 'pay') { setStage('processing'); later('pay', () => { setStage('success'); haptic('paid'); }, PROCESS_MS); }
    if (sheet === 'autopay') complete('autopay', 'Auto-pay request sent');
  };
  const startUpload = () => { setStage('uploading'); later('up', () => complete('upload', 'Payslip uploaded'), UPLOAD_MS); };

  const hours = useHoursLeft();
  const todo = tasks.filter((t) => !done[t.id as TaskId]);
  const fresh = tasks
    .filter((t) => done[t.id as TaskId])
    .sort((a, b) => (done[b.id as TaskId] ?? 0) - (done[a.id as TaskId] ?? 0))
    .map((t) => {
      const pend = t.id === 'pay' && !settled;
      return { id: t.id, title: DONE_TITLE[t.id as SheetId], when: pend ? 'Processing · usually under a minute' : 'Done · today', pending: pend, paid: t.id === 'pay' && !pend };
    });
  const doneList = [...fresh, ...completed.map((c, i) => ({ id: 'past' + i, title: c.title, when: c.when, pending: false, paid: c.paid }))];
  const phaseDone = !!(done.pay && done.autopay);
  const autopayOn = !!done.autopay;
  const util = causes[1].utilisation!;

  const holdInitial = stage0 === 'holding' ? 'holding' : stage0 === 'released' ? 'released' : 'rest';
  const hasHold = (sheet === 'pay' && !stage) || sheet === 'autopay';
  const showLater = stage !== 'processing' && stage !== 'uploading' && stage !== 'success' && stage !== 'submitted';

  return (
    <Screen name="V9Actions" scope="actions" tab={2} ent={sheet0 || stage0 || view !== 'tasks' ? 'none' : 'on'}>
      <div className="act-body">
        <h1 className="in t-title1">Actions</h1>
        <div className="z9218c6 seg in" role="tablist" aria-label="Actions">
          <div className="th" style={{ transform: tab === 'tasks' ? 'translateX(0)' : 'translateX(100%)' }} />
          <button role="tab" type="button" aria-selected={tab === 'tasks'} onClick={() => setTab('tasks')}>My tasks</button>
          <button role="tab" type="button" aria-selected={tab === 'loans'} onClick={() => setTab('loans')}>Loans &amp; cards</button>
        </div>
        {tab === 'tasks' ? (
          <LayoutGroup>
            {phaseDone ? (
              <Link className="ze01f12 banner7 tap in" href="/recovery/phase-complete">
                <span className="act-ok"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></svg></span>
                <span>
                  <span className="z96ce7e tt t-subhead-m">Phase 1 done</span>
                  <span className="zc7b7d5 t-footnote">See what changes next</span>
                </span>
                <Chevron stroke="var(--ok700)" />
              </Link>
            ) : null}
            <section className="ze01f12 in" aria-label="To do">
              <div className="act-head">
                <h2 className="t-headline">To do</h2>
                <p className="t-footnote c3" aria-live="polite">{todo.length} left</p>
              </div>
              <div className="lg hero cascade">
                <AnimatePresence initial={false}>
                  {todo.map((t) => {
                    const id = t.id as TaskId;
                    const L = landing === id;
                    const urgent = t.urgent && !L;
                    const cls = ['lr', L ? 'land' : t.urgent ? 'due' : ''].filter(Boolean).join(' ');
                    return (
                      <motion.div key={id} layout={reduce ? false : 'position'} layoutId={'task-' + id} exit={{ opacity: 0 }} transition={spring.gentle}>
                        <SwipeRow
                          className={cls}
                          disabled={L}
                          onStart={() => setSheet(id as SheetId)}
                          onSnooze={() => snooze(id as SheetId)}
                        >
                          <span className={`mk ${L ? 'ok' : t.urgent ? 'wn' : ''}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={L ? OK : t.urgent ? CLK : CIR} /></svg>
                          </span>
                          <span style={{ minWidth: 0 }}>
                            <span className="zac826e tt">{t.title}</span>
                            <span className="z96ce7e mt">
                              {urgent ? <b className="tchip2">{hours == null ? '' : `${hours} h left`}</b> : null}
                              {L ? 'Done · today' : t.sub}
                            </span>
                          </span>
                          {t.amount && !L ? <span className="z0098fd am">{inr(t.amount)}</span> : null}
                          {!L ? <Chevron /> : null}
                          {L && id === 'pay' ? <Stamp word="PAID" land live delay={150} /> : null}
                        </SwipeRow>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {todo.length === 0 ? (
                  <div className="z364469" role="status">
                    <AllDoneArt />
                    <p className="z002535 t-headline">All caught up</p>
                    <p className="zf005b8 t-subhead c2">Nothing else needs you today</p>
                  </div>
                ) : null}
              </div>
            </section>
            <section className="zd3f99e in" aria-label="Completed">
              <h2 className="zfa3e1c t-headline">Completed</h2>
              <div className="z15dbfd lg cascade">
                {doneList.map((c) => (
                  <motion.div key={c.id} className="lr" layout={reduce ? false : 'position'} layoutId={'task-' + c.id} transition={spring.gentle}>
                    <span className="mk ok">
                      {c.pending ? <span className="z065565 spin" aria-hidden="true" /> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></svg>}
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span className="za33fea tt">{c.title}</span>
                      <span className="z96ce7e mt">{c.when}</span>
                    </span>
                    <span>{c.paid ? <Stamp word="PAID" land /> : null}</span>
                  </motion.div>
                ))}
              </div>
            </section>
          </LayoutGroup>
        ) : (
          <section className="z567153 loans" aria-label="Loans and cards">
            <div className="ze01f12 card in loanrow">
              <div className="lh8">
                <MiniCard size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="t-headline">{card.product} credit card</p>
                  <p className="t-subhead c2">{card.bank} · {masked(card.last4)}</p>
                </div>
              </div>
              <div className="lf8"><p className="mono-xl">{inr(card.balance)}</p><p className="t-subhead c2">of {inr(card.limit)}</p></div>
              <div className="z36950e trk" role="img" aria-label={`${card.usedPct}% of ${inr(card.limit)} limit used. Aim under ${util.target}%`}>
                <i style={{ width: `${card.usedPct}%`, background: 'var(--er600)' }} />
                <b className="act-target" style={{ left: `${util.target}%` }} />
              </div>
              <p className="zd43169 t-subhead c2"><b className="z0098fd mono">{card.usedPct}%</b>{` used · aim under ${util.target}%`}</p>
              <div className="act-mt12"><span className="pill p-w">{card.status}</span></div>
            </div>
            {loans.map((l, i) => (
              <div key={l.id} className={`${i === 0 ? 'zd3f99e' : 'zd77e4a'} card in loanrow`}>
                <div className="lh8">
                  <span className="z7b1055" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M2 10l10-7 10 7z" /></svg></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="t-headline">{l.product.charAt(0).toUpperCase() + l.product.slice(1)}</p>
                    <p className="t-subhead c2">{l.bank}</p>
                  </div>
                </div>
                <div className="lf8"><p className="mono-xl">{inr(l.emi)}</p><p className="t-subhead c2">EMI · next on {l.nextOn}</p></div>
                <div className="act-mt12">
                  {l.id === 'sbi-home'
                    ? <span className={`pill ${autopayOn ? 'p-ok' : 'p-n'}`}>{autopayOn ? 'Auto-pay on' : l.status}</span>
                    : <span className="pill p-ok">{l.status}</span>}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      {toast ? (
        <Toast
          className="act-toast"
          icon={<CheckIcon />}
          action={toast.undo || toast.snooze ? 'Undo' : undefined}
          onAction={undo}
        >
          {toast.msg}
        </Toast>
      ) : null}
      {terr ? (
        <Toast tone="alert" icon={<span className="zee8fa9 act-grid"><InfoIcon /></span>} action="Retry" onAction={() => setTerr(false)}>
          Couldn’t send
        </Toast>
      ) : null}
      {dlg ? (
        <ConfirmDialog
          title={sheet === 'autopay' ? `Set up auto-pay of ${inr(sbiLoan.emi)} on the ${ordinal(sbiDay)}?` : `Pay ${PAY} to ${card.bank.split(' ')[0]} ${masked(card.last4)}?`}
          detail={`From ${payFrom.label} ${masked(payFrom.last4)}`}
          cta={sheet === 'autopay' ? 'Set up auto-pay' : `Pay ${PAY}`}
          onConfirm={holdDone}
          onCancel={() => setDlg(false)}
        />
      ) : null}

      <Sheet open={!!sheet} label={sheet ? LABEL[sheet] : ''} onClose={close}>
        {sheet === 'pay' && stage === 'success' ? (
          <>
            <Head title="Payment sent" sub={`${card.bank.split(' ')[0]} usually confirms within a minute`} />
            <PaidCardFlip />
            <div className="zb04ba8 perf" aria-label="Payment receipt">
              <div><p className="t-headline">Receipt</p><p className="t-subhead c2">{card.bank.split(' ')[0]} {card.product} {masked(card.last4)}</p></div>
              <div className="zccddf7 cascade live">
                <KV k="From" v={`${payFrom.label} ${masked(payFrom.last4)}`} />
                <KV k="Date" v={dayMonthYear()} />
                <div className="kv"><span>Minimum due left</span><b className="swap" aria-label={inr(0)}><span aria-hidden="true">{PAY}</span><span aria-hidden="true">{inr(0)}</span></b></div>
                <KV k="Still outstanding" v={inr(outstandingAfterPay)} />
              </div>
            </div>
            <div className="act-pair">
              <button className="btn bs" type="button" onClick={() => complete('pay', `Payment of ${PAY} sent`)}>Done</button>
              <button className="btn bp" type="button" onClick={() => { app.completeTask('pay'); setSheet(null); setStage(null); router.push('/home'); }}>Back to Home</button>
            </div>
          </>
        ) : null}
        {sheet === 'pay' && stage !== 'success' ? (
          <>
            <Head title={LABEL.pay} sub="Paying the minimum today avoids a late fee and keeps your history clean" />
            <PaymentCard />
            <div className="well">
              <KV k="From" v={`${payFrom.label} ${masked(payFrom.last4)}`} />
              <KV k="Outstanding" v={inr(card.balance)} />
              <div className="kv"><span>Due by</span><b className="act-due">{card.dueLabel}</b></div>
            </div>
          </>
        ) : null}
        {sheet === 'autopay' ? (
          <>
            <Head title="Set up auto-pay" sub="Never miss an EMI. We'll set up an auto-debit for your SBI home loan." />
            <div className="well">
              <KV k="From" v={`${payFrom.label} ${masked(payFrom.last4)}`} />
              <KV k="To" v={tasks[1].sub} />
              <KV k="EMI" v={inr(sbiLoan.emi)} />
              <KV k="Debits on" v={`${ordinal(sbiDay)} of every month`} />
            </div>
            <p className="z7023da t-footnote">You'll approve this once in your UPI app</p>
          </>
        ) : null}
        {sheet === 'upload' ? (
          <>
            <Head title="Upload income proof" sub="Your latest payslip helps lenders consider you for a higher limit" />
            {!stage ? (
              <div className="zad67f1" role="group" aria-label="Upload method">
                <Opt icon="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10" onClick={startUpload}>Scan document</Opt>
                <Opt icon="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" onClick={startUpload}>Choose from files</Opt>
              </div>
            ) : null}
            {stage === 'uploading' ? (
              <>
                <div className="file" role="status" aria-live="polite">
                  <span className="upring" role="img" aria-label={`${upload.pct}% uploaded`}>
                    <svg className="rg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle className="z94625f" cx="20" cy="20" r="17.5" strokeWidth="3" />
                      <circle className="zea7716 act-upring" cx="20" cy="20" r="17.5" strokeWidth="3" strokeLinecap="round" strokeDasharray="110" strokeDashoffset={(110 * (1 - upload.pct / 100)).toFixed(1)} />
                    </svg>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8" /></svg>
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="z58e548 t-subhead-m"><span>{upload.file}</span><span>{upload.pct}%</span></span>
                    <span className="z96ce7e t-footnote">{upload.uploadedMB.toFixed(1)} MB of {upload.sizeMB.toFixed(1)} MB</span>
                    <span className="prog" role="progressbar" aria-label="Upload progress" aria-valuenow={upload.pct} aria-valuemin={0} aria-valuemax={100}>
                      <i className={stage0 === 'uploading' ? '' : 'act-upbar'} style={{ transform: `scaleX(${upload.pct / 100})` }} />
                    </span>
                  </span>
                </div>
                <button className="btn bp" type="button" aria-disabled="true" aria-busy="true"><span className="spin" aria-hidden="true" />Uploading</button>
              </>
            ) : null}
            {stage === 'uploadError' ? (
              <>
                <div className="file bad" role="alert">
                  <span className="act-err-ic"><InfoIcon size={20} /></span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="z19fae4 t-subhead-m">{upload.file} · {upload.rejectedSizeMB} MB</span>
                    <span className="z386203 t-footnote">This file is over {upload.maxMB} MB. Choose a smaller PDF or photo.</span>
                  </span>
                </div>
                <button className="btn bp" type="button" onClick={() => setStage(null)}>Choose another file</button>
              </>
            ) : null}
          </>
        ) : null}
        {sheet === 'dispute' && stage === 'submitted' ? (
          <>
            <Head title="Dispute sent" sub="Dispute submitted to CIBIL" />
            <div className="z019b32 well">
              <DisputeRows />
              <span className="act-stamp-pos"><Stamp word="SUBMITTED" tone="brand" large land live className="zbb13db" /></span>
            </div>
            <button className="z002535 btn bp" type="button" onClick={() => complete('dispute', 'Dispute submitted to CIBIL')}>Done</button>
          </>
        ) : null}
        {sheet === 'dispute' && stage !== 'submitted' ? (
          <>
            <Head title="Dispute CIBIL error" sub="You flagged an enquiry you don't recognise. Check the details before you submit." />
            <div className="well"><DisputeRows /></div>
            <label className="cb">
              <input type="checkbox" checked={confirm} onChange={() => { setConfirm(!confirm); setNudge(false); }} />
              <span className="box" aria-hidden="true"><CheckIcon className="s-n0" /></span>
              <span>I didn't apply for this loan. Start a formal review with CIBIL.</span>
            </label>
            <button className="btn bp" type="button" aria-disabled={!confirm} aria-describedby={nudge ? 'dsp-why' : undefined} onClick={() => { if (!confirm) { setNudge(true); haptic('error'); return; } setStage('submitted'); haptic('stamp'); }}>Submit dispute</button>
            {nudge ? <p id="dsp-why" className="zdaff1b t-footnote" role="status">Tick the box to continue</p> : null}
          </>
        ) : null}
        {sheet === 'pay' && stage === 'processing' ? (
          <div className="res" role="status" aria-live="polite">
            <span className="z397deb spin" aria-hidden="true" />
            <p className="zd43169 t-headline">Sending {PAY}</p>
            <p className="t-footnote">This takes a few seconds. You can keep the app open.</p>
          </div>
        ) : null}
        {sheet === 'pay' && stage === 'failed' ? (
          <>
            <div className="err" role="alert">
              <span className="z304f34 act-grid"><InfoIcon size={20} /></span>
              <span><b className="act-block">Payment didn’t go through</b>Your bank declined the request. No money left your account.</span>
            </div>
            <button className="btn bp" type="button" onClick={() => setStage(null)}>Try again</button>
          </>
        ) : null}
        {hasHold ? (
          <>
            <HoldButton
              className="z1138ec"
              label={sheet === 'pay' ? `Hold to pay ${PAY}` : 'Hold to set up auto-pay'}
              ariaLabel={sheet === 'pay' ? `Pay ${PAY}` : 'Set up auto-pay'}
              initial={holdInitial}
              onComplete={holdDone}
              onTap={() => setDlg(true)}
            />
            <p className="why" aria-live="polite">Hold for a moment, or tap to confirm</p>
          </>
        ) : null}
        {showLater ? <button className="btn bg" type="button" onClick={() => snooze(sheet)}>Remind me later</button> : null}
      </Sheet>
    </Screen>
  );
}

function useHoursLeft() {
  const [h, setH] = useState<number | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- device clock is only known on the client
  useEffect(() => setH(hoursLeftToday()), []);
  return h;
}

const Head = ({ title, sub }: { title: string; sub: string }) => (
  <div className="shd"><h2 className="t-title2">{title}</h2><p className="za18ac8 t-subhead">{sub}</p></div>
);
const KV = ({ k, v }: { k: string; v: string }) => <div className="kv"><span>{k}</span><b>{v}</b></div>;
const DisputeRows = () => (
  <>
    <KV k="Lender" v={dispute.lender} />
    <KV k="Enquiry date" v={dispute.enquiryDate} />
    <KV k="Type" v={dispute.type} />
  </>
);
const Opt = ({ icon, onClick, children }: { icon: string; onClick: () => void; children: ReactNode }) => (
  <button className="opt" type="button" onClick={onClick}>
    <span className="oi"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icon} /></svg></span>
    <span style={{ flex: 1 }}>{children}</span>
    <Chevron />
  </button>
);

function AllDoneArt() {
  return (
    <svg width="88" height="88" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <rect className="f-n0 s-n200" x="26" y="16" width="72" height="88" rx="8" transform="rotate(5 62 60)" />
      <rect className="f-n0 s-n200" x="20" y="18" width="80" height="90" rx="8" strokeWidth="1.5" />
      <rect className="f-b600" x="30" y="25" width="30" height="4" rx="2" fillOpacity=".9" />
      {[44, 58, 72, 86].map((y) => <line key={y} className="s-n200" x1="30" x2="90" y1={y} y2={y} />)}
      <rect className="f-n200" x="30" y="35" width="26" height="4" rx="2" />
      <rect className="f-n200" x="74" y="35" width="16" height="4" rx="2" />
      <rect className="f-n200" x="30" y="49" width="34" height="4" rx="2" />
      <rect className="f-n200" x="78" y="49" width="12" height="4" rx="2" />
      <rect className="f-n200" x="30" y="63" width="22" height="4" rx="2" />
      <rect className="f-n200" x="72" y="63" width="18" height="4" rx="2" />
      <g transform="rotate(-8 78 96)">
        <rect className="f-n0 s-b600" x="56" y="84" width="46" height="22" rx="5" strokeWidth="1.5" />
        <rect className="s-b600" x="58.5" y="86.5" width="41" height="17" rx="3.5" fill="none" strokeOpacity=".4" />
        <path className="s-b600" d="m66 95 3 3 6-6" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect className="f-b600" x="79" y="93.5" width="15" height="3" rx="1.5" />
      </g>
    </svg>
  );
}
