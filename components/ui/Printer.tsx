import type { CSSProperties } from 'react';

type Props = {
  lines: readonly string[];
  /** live: loops while waiting · once: prints and stops · paused: frozen mid-print (static state frames) */
  mode?: 'live' | 'once' | 'paused';
  caption?: string;
};

/** The passbook printer loader. Real waits only. Reduced motion shows the lines already printed. */
export function Printer({ lines, mode = 'live', caption }: Props) {
  return (
    <>
      <div className={`prn ${mode === 'live' ? '' : mode}`.trim()} role="status" aria-live="polite" aria-label={lines.join('. ')}>
        {lines.map((l, k) => (
          <p key={l} style={{ '--k': k } as CSSProperties}>
            <span>{l}</span>
            <i aria-hidden="true">✓</i>
          </p>
        ))}
      </div>
      {caption ? <p className="lbl2">{caption}</p> : null}
    </>
  );
}

export const CIBIL_STEPS = ['Connecting to CIBIL', 'Reading your accounts', 'Updating your plan'] as const;
