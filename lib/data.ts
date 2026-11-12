// CredCare v9 — every number on every screen. Nothing outside this file may appear in the UI.
// Derived values are computed here, never typed in by hand.

export const TODAY = new Date('2026-02-04T09:00:00+05:30'); // "4 Feb" across the design

export const score = {
  current: 624,
  updated: '2 Feb',
  range: { min: 300, max: 900 },
  bands: [
    { key: 'poor',  from: 300, to: 549, label: 'Poor' },
    { key: 'fair',  from: 550, to: 699, label: 'Fair' },
    { key: 'good',  from: 700, to: 749, label: 'Good' },
    { key: 'great', from: 750, to: 900, label: 'Great' },
  ], // cut-offs are an assumption — confirm with product before launch
  history: [
    { month: 'Sep', year: 2025, value: 708, note: 'No change' },
    { month: 'Oct', year: 2025, value: 708, note: 'No change' },
    { month: 'Nov', year: 2025, value: 708, note: 'No change' },
    { month: 'Dec', year: 2025, value: 671, note: 'Missed EMI' },
    { month: 'Jan', year: 2026, value: 640, note: 'High utilisation' },
    { month: 'Feb', year: 2026, value: 624, note: 'High utilisation' },
  ],
};

export const causes = [
  { points: -37, title: 'Missed EMI',       meta: 'Bajaj Finance · 14 Dec · paid, still on your report', fixHref: '/recovery/phase/1' },
  { points: -47, title: 'High utilisation', meta: 'HDFC Regalia •• 4412 · Jan–Feb',                      fixHref: '/recovery/phase/2',
    utilisation: { used: 82, target: 30, limit: 84000, balance: 68900 } },
];

export const accounts = [
  { id: 'hdfc-regalia', bank: 'HDFC Bank', product: 'Regalia', kind: 'credit' as const, last4: '4412',
    balance: 68900, limit: 84000, usedPct: 82, minimumDue: 15400, dueLabel: 'Today', status: 'Payment due today' },
  { id: 'sbi-home',  bank: 'SBI',           product: 'Home loan',     kind: 'loan' as const,
    emi: 22450, nextOn: '5 Mar',  autopay: false, status: 'Auto-pay off' },
  { id: 'bajaj-pl',  bank: 'Bajaj Finance', product: 'Personal loan', kind: 'loan' as const,
    emi: 6200,  nextOn: '14 Mar', autopay: true,  status: 'All dues clear' },
];

export const payFrom = { label: 'HDFC Savings', last4: '4821' };

export const tasks = [
  { id: 'pay',     title: 'Pay HDFC card',       sub: 'Minimum due', amount: 15400, urgent: true,  opens: 'pay' },
  { id: 'autopay', title: 'Set up auto-pay',     sub: 'SBI home loan EMI',          urgent: false, opens: 'autopay' },
  { id: 'upload',  title: 'Upload income proof', sub: 'Latest payslip',             urgent: false, opens: 'upload' },
  { id: 'dispute', title: 'Dispute CIBIL error', sub: 'Unknown Bajaj Finance enquiry', urgent: false, opens: 'dispute' },
];

export const completed = [
  { title: 'Pay Bajaj Finance overdue',      when: 'Done 28 Jan', paid: true },
  { title: 'Read “How interest adds up”',    when: 'Done 30 Jan', paid: false },
];

export const plan = {
  day: 12, totalDays: 180,
  statement: { day: 12, of: 30, nextInDays: 18 },
  streakDays: 12,
  phases: [
    { n: 1, title: 'Stop the damage',      window: '0–30 days',   status: 'now',    startsInDays: 0,
      done: 2, total: 4, outcome: 'Finishing these within 30 days can stop your score dropping a further 15–20 points' },
    { n: 2, title: 'Build a clean record', window: '30–90 days',  status: 'later',  startsInDays: 18,
      done: 0, total: 4, outcome: 'Lenders want a few clean months in a row before they trust you again' },
    { n: 3, title: 'Grow your score',      window: '90–180 days', status: 'later',  startsInDays: 78,
      done: 0, total: 3, outcome: 'This is where your score starts to climb visibly' },
  ],
};

// Monday-first week of the current statement cycle. 'paid' | 'ahead' | 'missed' | 'today'
export const week = [
  { label: 'M', date: 2, state: 'paid',  note: 'On time · nothing due' },
  { label: 'T', date: 3, state: 'paid',  note: 'On time · nothing due' },
  { label: 'W', date: 4, state: 'today', note: 'HDFC minimum ₹15,400 due today' },
  { label: 'T', date: 5, state: 'ahead', note: 'Ahead' },
  { label: 'F', date: 6, state: 'ahead', note: 'Ahead' },
  { label: 'S', date: 7, state: 'ahead', note: 'Ahead' },
  { label: 'S', date: 8, state: 'ahead', note: 'Ahead' },
];

export const dispute = { lender: 'Bajaj Finance', enquiryDate: '12 Jan 2026', type: 'Personal loan' };
export const upload  = { file: 'Payslip_Jan.pdf', sizeMB: 2.0, uploadedMB: 1.2, pct: 62, maxMB: 5 };

export const factors = [
  { key: 'payments',    label: 'Payments',    weight: 30, note: 'Did you pay on time? The biggest factor' },
  { key: 'utilisation', label: 'Utilisation', weight: 25, note: 'How much of your limit you use. Keep it under 30%' },
  { key: 'age',         label: 'Age and mix', weight: 25, note: 'Older accounts help, and so does a healthy mix of loans' },
  { key: 'enquiries',   label: 'Enquiries',   weight: 20, note: 'Every loan or card application adds a hard enquiry' },
]; // CIBIL does not publish exact weights — these are widely cited estimates, labelled as such in the UI

export const guides = [
  { slug: 'how-credit-scores-work', cat: 'Basics',   mins: 5, title: 'How credit scores actually work', featured: true },
  { slug: 'minimum-payments',       cat: 'Debt',     mins: 3, title: 'The truth about minimum payments' },
  { slug: 'snowball-vs-avalanche',  cat: 'Strategy', mins: 6, title: 'Snowball vs. avalanche: which pays off faster' },
  { slug: 'disputing-errors',       cat: 'Disputes', mins: 4, title: 'Disputing errors on your report' },
  { slug: 'utilisation',            cat: 'Basics',   mins: 4, title: 'Why 30% utilisation matters' },
];

export const user = { name: 'Arjun', phone: '+91 98765 43210', email: 'arjun@example.com', build: '1.0.0 (build 20260202)' };
export const verify = { otpLength: 6, resendSeconds: 24, demoCode: '482193' };

// ---- derived ----
export const outstandingAfterPay = accounts[0].balance! - accounts[0].minimumDue!; // 53,500
export const daysLeftInPlan = plan.totalDays - plan.day;                          // 168
export const deltaVsLastMonth = score.history[5].value - score.history[4].value;  // -16
export const hoursLeftToday = () => Math.max(1, 24 - new Date().getHours());

/** Minimum-payment maths used by the Learn article. 3% a month, minimum 5% of balance or ₹200. */
export function payoff(extraPerMonth: number, principal = 100000) {
  let b = principal, months = 0, interest = 0;
  while (b > 0 && months < 1200) {
    const i = b * 0.03; interest += i; b += i;
    b -= Math.max(0.05 * b, 200) + extraPerMonth;
    months++;
  }
  return { years: months / 12, interest }; // 0 → 15.0 yrs / ₹1,36,142 · 500 → 6.3 yrs / ₹85,969
}

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN');
