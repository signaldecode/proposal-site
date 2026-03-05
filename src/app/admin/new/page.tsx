'use client';

import { useState, useRef, type FormEvent, type DragEvent } from 'react';
import Link from 'next/link';
import { SECTIONS } from '@/data/categories';
import { pdfToImages } from '@/lib/pdf-to-images';
import { uploadFile } from '@/lib/upload-to-supabase';
import styles from '../admin.module.scss';

export default function AdminNewProposalPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [section, setSection] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageBlobs, setPageBlobs] = useState<Blob[]>([]);
  const [pagePreviews, setPagePreviews] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const selectedSection = SECTIONS.find((s) => s.slug === section);
  const selectedCategory = selectedSection?.categories.find((c) => c.slug === category);

  function handleSectionChange(val: string) {
    setSection(val);
    setCategory('');
    setSubCategory('');
  }

  function handleCategoryChange(val: string) {
    setCategory(val);
    setSubCategory('');
  }

  async function handlePdfSelect(file: File) {
    setPdfFile(file);
    setIsConverting(true);
    setError('');

    try {
      const blobs = await pdfToImages(file);
      setPageBlobs(blobs);
      pagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setPagePreviews(blobs.map((b) => URL.createObjectURL(b)));
    } catch (err) {
      setError('PDF 변환에 실패했습니다. 다른 파일을 시도해주세요.');
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') {
      handlePdfSelect(file);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!pdfFile || pageBlobs.length === 0) {
      setError('PDF 파일을 업로드하고 변환이 완료될 때까지 기다려주세요.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Upload PDF directly to Supabase Storage from client
      setUploadProgress('PDF 업로드 중...');
      const pdfUrl = await uploadFile(
        `${slug}/document.pdf`,
        pdfFile,
        'application/pdf',
      );

      // 2. Upload page images directly to Supabase Storage from client
      const pages: { src: string; alt: string }[] = [];
      for (let i = 0; i < pageBlobs.length; i++) {
        setUploadProgress(`이미지 업로드 중... (${i + 1}/${pageBlobs.length})`);
        const imgUrl = await uploadFile(
          `${slug}/${i + 1}.png`,
          pageBlobs[i],
          'image/png',
        );
        pages.push({ src: imgUrl, alt: `${title} ${i + 1}페이지` });
      }

      // 3. Send metadata only to API (no files)
      setUploadProgress('저장 중...');
      const res = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          section,
          title,
          summary,
          category,
          subCategory,
          pdfUrl,
          pages,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || '제안서 등록에 실패했습니다.');
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '서버 연결에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
    }
  }

  if (success) {
    return (
      <>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>제안서 관리</h1>
          <div className={styles.headerNav}>
            <Link href="/admin" className={styles.navLink}>대시보드</Link>
          </div>
        </div>
        <div className={styles.successMessage}>
          <h2>등록 완료!</h2>
          <p>제안서가 성공적으로 등록되었습니다.</p>
          <Link href="/admin" className={styles.addBtn}>대시보드로 돌아가기</Link>
          {' '}
          <Link href="/admin/new" className={styles.navLink} onClick={() => {
            setSuccess(false);
            setSlug('');
            setTitle('');
            setSummary('');
            setPdfFile(null);
            setPageBlobs([]);
            setPagePreviews([]);
          }}>
            새 제안서 추가
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>새 제안서 추가</h1>
        <div className={styles.headerNav}>
          <Link href="/admin" className={styles.navLink}>대시보드</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="slug">Slug (URL 식별자)</label>
            <input
              id="slug"
              className={styles.input}
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.replace(/[^a-z0-9-]/g, ''))}
              placeholder="예: corporate-sales"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="section">섹션</label>
            <select
              id="section"
              className={styles.select}
              value={section}
              onChange={(e) => handleSectionChange(e.target.value)}
              required
            >
              <option value="">섹션 선택</option>
              {SECTIONS.map((s) => (
                <option key={s.slug} value={s.slug}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className={`${styles.inputGroup} ${styles.formFull}`}>
            <label className={styles.label} htmlFor="title">제목</label>
            <input
              id="title"
              className={styles.input}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제안서 제목을 입력하세요"
              required
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.formFull}`}>
            <label className={styles.label} htmlFor="summary">요약</label>
            <textarea
              id="summary"
              className={styles.textarea}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="제안서 요약을 입력하세요"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="category">카테고리</label>
            <select
              id="category"
              className={styles.select}
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              required
              disabled={!section}
            >
              <option value="">카테고리 선택</option>
              {selectedSection?.categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="subCategory">서브카테고리</label>
            <select
              id="subCategory"
              className={styles.select}
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              required
              disabled={!category}
            >
              <option value="">서브카테고리 선택</option>
              {selectedCategory?.sub.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={`${styles.inputGroup} ${styles.formFull}`} style={{ marginTop: '1rem' }}>
          <label className={styles.label}>PDF 파일</label>
          <div
            className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e: DragEvent) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
          >
            {pdfFile ? (
              <div className={styles.fileName}>{pdfFile.name}</div>
            ) : (
              <>PDF 파일을 드래그하거나 클릭하여 업로드</>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePdfSelect(file);
              }}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {isConverting && (
          <div className={styles.convertingBar}>PDF 페이지를 이미지로 변환 중...</div>
        )}

        {pagePreviews.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <label className={styles.label}>변환된 페이지 ({pagePreviews.length}페이지)</label>
            <div className={styles.previewGrid}>
              {pagePreviews.map((url, i) => (
                <div key={i} className={styles.previewItem}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`${i + 1}페이지`} />
                  <div className={styles.previewLabel}>{i + 1}p</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '1.5rem' }}>
          <button
            className={styles.submitBtn}
            type="submit"
            disabled={isSubmitting || isConverting || !pdfFile || pageBlobs.length === 0}
          >
            {isSubmitting ? uploadProgress || '업로드 중...' : '제안서 등록'}
          </button>
          {error && <p className={styles.error} style={{ marginTop: '1rem' }}>{error}</p>}
        </div>
      </form>
    </>
  );
}
