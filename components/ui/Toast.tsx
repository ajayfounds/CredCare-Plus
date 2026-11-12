import type { ReactNode } from 'react';

type Props = {
  icon?: ReactNode;
  children: ReactNode;
  action?: string;
  onAction?: () => void;
  tone?: 'status' | 'alert';
  className?: string;
};

/** Toast: 96 px above the tab bar. role=status (alert for errors); the action is a real button. */
export function Toast({ icon, children, action, onAction, tone = 'status', className = '' }: Props) {
  return (
    <div className={`toast ${className}`.trim()} role={tone}>
      {icon ? <span className="ic">{icon}</span> : null}
      {children}
      {action ? <button className="ac" type="button" onClick={onAction}>{action}</button> : null}
    </div>
  );
}

export const CalendarIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export const InfoIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

export const CheckIcon = ({ size = 14, className = 's-n0' }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const Chevron = ({ size = 20, stroke = 'var(--n600)' }: { size?: number; stroke?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
