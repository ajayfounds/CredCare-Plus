// The tasks of each phase, as the reference frames list them. Figures come from data.ts.
import { completed, dispute, plan } from './data';
import { causes } from './data';
import { inr } from './format';
import { card, sbiLoan } from './model';
import type { TaskId } from './store';

const util = causes.find((c) => c.utilisation)!.utilisation!;
/** Pay-down needed to bring the card under the target: balance − target × limit. */
export const payDownToTarget = card.balance - (util.target / 100) * card.limit;

export type PhaseTask = {
  title: string;
  /** Detail on the phase page. */
  meta: string;
  /** Short status on the Recovery stack page. */
  short?: string;
  /** The Actions task this opens; completing it there marks it done here. */
  task?: TaskId;
  href?: string;
  done?: string;
  locked?: boolean;
  urgent?: boolean;
  bar?: { used: number; target: number };
};

export const phaseTasks: Record<1 | 2 | 3, PhaseTask[]> = {
  1: [
    { title: `Pay ${card.bank.split(' ')[0]} card minimum`, meta: `${inr(card.minimumDue)} · due today`, short: 'Due today', task: 'pay', href: '/actions?sheet=pay', urgent: true },
    { title: `Set up auto-pay for ${sbiLoan.bank} loan`, meta: 'Takes about 2 minutes', short: '2 min', task: 'autopay', href: '/actions?sheet=autopay' },
    { title: completed[0].title, meta: completed[0].when, done: completed[0].when },
    { title: completed[1].title, meta: completed[1].when, done: completed[1].when },
  ],
  2: [
    { title: `Get ${card.bank.split(' ')[0]} card under ${util.target}% use`, meta: `Now ${util.used}% · pay down ${inr(payDownToTarget)}`, short: `Now ${util.used}%`, bar: { used: util.used, target: util.target } },
    { title: '3 on-time payments in a row', meta: '0 of 3 done', short: '0 of 3 done' },
    { title: 'Upload income proof', meta: 'Unlocks a higher limit later', task: 'upload', href: '/actions?sheet=upload' },
    { title: `Dispute unknown ${dispute.lender.split(' ')[0]} enquiry`, meta: `Flagged by you on ${dispute.enquiryDate.split(' ').slice(0, 2).join(' ')}`, task: 'dispute', href: '/actions?sheet=dispute' },
  ],
  3: [
    { title: `Ask ${card.bank.split(' ')[0]} for a limit increase`, meta: 'After your income proof is accepted', short: 'After income proof', locked: true },
    { title: 'Keep your oldest card open', meta: 'Older accounts strengthen your history', short: 'Builds your history' },
    { title: 'Pause new loan applications', meta: 'Each one adds a hard enquiry' },
  ],
};

/** Recovery stack shows the first two tasks of each phase with their short status. */
export const stackRows = (n: 1 | 2 | 3) =>
  n === 1
    ? [{ ...phaseTasks[1][0], title: `Pay ${card.bank.split(' ')[0]} card minimum` }, { ...phaseTasks[1][1], title: `Set up ${sbiLoan.bank} auto-pay` }]
    : n === 3
      ? [{ ...phaseTasks[3][0], title: `Ask ${card.bank.split(' ')[0]} for a limit increase` }, phaseTasks[3][1]]
      : phaseTasks[2].slice(0, 2);

export const phases = plan.phases;
export const phaseColor = (n: number) => `var(--ph${n})`;
