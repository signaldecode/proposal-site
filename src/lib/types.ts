export interface PageImage {
  src: string;
  alt: string;
}

export interface Proposal {
  id?: string;
  slug: string;
  section: string;
  title: string;
  summary: string;
  category: string;
  subCategory: string;
  pdf: string;
  thumb: PageImage;
  pages: PageImage[];
}
