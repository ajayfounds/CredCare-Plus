import type { Metadata } from 'next';
import { Profile } from '@/components/screens/Profile';

export const metadata: Metadata = { title: 'Profile · CredCare' };

export default function Page() {
  return <Profile />;
}
