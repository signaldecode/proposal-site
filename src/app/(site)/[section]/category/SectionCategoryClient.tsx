'use client';

import CategorySidebar from '@/components/CategorySidebar';
import ProposalGrid from '@/components/ProposalGrid';
import { findSection } from '@/data/categories';
import type { Proposal } from '@/lib/types';
import styles from './page.module.scss';

interface SectionCategoryClientProps {
  section: string;
  proposals: Proposal[];
}

export default function SectionCategoryClient({ section, proposals }: SectionCategoryClientProps) {
  const sectionData = findSection(section);

  return (
    <div className={styles.layout}>
      <CategorySidebar sectionSlug={section} selectedCategory={null} selectedSub={null} proposals={proposals} />
      <section className={styles.content}>
        <h1 className={styles.heading}>
          <span className={styles.sectionLabel}>{sectionData?.label ?? section}</span>
          <span className={styles.chevron}>&#9656;</span>
          <span className={styles.subLabel}>전체</span>
        </h1>
        <p className={styles.resultCount}>총 {proposals.length}건</p>
        <ProposalGrid sectionSlug={section} proposals={proposals} />
      </section>
    </div>
  );
}
