'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import CategorySidebar from '@/components/CategorySidebar';
import ProposalGrid from '@/components/ProposalGrid';
import { findSection, findCategoryInSection } from '@/data/categories';
import type { Proposal } from '@/lib/types';
import styles from '../page.module.scss';

interface CategorySlugClientProps {
  section: string;
  slug: string;
  allSectionProposals: Proposal[];
}

export default function CategorySlugClient({
  section,
  slug,
  allSectionProposals,
}: CategorySlugClientProps) {
  const searchParams = useSearchParams();
  const sub = searchParams.get('sub');

  const sectionData = findSection(section);
  const category = findCategoryInSection(section, slug);

  const filtered = useMemo(() => {
    let result = allSectionProposals.filter((p) => p.category === slug);
    if (sub) {
      result = result.filter((p) => p.subCategory === sub);
    }
    return result;
  }, [allSectionProposals, slug, sub]);

  return (
    <div className={styles.layout}>
      <CategorySidebar sectionSlug={section} selectedCategory={slug} selectedSub={sub} proposals={allSectionProposals} />
      <section className={styles.content}>
        <h1 className={styles.heading}>
          <span className={styles.sectionLabel}>{sectionData?.label ?? section}</span>
          <span className={styles.chevron}>&#9656;</span>
          {sub ? (
            <>
              <span className={styles.categoryLabel}>{category?.label ?? slug}</span>
              <span className={styles.chevron}>&#9656;</span>
              <span className={styles.subLabel}>{sub}</span>
            </>
          ) : (
            <span className={styles.subLabel}>{category?.label ?? slug}</span>
          )}
        </h1>
        <p className={styles.resultCount}>총 {filtered.length}건</p>
        <ProposalGrid sectionSlug={section} proposals={filtered} />
      </section>
    </div>
  );
}
