import type { CSSProperties } from 'react';

type Props = {
  word: string;
  tone?: 'ok' | 'brand';
  large?: boolean;
  /** Lands with the slam (scale 1.3 → 1 on the stamp spring). `live` lands every time, not once per session. */
  land?: boolean;
  live?: boolean;
  delay?: number;
  className?: string;
};

/** A record that cleared: rotated −4°, double rule. role=img with the word as its label. */
export function Stamp({ word, tone = 'ok', large, land, live, delay, className = '' }: Props) {
  const cls = ['stamp', land && 'land', tone === 'brand' && 'b', large && 'lg2', live && 'live', className].filter(Boolean).join(' ');
  const label = word.charAt(0) + word.slice(1).toLowerCase();
  return (
    <span className={cls} role="img" aria-label={label} style={delay != null ? ({ '--sd': `${delay}ms` } as CSSProperties) : undefined}>
      {word}
    </span>
  );
}
