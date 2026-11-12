// Motion tokens from design/tokens.json, typed for JS. CSS keeps using the custom properties.

export const dur = {
  instant: 100,
  fast: 150,
  base: 250,
  enter: 350,
  exit: 200,
  data: 600,
  celebrate: 900,
  hold: 600,
  released: 1200,
  toast: 4000,
  nudge: 900,
} as const;

export const ease = {
  out: [0.22, 1, 0.36, 1],
  io: [0.65, 0, 0.35, 1],
  in: [0.4, 0, 1, 1],
} as const;

export const spring = {
  snappy: { type: 'spring', stiffness: 500, damping: 32 },
  gentle: { type: 'spring', stiffness: 260, damping: 26 },
  stamp: { type: 'spring', stiffness: 420, damping: 18 },
} as const;

/** Gesture thresholds from spec/screens.md. */
export const gesture = {
  swipe: 80,
  stackDrag: 60,
  stackFlick: 0.5,
  sheetDismiss: 120,
  sheetFlick: 0.5,
  edgeBack: 24,
  edgeBackDistance: 80,
  pull: 72,
} as const;

type Haptic = 'press' | 'selection' | 'stamp' | 'hold-complete' | 'paid' | 'error';
const PATTERN: Record<Haptic, number | number[]> = {
  press: 8,
  selection: 4,
  stamp: 16,
  'hold-complete': 16,
  paid: [10, 40, 18],
  error: [24, 40, 24],
};

/** Haptics map from tokens.json → navigator.vibrate where the platform supports it. */
export function haptic(kind: Haptic) {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  // Browsers refuse vibration before the first user gesture.
  const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
  if (ua && !ua.hasBeenActive) return;
  {
    try {
      navigator.vibrate(PATTERN[kind]);
    } catch {
      /* some browsers throw without a user gesture */
    }
  }
}

export function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
