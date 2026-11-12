import { useId } from 'react';

/** The EMV contact plate, 38×28 at full size. */
export function EmvChip({ width = 38, height = 28 }: { width?: number; height?: number }) {
  const id = useId();
  return (
    <svg className="chipg" width={width} height={height} viewBox="0 0 38 28" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--chip-1)" />
          <stop offset="1" stopColor="var(--chip-2)" />
        </linearGradient>
      </defs>
      <rect x=".5" y=".5" width="37" height="27" rx="4.5" fill={`url(#${id})`} />
      <g stroke="var(--chip-ink)" strokeOpacity=".55" fill="none" strokeWidth="1">
        <rect x="12.5" y="7.5" width="13" height="13" rx="2.5" />
        <path d="M0 7.5h12.5M25.5 7.5H38M0 20.5h12.5M25.5 20.5H38M19 0v7.5M19 20.5V28M12.5 14H0M38 14H25.5" />
      </g>
      <rect x=".5" y=".5" width="37" height="27" rx="4.5" fill="none" stroke="var(--chip-ink)" strokeOpacity=".3" />
    </svg>
  );
}
