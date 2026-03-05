'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SECTIONS } from '@/data/categories';
import styles from './admin.module.scss';

interface ProposalRow {
  slug: string;
  title: string;
  section: string;
  category: string;
  sub_category: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<ProposalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');

  const filtered = useMemo(() => {
    return proposals.filter((p) => {
      if (sectionFilter && p.section !== sectionFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.slug.toLowerCase().includes(q) || p.title.toLowerCase().includes(q);
      }
      return true;
    });
  }, [proposals, search, sectionFilter]);

  useEffect(() => {
    fetch('/api/admin/proposals')
      .then((res) => res.json())
      .then((data) => {
        setProposals(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(slug: string) {
    if (!confirm(`"${slug}" 제안서를 삭제하시겠습니까?`)) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/admin/proposals/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setProposals((prev) => prev.filter((p) => p.slug !== slug));
      }
    } finally {
      setDeleting(null);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>제안서 관리</h1>
        <div className={styles.headerNav}>
          <Link href="/" className={styles.navLink}>사이트 보기</Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
        </div>
      </div>

      <div className={styles.filterBar}>
        <input
          className={styles.input}
          type="text"
          placeholder="제목 또는 slug 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <select
          className={styles.select}
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          style={{ flex: 'none', width: 'auto' }}
        >
          <option value="">전체 섹션</option>
          {SECTIONS.map((s) => (
            <option key={s.slug} value={s.slug}>{s.label}</option>
          ))}
        </select>
        <Link href="/admin/new" className={styles.addBtn}>
          + 새 제안서 추가
        </Link>
      </div>

      <div className={styles.dashboardHeader}>
        <p style={{ color: '#8b8b9e', fontSize: '0.875rem' }}>
          총 {filtered.length}개의 제안서
          {(search || sectionFilter) && ` (전체 ${proposals.length}개)`}
        </p>
      </div>

      {loading ? (
        <p className={styles.emptyState}>불러오는 중...</p>
      ) : proposals.length === 0 ? (
        <p className={styles.emptyState}>등록된 제안서가 없습니다.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Slug</th>
              <th>제목</th>
              <th>섹션</th>
              <th>카테고리</th>
              <th>등록일</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.slug}>
                  <td>{p.slug}</td>
                  <td>{p.title}</td>
                  <td>{p.section}</td>
                  <td>{p.category} / {p.sub_category}</td>
                  <td>{new Date(p.created_at).toLocaleDateString('ko-KR')}</td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/admin/edit/${p.slug}`} className={styles.editBtn}>
                      수정
                    </Link>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(p.slug)}
                      disabled={deleting === p.slug}
                    >
                      {deleting === p.slug ? '삭제 중...' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </>
  );
}
