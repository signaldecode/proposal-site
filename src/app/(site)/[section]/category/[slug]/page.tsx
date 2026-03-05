import { getProposalsBySection } from '@/lib/proposals';
import CategorySlugClient from './CategorySlugClient';

export default async function SectionCategorySlugPage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  const allSectionProposals = await getProposalsBySection(section);
  return (
    <CategorySlugClient
      section={section}
      slug={slug}
      allSectionProposals={allSectionProposals}
    />
  );
}
