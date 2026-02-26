'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { findSection } from '@/data/categories';
import proposals from '@/data/proposals.json';
import styles from './CategorySidebar.module.scss';

interface CategorySidebarProps {
  sectionSlug: string;
  selectedCategory: string | null;
  selectedSub: string | null;
}

export default function CategorySidebar({
  sectionSlug,
  selectedCategory,
  selectedSub,
}: CategorySidebarProps) {
  const section = findSection(sectionSlug);
  const sectionCategories = section?.categories ?? [];

  const [openSlugs, setOpenSlugs] = useState<string[]>(
    selectedCategory ? [selectedCategory] : [],
  );

  const { sectionProposals, categoryCount, subCount } = useMemo(() => {
    const filtered = proposals.filter((p) => p.section === sectionSlug);
    const catMap: Record<string, number> = {};
    const subMap: Record<string, number> = {};

    for (const p of filtered) {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
      const key = `${p.category}::${p.subCategory}`;
      subMap[key] = (subMap[key] || 0) + 1;
    }

    return { sectionProposals: filtered, categoryCount: catMap, subCount: subMap };
  }, [sectionSlug]);

  function toggleAccordion(slug: string) {
    setOpenSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  return (
    <aside className={styles.sidebar}>
      

      <Link
        href={`/${sectionSlug}/category`}
        className={`${styles.allButton} ${
          !selectedCategory ? styles.active : ''
        }`}
      >
        전체보기
        <span className={styles.count}>({sectionProposals.length})</span>
      </Link>

      <ul className={styles.list}>
        {sectionCategories.map(({ label, slug, sub }) => {
          const isOpen = openSlugs.includes(slug);
          const isCategoryActive =
            selectedCategory === slug && !selectedSub;
          const catTotal = categoryCount[slug] || 0;

          return (
            <li key={slug} className={styles.item}>
              <button
                className={styles.categoryRow}
                onClick={() => toggleAccordion(slug)}
              >
                <span className={styles.category}>
                  {label}
                  <span className={styles.count}>({catTotal})</span>
                </span>
                <span
                  className={`${styles.chevronBtn} ${
                    isOpen ? styles.chevronOpen : ''
                  }`}
                >
                  ⌵
                </span>
              </button>

              <ul
                className={`${styles.subList} ${
                  isOpen ? styles.subListOpen : ''
                }`}
              >
                <li>
                  <Link
                    href={`/${sectionSlug}/category/${slug}`}
                    className={`${styles.subItem} ${
                      isCategoryActive ? styles.active : ''
                    }`}
                  >
                    전체보기
                  </Link>
                </li>
                {sub.map((subLabel) => {
                  const subTotal = subCount[`${slug}::${subLabel}`] || 0;
                  return (
                    <li key={subLabel}>
                      <Link
                        href={`/${sectionSlug}/category/${slug}?sub=${encodeURIComponent(subLabel)}`}
                        className={`${styles.subItem} ${
                          selectedCategory === slug && selectedSub === subLabel
                            ? styles.active
                            : ''
                        }`}
                      >
                        {subLabel}
                        <span className={styles.count}>({subTotal})</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
