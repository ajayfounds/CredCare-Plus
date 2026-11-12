import type { Metadata } from 'next';
import { DataPerms } from '@/components/screens/DataPerms';

export const metadata: Metadata = { title: 'Data permissions · CredCare' };

export default function Page() {
  return <DataPerms />;
}
