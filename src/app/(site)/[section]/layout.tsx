import { SECTIONS } from '@/data/categories';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return SECTIONS.map((s) => ({ section: s.slug }));
}

export default async function SectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!SECTIONS.some((s) => s.slug === section)) {
    notFound();
  }
  return <>{children}</>;
}
