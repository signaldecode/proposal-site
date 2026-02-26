'use client';

import { useParams } from 'next/navigation';
import CategorySidebar from '@/components/CategorySidebar';
import ProposalGrid from '@/components/ProposalGrid';
import { findSection } from '@/data/categories';
import proposals from '@/data/proposals.json';
import styles from './page.module.scss';

export default function SectionCategoryPage() {
  const { section } = useParams<{ section: string }>();
  const sectionData = findSection(section);
  const sectionProposals = proposals.filter((p) => p.section === section);

  return (
    <div className={styles.layout}>
      <CategorySidebar sectionSlug={section} selectedCategory={null} selectedSub={null} />
      <section className={styles.content}>
        <h1 className={styles.heading}>
          <span className={styles.sectionLabel}>{sectionData?.label ?? section}</span>
          <span className={styles.chevron}>▸</span>
          <span className={styles.subLabel}>전체</span>
        </h1>
        <p className={styles.resultCount}>총 {sectionProposals.length}건</p>
        <ProposalGrid sectionSlug={section} proposals={sectionProposals} />
      </section>
    </div>
  );
}
