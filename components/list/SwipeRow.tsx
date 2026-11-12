'use client';
import { useRef, type ReactNode } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, type PanInfo } from 'motion/react';
import { gesture, haptic, spring } from '@/lib/motion';

type Props = {
  className: string;
  onStart: () => void;
  onSnooze: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  children: ReactNode;
};

const LIMIT = 120;

/**
 * A ledger row you can swipe: right past 80 px reveals "Start" on b50 and opens the task, left reveals "Snooze"
 * on n100. Below the threshold it springs back (snappy). A tap does the same as swiping right.
 */
export function SwipeRow({ className, onStart, onSnooze, disabled, ariaLabel, children }: Props) {
  const x = useMotionValue(0);
  const moved = useRef(false);
  const armed = useRef(0);
  const reduce = useReducedMotion();

  const drag = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 6) moved.current = true;
    const side = info.offset.x > gesture.swipe ? 1 : info.offset.x < -gesture.swipe ? -1 : 0;
    if (side !== 0 && side !== armed.current) haptic('selection');
    armed.current = side;
  };
  const end = (_: unknown, info: PanInfo) => {
    armed.current = 0;
    animate(x, 0, reduce ? { duration: 0 } : spring.snappy);
    if (info.offset.x > gesture.swipe) onStart();
    else if (info.offset.x < -gesture.swipe) onSnooze();
  };

  return (
    <div className="swr">
      <span className="swa swl" aria-hidden="true">Start</span>
      <span className="swa swrr" aria-hidden="true">Snooze</span>
      <motion.button
        className={className}
        type="button"
        aria-label={ariaLabel}
        style={{ x }}
        drag={disabled ? false : 'x'}
        dragDirectionLock
        dragConstraints={{ left: -LIMIT, right: LIMIT }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => { moved.current = false; }}
        onDrag={drag}
        onDragEnd={end}
        onClick={() => {
          if (moved.current) { moved.current = false; return; }
          if (!disabled) onStart();
        }}
      >
        {children}
      </motion.button>
    </div>
  );
}
