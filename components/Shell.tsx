'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gesture, reducedMotion } from '@/lib/motion';
import { tabIndex } from './ui/TabBar';

const ONBOARDING = ['/', '/welcome', '/safe-space', '/data-use', '/sign-in', '/sign-up', '/verify'];

/** Depth decides push vs back: tabs are 1, their sub-pages deeper. Onboarding pages turn on their own. */
function depth(path: string) {
  if (ONBOARDING.includes(path)) return 0;
  if (path === '/analysis') return 2;
  return path.split('/').filter(Boolean).length;
}

export type NavKind = 'push' | 'back' | 'none';

function kindFor(from: string, to: string): NavKind {
  if (from === to) return 'none';
  const a = depth(from);
  const b = depth(to);
  if (a === 0 || b === 0) return 'none';
  if (tabIndex(from) >= 0 && tabIndex(to) >= 0 && a === 1 && b === 1) return 'none';
  return b > a ? 'push' : b < a ? 'back' : 'push';
}

type VT = { finished: Promise<void> };
type DocVT = Document & { startViewTransition?: (cb: () => Promise<void>) => VT };

/**
 * The phone frame. Sub-pages push in from the right while the page behind slides to −30 % with a slight dim;
 * back reverses. Uses the View Transitions API where present, a plain navigation otherwise.
 */
export function Shell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const pending = useRef<(() => void) | null>(null);
  const pathRef = useRef(path);

  useEffect(() => {
    pathRef.current = path;
    pending.current?.();
    pending.current = null;
    const sc = document.getElementById('scroller');
    if (sc) sc.scrollTop = 0;
  }, [path]);

  useEffect(() => {
    const go = (href: string, kind: NavKind) => {
      const doc = document as DocVT;
      if (kind === 'none' || !doc.startViewTransition || reducedMotion()) {
        router.push(href, { scroll: false });
        return;
      }
      document.documentElement.dataset.nav = kind;
      const vt = doc.startViewTransition(() => new Promise<void>((resolve) => {
        pending.current = resolve;
        router.push(href, { scroll: false });
        setTimeout(resolve, 1500);
      }));
      vt.finished.finally(() => { delete document.documentElement.dataset.nav; });
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest('a');
      if (!a || a.target || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.hash && url.pathname === location.pathname) return;
      const kind = kindFor(pathRef.current, url.pathname);
      if (kind === 'none') return;
      e.preventDefault();
      e.stopPropagation();
      go(url.pathname + url.search, kind);
    };

    // Edge-swipe back on every pushed page.
    let sx = 0, sy = 0, tracking = false;
    const phone = document.getElementById('phone');
    const down = (e: PointerEvent) => {
      if (!phone || depth(pathRef.current) < 2) return;
      const left = phone.getBoundingClientRect().left;
      tracking = e.clientX - left < gesture.edgeBack;
      sx = e.clientX; sy = e.clientY;
    };
    const up = (e: PointerEvent) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - sx, dy = Math.abs(e.clientY - sy);
      if (dx > gesture.edgeBackDistance && dy < dx) {
        const parts = pathRef.current.split('/').filter(Boolean);
        const parent = pathRef.current === '/analysis' ? '/home' : '/' + parts.slice(0, -1).join('/');
        go(parent.startsWith('/recovery/phase') ? '/recovery' : parent, 'back');
      }
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('pointerdown', down, true);
    document.addEventListener('pointerup', up, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('pointerdown', down, true);
      document.removeEventListener('pointerup', up, true);
    };
  }, [router]);

  return (
    <div className="page">
      <div className="phone" id="phone">
        <div className="scroller" id="scroller">{children}</div>
      </div>
    </div>
  );
}
