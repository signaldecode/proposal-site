import { getSupabase, isSupabaseConfigured } from './supabase';
import type { Proposal } from './types';

interface ProposalRow {
  id: string;
  slug: string;
  section: string;
  title: string;
  summary: string;
  category: string;
  sub_category: string;
  pdf_url: string;
  thumb_src: string;
  thumb_alt: string;
  pages: { src: string; alt: string }[];
  created_at: string;
  updated_at: string;
}

function rowToProposal(row: ProposalRow): Proposal {
  return {
    id: row.id,
    slug: row.slug,
    section: row.section,
    title: row.title,
    summary: row.summary,
    category: row.category,
    subCategory: row.sub_category,
    pdf: row.pdf_url,
    thumb: { src: row.thumb_src, alt: row.thumb_alt },
    pages: row.pages,
  };
}

export async function getAllProposals(): Promise<Proposal[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => rowToProposal(row as ProposalRow));
}

export async function getProposalBySlug(slug: string): Promise<Proposal | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return rowToProposal(data as ProposalRow);
}

export async function getProposalsBySection(section: string): Promise<Proposal[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('section', section)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => rowToProposal(row as ProposalRow));
}
