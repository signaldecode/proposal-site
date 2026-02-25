import Image from 'next/image';
import styles from './ProposalViewer.module.scss';

interface PageImage {
  src: string;
  alt: string;
}

interface ProposalViewerProps {
  pages: PageImage[];
}

export default function ProposalViewer({ pages }: ProposalViewerProps) {
  return (
    <div className={styles.viewer}>
      {pages.map((page, idx) => (
        <Image
          key={idx}
          className={styles.page}
          src={page.src}
          alt={page.alt}
          width={960}
          height={1358}
        />
      ))}
    </div>
  );
}
