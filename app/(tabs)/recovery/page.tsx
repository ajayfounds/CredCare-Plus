import type { Metadata } from 'next';
import { Recovery } from '@/components/screens/Recovery';

export const metadata: Metadata = { title: 'Recovery plan · CredCare' };

export default function Page() {
  return <Recovery />;
}
