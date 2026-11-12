'use client';
import { useEffect, useRef, useState } from 'react';
import { dur, haptic } from '@/lib/motion';

type Props = {
  label: string;
  ariaLabel: string;
  /** Fires after a full 600 ms hold. */
  onComplete: () => void;
  /** A tap, a keypress or a screen-reader activation: the caller confirms in a dialog instead. */
  onTap: () => void;
  disabled?: boolean;
  /** Static start state for the audit frames. */
  initial?: 'rest' | 'holding' | 'released';
  className?: string;
};

const TAP_MS = 180;

/**
 * Hold to confirm a money action. A white 22 % fill sweeps left to right and a 3 px bar fills along the bottom
 * over 600 ms; letting go early springs both back (snappy) and says "Released early" for 1.2 s.
 */
export function HoldButton({ label, ariaLabel, onComplete, onTap, disabled, initial = 'rest', className = '' }: Props) {
  const [h, setH] = useState<'0' | '1' | '2' | '3'>(initial === 'holding' ? '3' : initial === 'released' ? '2' : '0');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const relT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const t0 = useRef(0);
  const swallow = useRef(false);

  useEffect(() => () => { clearTimeout(timer.current); clearTimeout(relT.current); }, []);

  const down = (e: React.PointerEvent) => {
    if (disabled || e.button !== 0) return;
    swallow.current = false;
    t0.current = performance.now();
    clearTimeout(relT.current);
    setH('1');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      swallow.current = true;
      setH('0');
      haptic('hold-complete');
      onComplete();
    }, dur.hold);
  };
  const up = () => {
    if (h !== '1') return;
    clearTimeout(timer.current);
    const long = performance.now() - t0.current > TAP_MS;
    swallow.current = long;
    setH(long ? '2' : '0');
    clearTimeout(relT.current);
    relT.current = setTimeout(() => setH('0'), dur.released);
  };
  const click = () => {
    if (disabled) return;
    if (swallow.current) { swallow.current = false; return; }
    setH('0');
    onTap();
  };

  const text = h === '1' || h === '3' ? 'Keep holding' : h === '2' ? 'Released early' : label;
  return (
    <button
      className={`btn bp hold ${className}`.trim()}
      type="button"
      data-h={h}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      onPointerDown={down}
      onPointerUp={up}
      onPointerLeave={up}
      onPointerCancel={up}
      onClick={click}
      onContextMenu={(e) => e.preventDefault()}
    >
      <i aria-hidden="true" />
      <span>{text}</span>
    </button>
  );
}
