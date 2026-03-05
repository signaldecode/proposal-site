import { getProposalBySlug } from '@/lib/proposals';
import { notFound } from 'next/navigation';
import ProposalDetailClient from './ProposalDetailClient';

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  const proposal = await getProposalBySlug(slug);
  if (!proposal) notFound();
  return <ProposalDetailClient section={section} proposal={proposal} />;
}
