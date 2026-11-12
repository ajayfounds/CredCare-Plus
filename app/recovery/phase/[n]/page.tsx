import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Phase } from '@/components/screens/Phase';
import { plan } from '@/lib/data';

export function generateStaticParams() {
  return plan.phases.map((p) => ({ n: String(p.n) }));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  const p = plan.phases.find((x) => String(x.n) === n);
  return { title: p ? `Phase ${p.n}: ${p.title} · CredCare` : 'CredCare' };
}

export default async function Page({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  if (!['1', '2', '3'].includes(n)) notFound();
  return <Phase n={+n as 1 | 2 | 3} />;
}
