import styles from './admin.module.scss';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.adminRoot}>{children}</div>;
}
