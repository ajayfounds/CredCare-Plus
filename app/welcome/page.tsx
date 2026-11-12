import type { Metadata } from 'next';
import { Welcome } from '@/components/screens/Welcome';

export const metadata: Metadata = { title: 'Welcome · CredCare' };

export default function Page() {
  return <Welcome />;
}
