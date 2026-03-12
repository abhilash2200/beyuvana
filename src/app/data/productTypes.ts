/**
 * Product and related types. Kept separate from fallbackProducts
 * so components can import types without pulling in the large dataset.
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string[];
}

export interface ActionItem {
  id: number;
  title: string;
  description: string;
  bgColor: string;
  hoverBgColor: string;
  headingColor: string;
  hoverHeadingColor: string;
  paragraphColor: string;
  hoverParagraphColor: string;
}

export interface WhyItem {
  id: number;
  img: string;
  hoverImg?: string;
  title: string;
  desc: string;
  bgColor: string;
  hoverBgColor: string;
  headingColor: string;
  hoverHeadingColor: string;
  paraColor: string;
  hoverParaColor: string;
}

export interface Compare {
  id: number;
  img: string;
  title: string;
  desc: string;
  bgColor: string;
  headingColor: string;
  paraColor: string;
}

export interface CompareProductData {
  leftContent: {
    title: string;
    points: string[];
  };
  rightContent: {
    title: string;
    points: string[];
  };
  image: string;
}

export interface Builder {
  id: number;
  img: string;
  title: string;
  desc: string;
  bgColor: string;
  headingColor: string;
  paraColor: string;
}

export interface Plant {
  id: number;
  img: string;
  title: string;
  description: string;
  bgColor: string;
  headingColor: string;
  paragraphColor: string;
  plusColor: string;
  xColor: string;
}

export interface TabStats {
  value: string;
  description: string;
  source: string;
}

export interface TabExtra {
  title: string;
  description: string;
  source: string;
}

export interface TabItem {
  id: string;
  icon: string;
  label: string;
  description: string;
  img: string;
  stats: TabStats[];
  extra: TabExtra;
  bgColor?: string;
  headingColor?: string;
}

export interface Product {
  id: number;
  name: string;
  tagline?: string;
  description?: string[];
  certificateImg?: string;
  certificateImages?: string[];
  images: string[];
  faq?: FaqItem[];
  customFaq?: FaqItem[];
  actionItems?: ActionItem[];
  whyItems?: WhyItem[];
  compare?: Compare[];
  compareProduct?: CompareProductData;
  builder?: Builder[];
  plants?: Plant[];
  tabItems?: TabItem[];
  design_type?: "GREEN" | "PINK";
}
