import type { Metadata } from 'next';
import { Help } from '@/components/screens/Help';

export const metadata: Metadata = { title: 'Help and support · CredCare' };

export default async function Page({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  return <Help key={state} state={state === 'sent' ? 'sent' : undefined} />;
}
