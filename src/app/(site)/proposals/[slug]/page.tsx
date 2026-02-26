'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import proposals from '@/data/proposals.json';
import ProposalViewer from '@/components/ProposalViewer';
import styles from './page.module.scss';

function ScrollToTopButton() {
  return (
    <button
      className={styles.scrollTop}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="맨 위로"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}

export default function ProposalDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const proposal = proposals.find((p) => p.slug === slug);
  if (!proposal) return <p className={styles.notFound}>제안서를 찾을 수 없습니다.</p>;

  const category = CATEGORIES.find((c) => c.slug === proposal.category);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className={styles.wrapper}>
      {/* Top: back button + breadcrumb */}
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className={styles.breadcrumb}>
          <Link
            href={`/category/${proposal.category}`}
            className={styles.breadcrumbLink}
          >
            {category?.label ?? proposal.category}
          </Link>
          <span className={styles.breadcrumbSep}>›</span>
          <Link
            href={`/category/${proposal.category}?sub=${encodeURIComponent(proposal.subCategory)}`}
            className={styles.breadcrumbLink}
          >
            {proposal.subCategory}
          </Link>
        </div>
      </div>

      {/* Info: title, summary */}
      <div className={styles.infoArea}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{proposal.title}</h1>
          <button
            className={`${styles.copyButton} ${copied ? styles.copyButtonCopied : ''}`}
            onClick={handleCopyLink}
            title="링크 복사"
          >
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
          {'pdf' in proposal && proposal.pdf && (
            <a
              href={(proposal as { pdf: string }).pdf}
              download
              className={styles.downloadButton}
              title="PDF 다운로드"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          )}
        </div>
        <p className={styles.summary}>{proposal.summary}</p>
      </div>

      {/* Proposal images */}
      <section className={styles.pagesSection}>
        <ProposalViewer pages={proposal.pages} />
      </section>

      {/* Bottom: back to list */}
      <div className={styles.bottomBar}>
        <Link href={`/category/${proposal.category}`} className={styles.backToList}>
          목록으로
        </Link>
      </div>

      {/* Toast */}
      <div className={`${styles.toast} ${copied ? styles.toastVisible : ''}`}>
        복사가 완료되었습니다!
      </div>

      {/* Scroll to top */}
      <ScrollToTopButton />
    </div>
  );
}
