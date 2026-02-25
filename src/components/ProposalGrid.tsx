import ProposalCard from './ProposalCard';
import styles from './ProposalGrid.module.scss';

interface Proposal {
  slug: string;
  title: string;
  summary: string;
  thumb: { src: string; alt: string };
}

interface ProposalGridProps {
  proposals: Proposal[];
}

export default function ProposalGrid({ proposals }: ProposalGridProps) {
  return (
    <ul className={styles.grid}>
      {proposals.map((p) => (
        <li key={p.slug}>
          <ProposalCard
            slug={p.slug}
            title={p.title}
            summary={p.summary}
            thumb={p.thumb}
          />
        </li>
      ))}
    </ul>
  );
}
