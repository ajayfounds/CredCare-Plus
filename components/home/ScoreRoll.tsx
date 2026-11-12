import type { CSSProperties } from 'react';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const ROW = 72;

/** The score: each digit is a column that rolls to its value (72 px rows, fig-xxl). */
export function ScoreRoll({ value, className = 'fig-xxl' }: { value: number; className?: string }) {
  const ds = String(value).split('');
  return (
    <>
      <span className={`roll ${className}`} aria-hidden="true">
        {ds.map((d, j) => (
          <span key={j} className="dc" style={{ '--f': d, '--j': j, transform: `translateY(${-ROW * +d}px)` } as CSSProperties}>
            {DIGITS.map((x) => <b key={x}>{x}</b>)}
          </span>
        ))}
      </span>
      <span className="sr">Score {value}</span>
    </>
  );
}

/** Figures that write in character by character (`.wrt`), e.g. the amount on the Today card. */
export function WriteIn({ text, delay, live }: { text: string; delay?: number; live?: boolean }) {
  return (
    <span className={`wrt ${live ? 'live' : ''}`.trim()} style={delay != null ? ({ '--wd': `${delay}ms` } as CSSProperties) : undefined}>
      {text.split('').map((c, j) => <span key={j} style={{ '--j': j } as CSSProperties}>{c}</span>)}
    </span>
  );
}
