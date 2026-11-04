import { Metadata } from 'next';
import { PredictorDashboard } from '@/components/PredictorDashboard';
import { StructuredData } from '@/components/StructuredData';
import { EXAM_CONFIGS } from '@/lib/predictor/engine';
import { getExamFAQs } from '@/lib/predictor/faqs';

export const metadata: Metadata = {
  title: 'CUET UG 2027 College Predictor | DU CSAS, BHU & Central Universities',
  description:
    'Predict your admission chances at Delhi University (SRCC, St. Stephens, Hindu, LSR), BHU, and Central Universities from CUET raw/normalized score out of 800.',
  keywords: [
    'CUET College Predictor 2027',
    'DU CSAS Cutoff Calculator',
    'SRCC B.Com Hons Cutoff',
    'Hindu College CUET Score',
    'Delhi University UG Cutoffs',
  ],
};

export default function CuetPage() {
  const examConfig = EXAM_CONFIGS['cuet-ug'];
  const faqs = getExamFAQs(examConfig);

  return (
    <>
      <StructuredData examConfig={examConfig} faqs={faqs} />
      <PredictorDashboard
        initialExam="cuet-ug"
        pageTitle="CUET UG 2027 University & College Predictor"
        pageSubtitle="Forecast DU CSAS rounds, BHU, and Central University merit allocations based on normalized aggregate score (out of 800)."
      />
    </>
  );
}
