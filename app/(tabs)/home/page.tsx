import type { Metadata } from 'next';
import { Home, type HomeState } from '@/components/screens/Home';

export const metadata: Metadata = { title: 'Home · CredCare' };

const STATES: HomeState[] = ['default', 'loading', 'done', 'offline', 'refreshing', 'pulling', 'missed'];

export default async function Page({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  return <Home state={STATES.includes(state as HomeState) ? (state as HomeState) : undefined} />;
}
