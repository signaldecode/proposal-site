import Image from 'next/image';
import Link from 'next/link';
import { getAllProposals } from '@/lib/proposals';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './page.module.scss';

const SECTION_LABELS: Record<string, string> = {
  web: '웹/개발',
  marketing: '마케팅',
  seo: 'SEO',
};

export default async function HomePage() {
  const proposals = await getAllProposals();
  const featuredProposals = proposals.slice(0, 3);

  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />

        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <Image
              src="/proposals/logo1.png"
              alt="SignalDecode 로고"
              width={180}
              height={48}
              className={styles.heroLogo}
              priority
            />
            <h1 className={styles.heroHeading}>
              <span className={styles.headingLight}>시장의 신호를 읽고(Signal)</span>
              <span className={styles.headingBold}>
                비즈니스의 성장을 해독(Decode)하다
              </span>
            </h1>

            <p className={styles.heroDesc}>
              시그널디코드는 기술적 한계에 갇히지 않는 마케팅과, 마케팅 전략이 녹아있는
              개발을 지향합니다.
              <br />
              우리는 기업이 마주한 복잡한 문제를 디지털 기술로 풀고,
              <br />그 결과가 실질적인 매출 성장으로 이어지도록 비즈니스를 설계하는{' '}
              <strong>DX 에이전시</strong>입니다.
            </p>

            <div className={styles.heroCta}>
              <Link href="/all" className={styles.btnPrimary}>
                제안서 보기
              </Link>
              <a
                href="https://pf.kakao.com/_axiGhX"
                className={styles.btnSecondary}
                target="_blank"
                rel="noopener noreferrer"
              >
                문의하기
              </a>
            </div>
          </div>
        </div>

        <Image
          src="/proposals/3d.png"
          alt="3D 비주얼"
          width={600}
          height={600}
          className={styles.heroVisual}
          priority
        />

        <div className={styles.scrollIndicator}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ═══ Services ═══ */}
      {/* <section className={styles.services}>
        <div className={styles.servicesInner}>
          <ScrollReveal>
            <h2 className={styles.sectionTitle}>전문 서비스 영역</h2>
            <p className={styles.sectionSubtitle}>
              데이터에 기반한 전략, 기술에 기반한 실행
            </p>
          </ScrollReveal>

          <div className={styles.servicesGrid}>
            {SECTIONS.map(({ label, slug }, i) => {
              const meta = SERVICE_META[slug];
              return (
                <ScrollReveal key={slug} delay={i * 150}>
                  <Link
                    href={`/${slug}/category`}
                    className={styles.serviceCard}
                  >
                    <div className={styles.serviceIcon}>{meta?.icon}</div>
                    <div className={styles.serviceAccent} />
                    <h3 className={styles.serviceTitle}>{label}</h3>
                    <p className={styles.serviceDescription}>
                      {meta?.description}
                    </p>
                    <span className={styles.serviceLink}>
                      자세히 보기
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* ═══ Featured Proposals ═══ */}
      <section className={styles.proposals}>
        <div className={styles.proposalsInner}>
          <ScrollReveal>
            <div className={styles.proposalsHeader}>
              <h2 className={styles.proposalsTitle}>제안서</h2>
              <Link href="/all" className={styles.proposalsViewAll}>
                전체 보기 &rarr;
              </Link>
            </div>
          </ScrollReveal>

          <div className={styles.proposalsGrid}>
            {featuredProposals.map((p, i) => (
              <ScrollReveal key={p.slug} delay={i * 150}>
                <Link
                  href={`/${p.section}/proposals/${p.slug}`}
                  className={styles.featuredCard}
                >
                  <div className={styles.featuredThumbWrap}>
                    <Image
                      src={p.thumb.src}
                      alt={p.thumb.alt}
                      width={600}
                      height={338}
                      className={styles.featuredThumb}
                    />
                  </div>
                  <div className={styles.featuredBody}>
                    <span className={styles.featuredBadge}>
                      {SECTION_LABELS[p.section] ?? p.section}
                    </span>
                    <h3 className={styles.featuredTitle}>{p.title}</h3>
                    <p className={styles.featuredSummary}>{p.summary}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow} />
        <ScrollReveal>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>프로젝트를 함께 시작하세요</h2>
            <p className={styles.ctaDescription}>
              시그널디코드와 함께 비즈니스의 디지털 전환을 시작해보세요.
            </p>
            <a
              href="https://pf.kakao.com/_axiGhX"
              className={styles.ctaButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              문의하기
            </a>
            <p className={styles.ctaSubtext}>
              카카오톡 채널로 간편하게 문의하세요
            </p>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
