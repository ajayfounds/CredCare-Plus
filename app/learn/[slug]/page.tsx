import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Article } from '@/components/screens/Article';
import { guides } from '@/lib/data';

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  return { title: g ? `${g.title} · CredCare` : 'CredCare' };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!guides.some((g) => g.slug === slug)) notFound();
  return <Article slug={slug} />;
}
