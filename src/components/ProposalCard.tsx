import Link from 'next/link';
import Image from 'next/image';
import styles from './ProposalCard.module.scss';

interface ProposalCardProps {
  slug: string;
  title: string;
  summary: string;
  thumb: { src: string; alt: string };
}

export default function ProposalCard({ slug, title, summary, thumb }: ProposalCardProps) {
  return (
    <Link href={`/proposals/${slug}`} className={styles.card}>
      <Image
        className={styles.thumb}
        src={thumb.src}
        alt={thumb.alt}
        width={640}
        height={360}
      />
      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.summary}>{summary}</p>
      </div>
    </Link>
  );
}
