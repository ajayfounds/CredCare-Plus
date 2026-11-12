import type { Metadata } from 'next';
import { PersonalInfo } from '@/components/screens/PersonalInfo';

export const metadata: Metadata = { title: 'Personal info · CredCare' };

export default async function Page({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  return <PersonalInfo key={state} state={state === 'error' ? 'error' : undefined} />;
}
