import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'authenticated';
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, section, title, summary, category, subCategory, pdfUrl, pages } = body;

    if (!slug || !section || !title || !summary || !category || !subCategory || !pdfUrl || !pages?.length) {
      return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 });
    }

    const admin = createAdminClient();

    // 중복 slug 체크
    const { data: existing } = await admin
      .from('proposals')
      .select('slug')
      .eq('slug', slug)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: '중복된 slug 입니다. 다른 slug를 사용해주세요.' }, { status: 409 });
    }

    const { error: dbError } = await admin.from('proposals').insert({
      slug,
      section,
      title,
      summary,
      category,
      sub_category: subCategory,
      pdf_url: pdfUrl,
      thumb_src: pages[0].src,
      thumb_alt: `${title} 썸네일`,
      pages,
    });

    if (dbError) {
      return NextResponse.json({ error: `DB 저장 실패: ${dbError.message}` }, { status: 500 });
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    console.error('Proposal create error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
