import type { Metadata } from 'next';
import { PhaseComplete } from '@/components/screens/PhaseComplete';

export const metadata: Metadata = { title: 'Phase 1 done · CredCare' };

export default function Page() {
  return <PhaseComplete />;
}
