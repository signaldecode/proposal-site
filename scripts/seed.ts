/**
 * 기존 proposals.json 데이터를 Supabase로 마이그레이션하는 스크립트
 *
 * 사용 전 준비:
 * 1. Supabase 프로젝트 생성 (https://supabase.com)
 * 2. 아래 SQL로 테이블 생성:
 *
 *    CREATE TABLE proposals (
 *      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *      slug TEXT UNIQUE NOT NULL,
 *      section TEXT NOT NULL,
 *      title TEXT NOT NULL,
 *      summary TEXT NOT NULL,
 *      category TEXT NOT NULL,
 *      sub_category TEXT NOT NULL,
 *      pdf_url TEXT NOT NULL,
 *      thumb_src TEXT NOT NULL,
 *      thumb_alt TEXT NOT NULL,
 *      pages JSONB NOT NULL DEFAULT '[]',
 *      created_at TIMESTAMPTZ DEFAULT now(),
 *      updated_at TIMESTAMPTZ DEFAULT now()
 *    );
 *
 * 3. Storage에 'proposals' 버킷 생성 (Public 버킷으로 설정)
 * 4. .env.local 에 환경변수 설정
 *
 * 실행:
 *   npx tsx scripts/seed.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

config({ path: path.join(__dirname, '..', '.env.local','.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('환경변수를 설정해주세요:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface ProposalJson {
  slug: string;
  section: string;
  title: string;
  summary: string;
  category: string;
  subCategory: string;
  pdf: string;
  thumb: { src: string; alt: string };
  pages: { src: string; alt: string }[];
}

async function main() {
  const jsonPath = path.join(__dirname, '..', 'src', 'data', 'proposals.json');
  const proposals: ProposalJson[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  console.log(`${proposals.length}개 제안서 마이그레이션 시작...\n`);

  for (const p of proposals) {
    console.log(`[${p.slug}] 처리 중...`);

    // Upload PDF
    const pdfLocalPath = path.join(__dirname, '..', 'public', p.pdf);
    if (!fs.existsSync(pdfLocalPath)) {
      console.warn(`  PDF 파일 없음: ${pdfLocalPath}, 건너뜀`);
      continue;
    }

    const pdfBuffer = fs.readFileSync(pdfLocalPath);
    const pdfStoragePath = `${p.slug}/document.pdf`;

    const { error: pdfError } = await supabase.storage
      .from('proposals')
      .upload(pdfStoragePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (pdfError) {
      console.error(`  PDF 업로드 실패: ${pdfError.message}`);
      continue;
    }

    const pdfUrl = supabase.storage
      .from('proposals')
      .getPublicUrl(pdfStoragePath).data.publicUrl;

    console.log(`  PDF 업로드 완료`);

    // Upload page images
    const pages: { src: string; alt: string }[] = [];
    for (let idx = 0; idx < p.pages.length; idx++) {
      const page = p.pages[idx];
      const imgLocalPath = path.join(__dirname, '..', 'public', page.src);
      if (!fs.existsSync(imgLocalPath)) {
        console.warn(`  이미지 없음: ${imgLocalPath}, 건너뜀`);
        continue;
      }

      const imgBuffer = fs.readFileSync(imgLocalPath);
      const imgStoragePath = `${p.slug}/${idx + 1}.png`;

      const { error: imgError } = await supabase.storage
        .from('proposals')
        .upload(imgStoragePath, imgBuffer, {
          contentType: 'image/png',
          upsert: true,
        });

      if (imgError) {
        console.error(`  이미지 업로드 실패: ${imgError.message}`);
        continue;
      }

      const imgUrl = supabase.storage
        .from('proposals')
        .getPublicUrl(imgStoragePath).data.publicUrl;

      pages.push({ src: imgUrl, alt: page.alt });
    }

    console.log(`  이미지 ${pages.length}개 업로드 완료`);

    // Insert into database
    const { error: dbError } = await supabase.from('proposals').upsert(
      {
        slug: p.slug,
        section: p.section,
        title: p.title,
        summary: p.summary,
        category: p.category,
        sub_category: p.subCategory,
        pdf_url: pdfUrl,
        thumb_src: pages[0]?.src ?? '',
        thumb_alt: p.thumb.alt,
        pages,
      },
      { onConflict: 'slug' },
    );

    if (dbError) {
      console.error(`  DB 저장 실패: ${dbError.message}`);
      continue;
    }

    console.log(`  DB 저장 완료\n`);
  }

  console.log('마이그레이션 완료!');
}

main().catch(console.error);
