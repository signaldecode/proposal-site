import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'authenticated';
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('proposals')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const body = await request.json();
  const { title, summary, section, category, subCategory, pdfUrl, pages } = body;
  const admin = createAdminClient();

  // Build update object with text fields
  const updateData: Record<string, unknown> = {
    title,
    summary,
    section,
    category,
    sub_category: subCategory,
    updated_at: new Date().toISOString(),
  };

  // If a new PDF was uploaded (client already uploaded to Supabase Storage)
  if (pdfUrl) {
    updateData.pdf_url = pdfUrl;
  }

  // If new page images were uploaded (client already uploaded to Supabase Storage)
  if (pages && pages.length > 0) {
    updateData.pages = pages;
    updateData.thumb_src = pages[0]?.src ?? '';
    updateData.thumb_alt = `${title} 썸네일`;
  }

  const { error } = await admin.from('proposals').update(updateData).eq('slug', slug);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath('/', 'layout');
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const admin = createAdminClient();

  // Delete storage files for this proposal
  const { data: files } = await admin.storage.from('proposals').list(slug);
  if (files && files.length > 0) {
    const filePaths = files.map((f) => `${slug}/${f.name}`);
    await admin.storage.from('proposals').remove(filePaths);
  }

  // Delete database row
  const { error } = await admin.from('proposals').delete().eq('slug', slug);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath('/', 'layout');

  return NextResponse.json({ success: true });
}
