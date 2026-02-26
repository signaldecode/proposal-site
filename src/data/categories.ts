export interface Category {
  label: string;
  slug: string;
  sub: string[];
}

export interface Section {
  label: string;
  slug: string;
  categories: Category[];
}

export const CATEGORIES: Category[] = [
  { label: '법률', slug: 'law', sub: ['노무', '민사', '형사', '부동산', '기타'] },
  { label: '기업', slug: 'corporate', sub: ['매출', '스타트업', 'IR', '사업계획', '기타'] },
  { label: '쇼핑몰', slug: 'shopping', sub: ['의류', '소품', '식품', '뷰티', '기타'] },
  { label: '병원', slug: 'hospital', sub: ['피부과', '치과', '동물병원', '기타'] },
  { label: 'SEO', slug: 'seo', sub: ['키워드 분석', '콘텐츠 전략', '기술 SEO', '기타'] },
  { label: '기타', slug: 'etc', sub: ['교육', '공공기관', '비영리', '기타'] },
];

export const SECTIONS: Section[] = [
  { label: '웹/개발', slug: 'web', categories: CATEGORIES },
  { label: '마케팅', slug: 'marketing', categories: CATEGORIES },
  { label: 'SEO', slug: 'seo', categories: CATEGORIES },
];

export function findSection(sectionSlug: string): Section | undefined {
  return SECTIONS.find((s) => s.slug === sectionSlug);
}

export function findCategoryInSection(
  sectionSlug: string,
  categorySlug: string,
): Category | undefined {
  const section = findSection(sectionSlug);
  return section?.categories.find((c) => c.slug === categorySlug);
}
