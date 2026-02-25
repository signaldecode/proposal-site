import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import ProposalViewer from '@/components/ProposalViewer';
import proposals from '@/data/proposals.json';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getProposal(slug: string) {
  return proposals.find((p) => p.slug === slug);
}

export async function generateStaticParams() {
  return proposals.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const proposal = getProposal(slug);
  if (!proposal) return {};

  return {
    title: proposal.title,
    description: proposal.summary,
    openGraph: {
      title: proposal.title,
      description: proposal.summary,
      images: [{ url: proposal.thumb.src }],
    },
  };
}

export default async function ProposalDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const proposal = getProposal(slug);
  if (!proposal) notFound();

  return (
    <>
      <section className={styles.hero}>
        <Image
          className={styles.thumb}
          src={proposal.thumb.src}
          alt={proposal.thumb.alt}
          width={200}
          height={113}
        />
        <div className={styles.info}>
          <h1 className={styles.title}>{proposal.title}</h1>
          <p className={styles.summary}>{proposal.summary}</p>
        </div>
      </section>

      <ProposalViewer pages={proposal.pages} />
    </>
  );
}
