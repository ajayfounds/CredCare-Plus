import type { Metadata } from 'next';
import { Verify, type VerifyState } from '@/components/screens/Verify';

export const metadata: Metadata = { title: 'Verify your identity · CredCare' };

const STATES: VerifyState[] = ['default', 'otp', 'fetching', 'done'];

export default async function Page({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  return <Verify key={state} state={STATES.includes(state as VerifyState) ? (state as VerifyState) : 'default'} />;
}
