import Image from 'next/image';
import { useState } from 'react';
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

function ProposalPage({ page, idx }: { page: PageImage; idx: number }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {!loaded && (
        <div style={{
          width: '100%',
          aspectRatio: '1920/2714',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px',
        }} />
      )}
      <Image
        className={styles.page}
        src={optimizeSupabaseImage(page.src)}
        alt={page.alt}
        width={1920}
        height={2714}
        unoptimized
        priority={idx === 0}
        loading={idx === 0 ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        style={{ display: loaded ? 'block' : 'none' }}
      />
    </div>
  );
}

export default function ProposalViewer({ pages }: ProposalViewerProps) {
  return (
    <div className={styles.viewer}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      {pages.map((page, idx) => (
        <ProposalPage key={idx} page={page} idx={idx} />
      ))}
    </div>
  );
}
