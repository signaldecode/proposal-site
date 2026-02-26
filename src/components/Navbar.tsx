'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SECTIONS } from '@/data/categories';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const currentSection = pathname.split('/')[1] || null;
  const activeSection = SECTIONS.find((s) => s.slug === hoveredSection);

  return (
    <div className={styles.wrapper}>
      <header className={`${styles.navbar} ${isHome ? styles.dark : styles.light}`}>
        <Link href="/" className={styles.logo}>
          <Image
            className={styles.logoImage}
            src={isHome ? '/proposals/logo1.png' : '/proposals/logo.png'}
            alt="SignalDecode 로고"
            width={180}
            height={48}
            priority
          />
        </Link>

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

        <a
          href="https://pf.kakao.com/_axiGhX"
          className={styles.contact}
          target="_blank"
          rel="noopener noreferrer"
        >
          문의하기
        </a>
      </header>
    </div>
  );
}
