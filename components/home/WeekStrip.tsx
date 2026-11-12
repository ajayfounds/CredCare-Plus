'use client';
import type { CSSProperties } from 'react';
import { TODAY, week } from '@/lib/data';
import { card } from '@/lib/model';
import { inr, weekdayDayMonth } from '@/lib/format';
import { haptic } from '@/lib/motion';

export type DayState = 'paid' | 'ahead' | 'missed' | 'today' | 'today-paid';

export function weekDays(opts: { paidToday: boolean; missed: boolean }) {
  const base = new Date(TODAY);
  base.setDate(TODAY.getDate() - (week.findIndex((d) => d.state === 'today')));
  return week.map((d, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i);
    const missed = opts.missed && d.state === 'paid';
    const today = d.state === 'today';
    const ok = !missed && (d.state === 'paid' || (today && opts.paidToday));
    let note = d.note;
    if (missed) note = 'No payment recorded';
    if (today) note = `HDFC minimum ${inr(card.minimumDue)} ${opts.paidToday ? 'paid' : 'due today'}`;
    return { ...d, i, today, ok, missed, note, name: weekdayDayMonth(date) };
  });
}

const Tick = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

type Props = { days: ReturnType<typeof weekDays>; selected: number; onSelect: (i: number) => void };

/** Seven days of the statement cycle. Each day is a button; the note below is a live region. */
export function WeekStrip({ days, selected, onSelect }: Props) {
  return (
    <div className="wk" role="group" aria-label="This week">
      {days.map((d) => (
        <button
          key={d.i}
          type="button"
          className={[d.ok ? 'ok' : d.missed ? 'ms' : '', d.today ? 'td' : ''].join(' ').trim() || undefined}
          style={{ '--k': d.i } as CSSProperties}
          aria-pressed={selected === d.i}
          aria-label={`${d.name}, ${d.note}`}
          onClick={() => { haptic('selection'); onSelect(d.i); }}
        >
          <span className="dl">{d.label}</span>
          <span className="mkw">{d.i <= days.findIndex((x) => x.today) ? <Tick /> : null}</span>
          <span className="dd">{d.date}</span>
        </button>
      ))}
    </div>
  );
}

export function WeekLegend() {
  return (
    <p className="wkl wk-legend">
      <span><i style={{ background: 'var(--ok600)' }} />On time</span>
      <span><i style={{ boxShadow: 'inset 0 0 0 1.5px var(--n500)' }} />Ahead</span>
      <span><i style={{ boxShadow: 'inset 0 0 0 1.5px var(--er600)' }} />Missed</span>
    </p>
  );
}
