'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SECTIONS } from '@/data/categories';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = false;
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentSection = pathname.split('/')[1] || null;
  const activeSection = SECTIONS.find((s) => s.slug === hoveredSection);

  // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // 모바일 메뉴 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className={styles.wrapper}>
      <header className={`${styles.navbar} ${isHome ? styles.dark : styles.light}`}>
        <Link href="/all" className={styles.logo}>
          <Image
            className={styles.logoImage}
            src={isHome ? '/proposals/logo1.png' : '/proposals/logo.png'}
            alt="SignalDecode 로고"
            width={180}
            height={48}
            priority
          />
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav
          className={styles.nav}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div className={styles.navLinks}>
            <Link
              href="/all"
              className={`${styles.navLink} ${currentSection === 'all' ? styles.navLinkActive : ''}`}
              onMouseEnter={() => setHoveredSection(null)}
            >
              전체보기
            </Link>
            {SECTIONS.map(({ label, slug }) => (
              <Link
                key={slug}
                href={`/${slug}/category`}
                className={`${styles.navLink} ${currentSection === slug ? styles.navLinkActive : ''}`}
                onMouseEnter={() => setHoveredSection(slug)}
                onClick={() => setHoveredSection(null)}
              >
                {label}
              </Link>
            ))}
          </div>

          <div
            className={`${styles.megaDropdown} ${
              activeSection ? styles.megaDropdownOpen : ''
            }`}
          >
            {activeSection && (
              <div className={styles.megaInner}>
                <div className={styles.megaSectionTitle}>{activeSection.label}</div>
                <div className={styles.megaColumns}>
                  {activeSection.categories.map(({ label, slug, sub }) => (
                    <div key={slug} className={styles.megaColumn}>
                      <Link
                        href={`/${activeSection.slug}/category/${slug}`}
                        className={styles.megaHeader}
                        onClick={() => setHoveredSection(null)}
                      >
                        {label}
                        <span className={styles.chevron}>›</span>
                      </Link>
                      <ul className={styles.megaList}>
                        {sub.map((subLabel) => (
                          <li key={subLabel}>
                            <Link
                              href={`/${activeSection.slug}/category/${slug}?sub=${encodeURIComponent(subLabel)}`}
                              className={styles.megaItem}
                              onClick={() => setHoveredSection(null)}
                            >
                              {subLabel}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* 데스크톱 문의하기 */}
        <a
          href="https://pf.kakao.com/_axiGhX"
          className={styles.contact}
          target="_blank"
          rel="noopener noreferrer"
        >
          문의하기
        </a>

        {/* 모바일 햄버거 버튼 */}
        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </header>

      {/* 모바일 풀스크린 메뉴 */}
      <div className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayOpen : ''} ${isHome ? styles.dark : styles.light}`}>
        <nav className={styles.mobileNav}>
          <Link
            href="/all"
            className={`${styles.mobileNavLink} ${currentSection === 'all' ? styles.mobileNavLinkActive : ''}`}
          >
            전체보기
          </Link>

          {SECTIONS.map(({ label, slug }) => (
            <Link
              key={slug}
              href={`/${slug}/category`}
              className={`${styles.mobileNavLink} ${currentSection === slug ? styles.mobileNavLinkActive : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

      </div>
    </div>
  );
}
