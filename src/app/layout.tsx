import type { Metadata } from 'next';
import '../../assets/styles/main.scss';

export const metadata: Metadata = {
  title: 'Proposal Viewer',
  description: '제안서 포트폴리오 뷰어',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
