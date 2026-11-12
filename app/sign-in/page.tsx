import type { Metadata } from 'next';
import { SignIn } from '@/components/screens/SignIn';

export const metadata: Metadata = { title: 'Sign in · CredCare' };

export default async function Page({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  return <SignIn key={state} state={state === 'error' ? 'error' : undefined} />;
}
