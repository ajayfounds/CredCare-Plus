// Typed views over the mock in data.ts. data.ts stays the API boundary; this only narrows its shapes.
import { accounts } from './data';

const c = accounts.find((a) => a.kind === 'credit')!;

export const card = {
  id: c.id,
  bank: c.bank,
  product: c.product,
  last4: c.last4!,
  balance: c.balance!,
  limit: c.limit!,
  usedPct: c.usedPct!,
  minimumDue: c.minimumDue!,
  dueLabel: c.dueLabel!,
  status: c.status,
};

export const loans = accounts
  .filter((a) => a.kind === 'loan')
  .map((a) => ({ id: a.id, bank: a.bank, product: a.product, emi: a.emi!, nextOn: a.nextOn!, autopay: !!a.autopay, status: a.status }));

export const sbiLoan = loans.find((l) => l.id === 'sbi-home')!;
export const bajajLoan = loans.find((l) => l.id === 'bajaj-pl')!;
