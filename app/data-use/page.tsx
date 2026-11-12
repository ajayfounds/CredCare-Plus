import type { Metadata } from 'next';
import { DataUse } from '@/components/screens/DataUse';

export const metadata: Metadata = { title: 'How we use your data · CredCare' };

export default function Page() {
  return <DataUse />;
}
