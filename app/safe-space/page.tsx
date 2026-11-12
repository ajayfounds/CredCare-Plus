import type { Metadata } from 'next';
import { SafeSpace } from '@/components/screens/SafeSpace';

export const metadata: Metadata = { title: 'Your data is safe · CredCare' };

export default function Page() {
  return <SafeSpace />;
}
