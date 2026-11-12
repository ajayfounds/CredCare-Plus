import type { Metadata } from 'next';
import { Splash } from '@/components/screens/Splash';

export const metadata: Metadata = { title: 'CredCare' };

export default function Page() {
  return <Splash />;
}
