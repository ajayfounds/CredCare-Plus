import type { Metadata } from 'next';
import { Learn, type LearnState } from '@/components/screens/Learn';

export const metadata: Metadata = { title: 'Learn · CredCare' };

export default async function Page({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  return <Learn key={state} state={state === 'loading' || state === 'empty' ? (state as LearnState) : 'default'} />;
}
