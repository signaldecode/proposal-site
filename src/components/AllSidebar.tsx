'use client';

import Link from 'next/link';
import { SECTIONS } from '@/data/categories';
import type { Proposal } from '@/lib/types';
import styles from './AllSidebar.module.scss';

interface AllSidebarProps {
  selectedSection: string | null;
  proposals: Proposal[];
}

export default function AllSidebar({ selectedSection, proposals }: AllSidebarProps) {
  const totalCount = proposals.length;

  return (
    <aside className={styles.sidebar}>
      <Link
        href="/all"
        className={`${styles.item} ${!selectedSection ? styles.active : ''}`}
      >
        전체보기
        <span className={styles.count}>({totalCount})</span>
      </Link>

      {SECTIONS.map(({ label, slug }) => {
        const count = proposals.filter((p) => p.section === slug).length;
        return (
          <Link
            key={slug}
            href={`/${slug}/category`}
            className={`${styles.item} ${selectedSection === slug ? styles.active : ''}`}
          >
            {label}
            <span className={styles.count}>({count})</span>
          </Link>
        );
      })}
    </aside>
  );
}
