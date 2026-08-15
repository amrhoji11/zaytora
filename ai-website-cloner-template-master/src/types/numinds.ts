export interface CategoryItem {
  label: string;
  href: string;
  icon: string;
}

export interface TemplateCard {
  code: string;
  category: string;
  image: string;
  popular?: boolean;
}

export interface FeatureItem {
  title: string;
  description: string;
  isNew?: boolean;
}

export interface QuoteItem {
  text: string;
  rating: number;
}

export interface ReviewItem {
  name: string;
  country: string;
  countryFlag: string;
  date: string;
  title?: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export type CurrencyCode = "SAR" | "USD" | "GBP" | "ILS";

export interface CurrencyOption {
  code: CurrencyCode;
  flag: string;
  price: number;
}
