import Link from 'next/link';
import styles from './layout.module.scss';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.headerTitle}>
          Proposal Viewer
        </Link>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
}
