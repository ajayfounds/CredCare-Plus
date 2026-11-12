import type { Metadata } from 'next';
import { Privacy } from '@/components/screens/Privacy';

export const metadata: Metadata = { title: 'Privacy and security · CredCare' };

export default function Page() {
  return <Privacy />;
}
