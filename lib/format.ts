import { TODAY, inr } from './data';

export { inr };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** "4 Feb" */
export const dayMonth = (d: Date = TODAY) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
/** "4 Feb 2026", receipts only */
export const dayMonthYear = (d: Date = TODAY) => `${dayMonth(d)} ${d.getFullYear()}`;
/** "Wed 4 Feb" */
export const weekdayDayMonth = (d: Date) => `${DAYS[d.getDay()]} ${dayMonth(d)}`;
export const monthLong = (short: string) => MONTHS_LONG[MONTHS.indexOf(short)];

/** "•• 4412", never four dots */
export const masked = (last4: string) => `•• ${last4}`;

/** Typographic minus for figures: "−16" */
export const signed = (n: number) => (n < 0 ? `−${Math.abs(n)}` : n > 0 ? `+${n}` : '0');

/** "minus 31" for screen readers */
export const spokenSigned = (n: number) => (n < 0 ? `minus ${Math.abs(n)}` : n > 0 ? `plus ${n}` : 'no change');

export const pct = (n: number) => `${n}%`;
