'use client';
import { useEffect, useLayoutEffect, useId, useRef } from 'react';

type Props = {
  title: string;
  detail?: string;
  cta: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
};

/** The tap / keyboard / screen-reader path for every hold-to-confirm, and the log-out confirm. */
export function ConfirmDialog({ title, detail, cta, onConfirm, onCancel, danger }: Props) {
  const cb = useRef(onCancel);
  useLayoutEffect(() => { cb.current = onCancel; });
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    btn.current?.focus();
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') cb.current(); };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); opener?.focus?.(); };
  }, []);
  return (
    <>
      <div className="dlgs" onClick={onCancel} />
      <div className="dlg" role="alertdialog" aria-modal="true" aria-labelledby={id}>
        <h2 id={id} className="t-title2">{title}</h2>
        {detail ? <p className="t-subhead c2 dlg-detail">{detail}</p> : null}
        <button ref={btn} className={`btn ${danger ? 'bd-danger bs' : 'bp'} dlg-cta`} type="button" onClick={onConfirm}>{cta}</button>
        <button className="btn bg" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </>
  );
}
