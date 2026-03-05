'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.scss';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || '로그인에 실패했습니다.');
        return;
      }

      router.push('/admin');
    } catch {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginWrapper}>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <h1 className={styles.loginTitle}>관리자 로그인</h1>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="password">비밀번호</label>
          <input
            id="password"
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="관리자 비밀번호를 입력하세요"
            autoFocus
          />
        </div>

        <button className={styles.submitBtn} type="submit" disabled={loading || !password}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}
