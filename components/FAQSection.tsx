'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { ExamConfig } from '@/lib/predictor/types';
import { getExamFAQs } from '@/lib/predictor/faqs';

interface FAQSectionProps {
  config: ExamConfig;
}

export function FAQSection({ config }: FAQSectionProps) {
  const faqs = getExamFAQs(config);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 mb-2">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently Asked Questions
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Everything You Need to Know About {config.name} Admissions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official JoSAA / MCC counseling guidelines, percentile calculations, and quota allocation rules.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
