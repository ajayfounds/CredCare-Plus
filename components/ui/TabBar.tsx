'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { useApp } from '@/lib/store';
import { spring } from '@/lib/motion';
import { haptic } from '@/lib/motion';

export const TABS = ['/home', '/recovery', '/actions', '/learn', '/profile'] as const;

export function tabIndex(path: string) {
  return TABS.findIndex((t) => path === t || path.startsWith(t + '/'));
}

const S = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

function Icon({ i, on }: { i: number; on: boolean }) {
  const w = on ? 2 : 1.75;
  switch (i) {
    case 0:
      return <svg {...S} strokeWidth={w}><path d="M3 10.5 12 3l9 7.5V20a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z" fill={on ? 'currentColor' : 'none'} /></svg>;
    case 1:
      return <svg {...S} strokeWidth={w}><path d="M22 7l-8.5 8.5-5-5L2 17" /><path d="M16 7h6v6" /></svg>;
    case 2:
      return <svg {...S} strokeWidth={w}><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8M13 12h8M13 18h8" /></svg>;
    case 3:
      return (
        <svg {...S} strokeWidth={w}>
          <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" fill={on ? 'currentColor' : 'none'} fillOpacity={on ? 0.22 : undefined} />
          <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" fill={on ? 'currentColor' : 'none'} fillOpacity={on ? 0.22 : undefined} />
        </svg>
      );
    default:
      return (
        <svg {...S} strokeWidth={w}>
          <circle cx="12" cy="8" r="4" fill={on ? 'currentColor' : 'none'} />
          <path d="M4 21a8 8 0 0 1 16 0" fill={on ? 'currentColor' : 'none'} fillOpacity={on ? 0.22 : undefined} />
        </svg>
      );
  }
}

const LABELS = ['Home', 'Recovery', 'Actions', 'Learn', 'Profile'];

/** Docked tab bar. The 24×3 indicator slides between tabs on the gentle spring. */
export function TabBar() {
  const path = usePathname();
  const active = tabIndex(path);
  const { openCount } = useApp();
  const reduce = useReducedMotion();
  return (
    <nav className="tb" aria-label="Tabs">
      <motion.i
        className="pl"
        aria-hidden="true"
        style={{ animation: 'none' }}
        initial={false}
        animate={{ x: `${Math.max(0, active) * 100}%` }}
        transition={reduce ? { duration: 0 } : spring.gentle}
      />
      {TABS.map((href, i) => {
        const on = i === active;
        const badge = i === 2 && openCount > 0;
        return (
          <Link
            key={href}
            className={on ? 'ti on' : 'ti'}
            href={href}
            aria-current={on ? 'page' : undefined}
            aria-label={badge ? `Actions, ${openCount} tasks to do` : undefined}
            onClick={() => haptic('press')}
          >
            {badge ? <i className="dot" aria-hidden="true" /> : null}
            <Icon i={i} on={on} />
            <span>{LABELS[i]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
