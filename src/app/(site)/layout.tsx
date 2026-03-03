import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './layout.module.scss';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
