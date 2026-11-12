import type { CSSProperties, ReactNode } from 'react';

type Props = {
  size: number;
  stroke?: number;
  value: number;
  total: number;
  color?: string;
  label: string;
  children?: ReactNode;
  className?: string;
};

/** Progress ring around a step number; the arc draws in once per session. */
export function Ring({ size, stroke = 4, value, total, color = 'var(--ph1)', label, children, className = '' }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / total);
  return (
    <span className={`ring ${className}`.trim()} role="img" aria-label={label} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true">
        <circle className="rt" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle className="ra" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} strokeDasharray={c.toFixed(1)} strokeDashoffset={off.toFixed(1)} style={{ '--c': c.toFixed(1), stroke: color } as CSSProperties} />
      </svg>
      {children}
    </span>
  );
}
