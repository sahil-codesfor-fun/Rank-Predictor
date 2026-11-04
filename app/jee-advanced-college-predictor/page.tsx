import { Metadata } from 'next';
import { PredictorDashboard } from '@/components/PredictorDashboard';
import { StructuredData } from '@/components/StructuredData';
import { EXAM_CONFIGS } from '@/lib/predictor/engine';
import { getExamFAQs } from '@/lib/predictor/faqs';

export const metadata: Metadata = {
  title: 'JEE Advanced 2027 College Predictor | 23 IITs Cutoff & Branch Probability',
  description:
    'Predict your JEE Advanced 2027 All India Rank (AIR) and admission chances in 23 IITs (IIT Bombay, IIT Delhi, IIT Madras, etc.) based on marks out of 360.',
  keywords: [
    'JEE Advanced 2027 College Predictor',
    'IIT Bombay CSE closing rank',
    'IIT cutoff marks',
    'JoSAA IIT seat matrix',
    'IIT branch predictor',
  ],
};

export default function JeeAdvancedPage() {
  const examConfig = EXAM_CONFIGS['jee-advanced'];
  const faqs = getExamFAQs(examConfig);

  return (
    <>
      <StructuredData examConfig={examConfig} faqs={faqs} />
      <PredictorDashboard
        initialExam="jee-advanced"
        pageTitle="JEE Advanced 2027 College Predictor (23 IITs)"
        pageSubtitle="Dedicated IIT admission forecast model with 185K qualifying cohort calibration, Gender-Neutral & Female supernumerary pool analysis."
      />
    </>
  );
}
