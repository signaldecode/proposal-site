'use client';

import AllSidebar from '@/components/AllSidebar';
import ProposalGrid from '@/components/ProposalGrid';
import type { Proposal } from '@/lib/types';
import styles from './page.module.scss';

interface AllPageClientProps {
  proposals: Proposal[];
}

export default function AllPageClient({ proposals }: AllPageClientProps) {
  return (
    <div className={styles.layout}>
      <AllSidebar selectedSection={null} proposals={proposals} />
      <section className={styles.content}>
        <h1 className={styles.heading}>전체 제안서</h1>
        <p className={styles.resultCount}>총 {proposals.length}건</p>
        <ProposalGrid proposals={proposals} />
      </section>
    </div>
  );
}
