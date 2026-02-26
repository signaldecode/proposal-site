'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import CategorySidebar from '@/components/CategorySidebar';
import ProposalGrid from '@/components/ProposalGrid';
import { findSection, findCategoryInSection } from '@/data/categories';
import proposals from '@/data/proposals.json';
import styles from '../page.module.scss';

export default function SectionCategorySlugPage() {
  const { section, slug } = useParams<{ section: string; slug: string }>();
  const searchParams = useSearchParams();
  const sub = searchParams.get('sub');

  const sectionData = findSection(section);
  const category = findCategoryInSection(section, slug);

  const filtered = useMemo(() => {
    let result = proposals.filter(
      (p) => p.section === section && p.category === slug,
    );
    if (sub) {
      result = result.filter((p) => p.subCategory === sub);
    }
    return result;
  }, [section, slug, sub]);

  return (
    <div className={styles.layout}>
      <CategorySidebar sectionSlug={section} selectedCategory={slug} selectedSub={sub} />
      <section className={styles.content}>
        <h1 className={styles.heading}>
          <span className={styles.sectionLabel}>{sectionData?.label ?? section}</span>
          <span className={styles.chevron}>▸</span>
          {sub ? (
            <>
              <span className={styles.categoryLabel}>{category?.label ?? slug}</span>
              <span className={styles.chevron}>▸</span>
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
