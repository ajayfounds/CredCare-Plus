import { CardFacets } from './CardFacets';
import { EmvChip } from './EmvChip';

/** The same card object at 48 or 64 px wide (Home Today card, Loans list). */
export function MiniCard({ size, className = '' }: { size: 48 | 64; className?: string }) {
  const chip = size === 64 ? { w: 19, h: 14, left: '11%' } : { w: 14, h: 10, left: '10.5%' };
  return (
    <span className={`cc mini${size} ${className}`.trim()} aria-hidden="true">
      <CardFacets field="mini" />
      <span className="minichip" style={{ left: chip.left }}>
        <EmvChip width={chip.w} height={chip.h} />
      </span>
    </span>
  );
}
