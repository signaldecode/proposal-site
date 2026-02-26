'use client';

import { useState } from 'react';
import ProposalCard from './ProposalCard';
import styles from './ProposalGrid.module.scss';

const PER_PAGE = 4;

interface Proposal {
  slug: string;
  title: string;
  summary: string;
  section?: string;
  thumb: { src: string; alt: string };
}

interface ProposalGridProps {
  sectionSlug?: string;
  proposals: Proposal[];
}

export default function ProposalGrid({ sectionSlug, proposals }: ProposalGridProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(proposals.length / PER_PAGE));
  const paginated = proposals.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (proposals.length === 0) {
    return <p className={styles.empty}>등록된 제안서가 없습니다.</p>;
  }

  return (
    <>
      <ul className={styles.grid}>
        {paginated.map((p) => (
          <li key={p.slug}>
            <ProposalCard
              sectionSlug={sectionSlug ?? p.section ?? 'web'}
              slug={p.slug}
              title={p.title}
              summary={p.summary}
              thumb={p.thumb}
            />
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => { setPage((prev) => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === 1}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`${styles.pageButton} ${n === page ? styles.pageButtonActive : ''}`}
              onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              {n}
            </button>
          ))}
          <button
            className={styles.pageButton}
            onClick={() => { setPage((prev) => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === totalPages}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
