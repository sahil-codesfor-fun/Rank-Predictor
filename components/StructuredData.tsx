import React from 'react';
import { ExamConfig } from '@/lib/predictor/types';

interface FAQItem {
  question: string;
  answer: string;
}

interface StructuredDataProps {
  examConfig: ExamConfig;
  faqs: FAQItem[];
}

export function StructuredData({ examConfig, faqs }: StructuredDataProps) {
  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${examConfig.name} College & Rank Predictor 2027`,
    alternateName: `${examConfig.fullName} Admission Predictor`,
    description: `Free, highly accurate ${examConfig.name} Rank and College Admission Predictor with JoSAA/MCC cutoff calibration, Home State Quota filtering, and reservation category multipliers.`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    featureList: [
      'Piecewise Linear Interpolation score-to-rank engine',
      'Empirical volatility buffers (±8% to ±12%)',
      'Home State and Other State quota eligibility checking',
      'OPEN, GEN-EWS, OBC-NCL, SC, ST category multiplier matrix',
      'Side-by-side college comparison drawer',
      'Exportable JoSAA/MCC counselling preference list',
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

