import ProposalGrid from '@/components/ProposalGrid';
import proposals from '@/data/proposals.json';
import styles from './page.module.scss';

export default function HomePage() {
  return (
    <>
      <h1 className={styles.heading}>제안서 목록</h1>
      <ProposalGrid proposals={proposals} />
    </>
  );
}
