import { Metadata } from 'next';
import { PredictorDashboard } from '@/components/PredictorDashboard';
import { StructuredData } from '@/components/StructuredData';
import { EXAM_CONFIGS } from '@/lib/predictor/engine';
import { getExamFAQs } from '@/lib/predictor/faqs';

export const metadata: Metadata = {
  title: 'All-India College & Rank Predictor 2027 | JoSAA, NEET, CUET & CLAT',
  description:
    'Calculate your All India Rank (AIR), percentile, and college admission chances across 5 major national competitive exams: JEE Main, JEE Advanced, NEET, CUET, and CLAT.',
};

export default function HomePage() {
  const defaultExamConfig = EXAM_CONFIGS['jee-main'];
  const faqs = getExamFAQs(defaultExamConfig);

  return (
    <>
      <StructuredData examConfig={defaultExamConfig} faqs={faqs} />
      <PredictorDashboard
        initialExam="jee-main"
        pageTitle="National College & Rank Predictor 2027"
        pageSubtitle="Empirical Piecewise Linear Interpolation, JoSAA & MCC Quota Engine, Home State Domicile Rules, and Multiplier Analysis."
      />
    </>
  );
}
