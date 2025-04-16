export interface PolicyPage {
  id: string;
  title: string;
  content: string;
  lastUpdated: Date;
  slug: 'faq' | 'privacy-policy' | 'shipping-policy' | 'return-policy';
  faqItems?: FAQItem[];
}

export interface PolicyPageInput {
  title: string;
  content: string;
  slug: 'faq' | 'privacy-policy' | 'shipping-policy' | 'return-policy';
  faqItems?: FAQItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
} 