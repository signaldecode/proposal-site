'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import CategorySidebar from '@/components/CategorySidebar';
import ProposalGrid from '@/components/ProposalGrid';
import { CATEGORIES } from '@/data/categories';
import proposals from '@/data/proposals.json';
import styles from '../page.module.scss';

export default function CategorySlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const sub = searchParams.get('sub');

  const category = CATEGORIES.find((c) => c.slug === slug);

  const filtered = useMemo(() => {
    if (!slug) return proposals;
    if (sub) {
      return proposals.filter(
        (p) => p.category === slug && p.subCategory === sub,
      );
    }
    return proposals.filter((p) => p.category === slug);
  }, [slug, sub]);

  return (
    <div className={styles.layout}>
      <CategorySidebar selectedCategory={slug} selectedSub={sub} />
      <section className={styles.content}>
        <h1 className={styles.heading}>
          {sub ? (
            <>
              <span className={styles.categoryLabel}>{category?.label ?? slug}</span>
              <span className={styles.chevron}>▸</span>
              <span className={styles.subLabel}>{sub}</span>
            </>
          ) : (
            category?.label ?? slug
          )}
        </h1>
        <p className={styles.resultCount}>총 {filtered.length}건</p>
        <ProposalGrid proposals={filtered} />
      </section>
    </div>
  );
}
