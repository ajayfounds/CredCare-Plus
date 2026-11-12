'use client';
import type { ReactNode } from 'react';
import { useEntrance } from '@/lib/session';

type Props = {
  /** Session key for the once-per-session entrance, e.g. "V9Home". */
  name: string;
  /** Scope class suffix: `s-<scope>` matches the screen's ported stylesheet. */
  scope: string;
  /** Tab index for the directional slide, or null for a pushed page. */
  tab?: number | null;
  ent?: 'on' | 'none';
  mode?: 'session' | 'always';
  className?: string;
  label?: string;
  children: ReactNode;
};

/** The `.r` root every reference frame is built on: owns the entrance and tab-slide flags. */
export function Screen({ name, scope, tab = null, ent = 'on', mode = 'session', className = '', label, children }: Props) {
  const { first, dx } = useEntrance(name, tab, mode);
  return (
    <main
      className={`r s-${scope} ${className}`.trim()}
      data-first={first ? '1' : '0'}
      data-dx={dx}
      data-ent={ent}
      aria-label={label}
    >
      {children}
    </main>
  );
}
