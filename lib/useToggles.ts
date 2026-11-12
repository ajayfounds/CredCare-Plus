'use client';
import { useEffect, useRef, useState } from 'react';
import { dur, haptic } from './motion';

const SAVE_MS = 350;

/**
 * Settings switches as the frames run them: the switch shows busy while it saves, then a toast names what
 * changed and offers Undo for 4 s.
 */
export function useToggles<K extends string>(defaults: Record<K, boolean>, names: Record<K, string>) {
  const [vals, setVals] = useState(defaults);
  const [busy, setBusy] = useState<K | null>(null);
  const [toast, setToast] = useState('');
  const last = useRef<[K, boolean] | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const p = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => { clearTimeout(t.current); clearTimeout(p.current); }, []);

  const set = (k: K, val: boolean) => {
    const prev = vals[k];
    setBusy(k);
    haptic('selection');
    clearTimeout(p.current);
    p.current = setTimeout(() => {
      setBusy(null);
      setVals((v) => ({ ...v, [k]: val }));
      setToast(`${names[k]} ${val ? 'on' : 'off'}`);
      last.current = [k, prev];
      clearTimeout(t.current);
      t.current = setTimeout(() => setToast(''), dur.toast);
    }, SAVE_MS);
  };
  const undo = () => {
    clearTimeout(t.current);
    const l = last.current;
    if (l) setVals((v) => ({ ...v, [l[0]]: l[1] }));
    setToast('');
  };
  return { vals, busy, toast, set, undo };
}
