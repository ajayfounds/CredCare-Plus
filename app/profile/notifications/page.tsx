import type { Metadata } from 'next';
import { Notifications } from '@/components/screens/Notifications';

export const metadata: Metadata = { title: 'Notifications · CredCare' };

export default function Page() {
  return <Notifications />;
}
