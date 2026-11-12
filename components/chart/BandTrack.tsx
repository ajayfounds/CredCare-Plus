import type { CSSProperties } from 'react';
import { score } from '@/lib/data';

export const bandOf = (v: number) => score.bands.find((b) => v >= b.from && v <= b.to) ?? score.bands[0];
export const posOf = (v: number) => ((v - score.range.min) / (score.range.max - score.range.min)) * 100;

/** Where the score sits on 300–900. The band is named in text as well as colour. */
export function BandTrack({ value, inverse = true }: { value: number; inverse?: boolean }) {
  const band = bandOf(value);
  // The frame labels the poor/fair and fair/good edges only; good is too narrow to carry its own label.
  const ticks = [score.range.min, score.bands[1].from, score.bands[2].from, score.range.max];
  return (
    <>
      <div className="bt" role="img" aria-label={`Score ${value} on a ${score.range.min} to ${score.range.max} scale, in the ${band.label.toLowerCase()} band`}>
        {score.bands.map((b) => (
          <i key={b.key} style={{ flex: b.to - b.from + 1, background: `var(--band-${b.key}${inverse ? '-i' : ''})` }} />
        ))}
        <b style={{ left: `${posOf(value).toFixed(1)}%` } as CSSProperties} />
      </div>
      <div className="bl">{ticks.map((t) => <span key={t}>{t}</span>)}</div>
    </>
  );
}
