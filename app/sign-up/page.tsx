import type { Metadata } from 'next';
import { SignUp } from '@/components/screens/SignUp';

export const metadata: Metadata = { title: 'Create your account · CredCare' };

export default async function Page({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  return <SignUp key={state} state={state === 'error' ? 'error' : undefined} />;
}
