import type { Metadata } from 'next';
import { Analysis } from '@/components/screens/Analysis';

export const metadata: Metadata = { title: 'Why it dropped · CredCare' };

export default async function Page({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  return <Analysis collapsed={state === 'collapsed'} />;
}
