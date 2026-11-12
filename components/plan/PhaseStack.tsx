'use client';
import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { gesture, haptic } from '@/lib/motion';

export type StackPage = { n: number; title: string; status: string; strip: string; body: ReactNode };

/**
 * The three phases as a wallet-style 3D stack. The two behind peek at 56 / 112 px with a 44 px header strip
 * that is a real button. Drag the top page up past 60 px, or flick faster than 0.5 px/ms, to send it back.
 * Dots mirror the order. Reduced motion: position only (styles/app.css).
 */
export function PhaseStack({ pages, className = '' }: { pages: StackPage[]; className?: string }) {
  const [top, setTop] = useState(0);
  const [dy, setDy] = useState(0);
  const [drag, setDrag] = useState(false);
  const y0 = useRef(0);
  const t0 = useRef(0);
  const count = pages.length;

  const go = (i: number) => { if (i !== top) haptic('press'); setTop(i); };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('a,button') || e.currentTarget.dataset.p !== '0') return;
    t0.current = performance.now();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    y0.current = e.clientY;
    setDrag(true);
    setDy(0);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    setDy(Math.max(-160, Math.min(0, e.clientY - y0.current)));
  };
  const up = () => {
    if (!drag) return;
    const vel = -dy / Math.max(1, performance.now() - t0.current);
    const send = dy < -gesture.stackDrag || (dy < -12 && vel > gesture.stackFlick);
    setDrag(false);
    setDy(0);
    if (send) { haptic('selection'); setTop((top + 1) % count); }
  };

  const state = (i: number) => (i === top ? 'current' : 'not shown');
  return (
    <>
      <div className={`stk ${className}`.trim()}>
        {pages.map((p, i) => {
          const pos = (i - top + count) % count;
          return (
            <div
              key={p.n}
              className={`pg ${drag ? 'drag' : ''}`}
              data-p={pos}
              style={{ '--dy': pos === 0 ? `${dy}px` : '0px' } as CSSProperties}
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
            >
              <i className="edge" style={{ background: `var(--ph${p.n})` }} />
              <button className="strip" type="button" onClick={() => go(i)} aria-label={`Phase ${p.n}, ${p.title}, ${state(i)}`} aria-expanded={pos === 0}>
                <span className="t-headline">Phase {p.n}</span>
                <span className="t-footnote c2">{p.strip}</span>
              </button>
              <div className="pgc" aria-hidden={pos !== 0} inert={pos !== 0}>{p.body}</div>
            </div>
          );
        })}
      </div>
      <div className="sdots" role="group" aria-label="Phases">
        {pages.map((p, i) => (
          <button key={p.n} type="button" aria-label={`Phase ${p.n}, ${p.title}, ${state(i)}`} aria-current={i === top} onClick={() => go(i)}>
            <i />
          </button>
        ))}
      </div>
    </>
  );
}
