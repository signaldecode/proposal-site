'use client';

import AllSidebar from '@/components/AllSidebar';
import ProposalGrid from '@/components/ProposalGrid';
import proposals from '@/data/proposals.json';
import styles from './page.module.scss';

export default function AllPage() {
  return (
    <div className={styles.layout}>
      <AllSidebar selectedSection={null} />
      <section className={styles.content}>
        <h1 className={styles.heading}>전체 제안서</h1>
        <p className={styles.resultCount}>총 {proposals.length}건</p>
        <ProposalGrid proposals={proposals} />
      </section>
    </div>
  );
}
