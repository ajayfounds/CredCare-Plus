'use client';
import { useState, type CSSProperties, type PointerEvent } from 'react';
import { card } from '@/lib/model';
import { dayMonth, inr, masked } from '@/lib/format';
import { CardFacets } from './CardFacets';
import { EmvChip } from './EmvChip';
import s from './card.module.css';


function Wave() {
  return (
    <svg className="wv" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M8.5 7.5a7 7 0 0 1 0 9M12.5 4.8a11 11 0 0 1 0 14.4M4.8 10.2a3.4 3.4 0 0 1 0 3.6" />
    </svg>
  );
}

/** Card front body, shared by the tilting card and the front face of the flip. */
function Front({ showDue }: { showDue: boolean }) {
  return (
    <>
      <CardFacets field="front" />
      <div className="ccv" aria-hidden="true"><span>PERSONAL</span></div>
      <div className={`ccin ${s.inner}`}>
        <div className={s.top}>
          <span className="cckind">credit</span>
          <span className="ccbrand"><b>{card.bank}</b><span>{card.product}</span></span>
        </div>
        <div className={s.chip}>
          <EmvChip />
          <Wave />
        </div>
        <div className={s.foot}>
          <span className={`mono-m ${s.num}`}>{masked(card.last4)}</span>
          {showDue ? (
            <span className={s.due}>
              <span className={`cckind ${s.label}`}>Minimum due</span>
              <span className={`mono-xl ${s.value}`}>{inr(card.minimumDue)}</span>
            </span>
          ) : null}
        </div>
      </div>
    </>
  );
}

const MAX_TILT = 8;

/**
 * The HDFC card at ISO ID-1 proportions. It tilts up to ±8° toward the pointer and the specular follows.
 * One aria-label carries bank, product, last four and the amount; the facets and chip are hidden.
 */
export function PaymentCard() {
  const [t, setT] = useState({ on: false, rx: 0, ry: 0, sx: 30, sy: 20 });
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' && e.buttons === 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({ on: true, ry: +((px - 0.5) * MAX_TILT * 2).toFixed(1), rx: +((0.5 - py) * MAX_TILT * 2).toFixed(1), sx: Math.round(px * 100), sy: Math.round(py * 100) });
  };
  const rest = () => setT({ on: false, rx: 0, ry: 0, sx: 30, sy: 20 });
  return (
    <div
      className={`cc tilt ${t.on ? 'drag' : ''}`}
      role="img"
      aria-label={`${card.bank} ${card.product} credit card ending ${card.last4}. Minimum due ${inr(card.minimumDue)}`}
      onPointerMove={move}
      onPointerLeave={rest}
      onPointerUp={rest}
      style={{ '--rx': `${t.rx}deg`, '--ry': `${t.ry}deg`, '--sx': `${t.sx}%`, '--sy': `${t.sy}%` } as CSSProperties}
    >
      <Front showDue />
    </div>
  );
}

/** Paid: the card turns over to its PAID back (900 ms, ease-io). */
export function PaidCardFlip() {
  return (
    <div className="cflip" aria-hidden="true">
      <div className="cfi">
        <div className="cc cf"><Front showDue={false} /></div>
        <div className="cc cb2">
          <CardFacets field="back" />
          <div className={`ccin ${s.back}`}>
            <span>
              <span className={`cckind ${s.label}`}>Paid {dayMonth()}</span>
              <span className="mono-xl">{inr(card.minimumDue)}</span>
            </span>
            <span className="stamp cstamp">PAID</span>
          </div>
        </div>
      </div>
    </div>
  );
}
