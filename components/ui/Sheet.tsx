'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion, useDragControls, useReducedMotion, type PanInfo } from 'motion/react';
import { dur, ease, gesture, spring } from '@/lib/motion';

type Props = {
  open: boolean;
  label: string;
  onClose: () => void;
  children: ReactNode;
};

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/**
 * Bottom sheet. Rises on the gentle spring; drag the grabber down past 120 px, or flick, to dismiss.
 * role=dialog aria-modal, Escape closes, focus moves in and returns to the opener.
 */
export function Sheet({ open, label, onClose, children }: Props) {
  const reduce = useReducedMotion();
  const drag = useDragControls();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    const t = setTimeout(() => ref.current?.focus({ preventScroll: true }), 50);
    return () => { document.removeEventListener('keydown', key); clearTimeout(t); opener?.focus?.({ preventScroll: true }); };
  }, [open, onClose]);

  const end = (_: unknown, info: PanInfo) => {
    if (info.offset.y > gesture.sheetDismiss || info.velocity.y / 1000 > gesture.sheetFlick) onClose();
  };

  const rise = reduce ? { duration: dur.fast / 1000 } : spring.gentle;
  const fall = { duration: dur.exit / 1000, ease: ease.in };
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="scrim"
            className="scrim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: dur.fast / 1000 } }}
            exit={{ opacity: 0, transition: fall }}
          />
          <motion.div
            key="sheet"
            ref={ref}
            tabIndex={-1}
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={reduce ? { opacity: 0 } : { y: '100%' }}
            animate={reduce ? { opacity: 1, transition: rise } : { y: 0, transition: rise }}
            exit={reduce ? { opacity: 0, transition: fall } : { y: '100%', transition: fall }}
            drag="y"
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 1 }}
            dragTransition={{ bounceStiffness: spring.gentle.stiffness, bounceDamping: spring.gentle.damping }}
            onDragEnd={end}
          >
            <div className="grab" aria-hidden="true" onPointerDown={(e) => drag.start(e)}>
              <i />
            </div>
            <button className="ib x" type="button" aria-label="Close" onClick={onClose}>
              <CloseIcon />
            </button>
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
