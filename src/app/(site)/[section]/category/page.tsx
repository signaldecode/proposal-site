import { getProposalsBySection } from '@/lib/proposals';
import SectionCategoryClient from './SectionCategoryClient';

export default async function SectionCategoryPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const proposals = await getProposalsBySection(section);
  return <SectionCategoryClient section={section} proposals={proposals} />;
}
