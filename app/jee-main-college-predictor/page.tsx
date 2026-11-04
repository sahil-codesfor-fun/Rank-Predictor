import { Metadata } from 'next';
import { PredictorDashboard } from '@/components/PredictorDashboard';
import { StructuredData } from '@/components/StructuredData';
import { EXAM_CONFIGS } from '@/lib/predictor/engine';
import { getExamFAQs } from '@/lib/predictor/faqs';

export const metadata: Metadata = {
  title: 'JEE Main 2027 College & Rank Predictor | JoSAA & CSAB NIT, IIIT, GFTI Cutoffs',
  description:
    'Predict your JEE Main 2027 AIR and percentile from expected marks (out of 300). Find eligible NITs, IIITs, and GFTIs with Home State (HS) vs Other State (OS) quota analysis.',
  keywords: [
    'JEE Main Rank Predictor 2027',
    'NIT Cutoff 2027',
    'IIIT Hyderabad closing rank',
    'JoSAA choice filling order',
    'JEE Main marks vs percentile',
  ],
};

export default function JeeMainPage() {
  const examConfig = EXAM_CONFIGS['jee-main'];
  const faqs = getExamFAQs(examConfig);

  return (
    <>
      <StructuredData examConfig={examConfig} faqs={faqs} />
      <PredictorDashboard
        initialExam="jee-main"
        pageTitle="JEE Main 2027 College & Rank Predictor"
        pageSubtitle="Accurate marks-to-percentile forecasting for 1.42M candidates. Filter JoSAA & CSAB admission chances across 32 NITs, 26 IIITs, and top GFTIs."
      />
    </>
  );
}
