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
          width={1920}
          height={2714}
          unoptimized // 이미지 최적화 건너뛰고 원본 파일 그대로 표시. 지워도 됨.
        />
      ))}
    </div>
  );
}
