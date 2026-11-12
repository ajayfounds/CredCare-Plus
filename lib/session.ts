'use client';
import { useLayoutEffect, useState } from 'react';

/**
 * Entrances run once per session, keyed `cc9-in-<screen>`. Tab screens also record their index so the next tab
 * knows which side it came from (`data-dx`). The server render assumes a first visit; a repeat visit is corrected
 * in a layout effect, before paint.
 */
export function useEntrance(name: string, tab: number | null, mode: 'session' | 'always' = 'session') {
  const [state, setState] = useState<{ first: boolean; dx: '0' | 'l' | 'r' }>({ first: true, dx: '0' });
  useLayoutEffect(() => {
    let first = true;
    let from: number | null = tab;
    try {
      const k = 'cc9-in-' + name;
      first = !sessionStorage.getItem(k);
      sessionStorage.setItem(k, '1');
      const t = sessionStorage.getItem('cc9-tab');
      from = t == null ? tab : +t;
      if (tab != null) sessionStorage.setItem('cc9-tab', String(tab));
    } catch {
      /* private mode: every visit is a first visit */
    }
    const dx = tab == null || from == null || from === tab ? '0' : tab > from ? 'r' : 'l';
    const f = mode === 'always' ? true : first;
    if (!f || dx !== '0') setState({ first: f, dx });
  }, [name, tab, mode]);
  return state;
}

/** Once-per-session flag for one-off hints such as the due-row nudge. */
export function onceThisSession(key: string) {
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, '1');
    return true;
  } catch {
    return false;
  }
}
