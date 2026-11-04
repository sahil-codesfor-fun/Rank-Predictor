import { Metadata } from 'next';
import { PredictorDashboard } from '@/components/PredictorDashboard';
import { StructuredData } from '@/components/StructuredData';
import { EXAM_CONFIGS } from '@/lib/predictor/engine';
import { getExamFAQs } from '@/lib/predictor/faqs';

export const metadata: Metadata = {
  title: 'NEET UG 2027 College & Rank Predictor | AIIMS, GMC & MCC Cutoffs',
  description:
    'Calculate your expected NEET UG 2027 All India Rank (AIR) from marks (out of 720). Forecast admission into AIIMS, central medical institutes, and State GMCs.',
  keywords: [
    'NEET 2027 Rank Predictor',
    'AIIMS New Delhi MBBS Cutoff',
    'MCC 15% All India Quota',
    'State Medical Counseling 85%',
    'NEET marks vs rank 2027',
  ],
};

export default function NeetPage() {
  const examConfig = EXAM_CONFIGS['neet-ug'];
  const faqs = getExamFAQs(examConfig);

  return (
    <>
      <StructuredData examConfig={examConfig} faqs={faqs} />
      <PredictorDashboard
        initialExam="neet-ug"
        pageTitle="NEET UG 2027 Medical College Predictor"
        pageSubtitle="Empirical MBBS cutoff forecasting calibrated across 2.38M aspirants. Evaluates 15% All India Quota (MCC) and 85% State Quota GMC admissions."
      />
    </>
  );
}
