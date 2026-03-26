import Image from 'next/image';
import styles from './ProposalViewer.module.scss';

interface PageImage {
  src: string;
  alt: string;
}

interface ProposalViewerProps {
  pages: PageImage[];
}

function optimizeSupabaseImage(src: string): string {
  if (!src.includes('supabase.co')) return src;
  const optimized = src.replace('/object/public/', '/render/image/public/');
  return `${optimized}?width=1920&quality=80&format=origin`;
}

export default function ProposalViewer({ pages }: ProposalViewerProps) {
  return (
    <div className={styles.viewer}>
      {pages.map((page, idx) => (
        <Image
          key={idx}
          className={styles.page}
          src={optimizeSupabaseImage(page.src)}
          alt={page.alt}
          width={1920}
          height={2714}
          priority={idx === 0}
          loading={idx === 0 ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  );
}
