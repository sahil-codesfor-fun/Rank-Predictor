import { Metadata } from 'next';
import { PredictorDashboard } from '@/components/PredictorDashboard';
import { StructuredData } from '@/components/StructuredData';
import { EXAM_CONFIGS } from '@/lib/predictor/engine';
import { getExamFAQs } from '@/lib/predictor/faqs';

export const metadata: Metadata = {
  title: 'CLAT UG 2027 College Predictor | 26+ National Law Universities (NLSIU, NALSAR, WBNUJS)',
  description:
    'Calculate your CLAT 2027 All India Rank (AIR) from marks out of 120. Predict admission chances across 26+ National Law Universities (NLUs) with State Domicile reservation.',
  keywords: [
    'CLAT 2027 College Predictor',
    'NLSIU Bangalore BA LLB Cutoff',
    'NALSAR Hyderabad closing rank',
    'Consortium of NLUs counseling',
    'CLAT marks vs rank',
  ],
};

export default function ClatPage() {
  const examConfig = EXAM_CONFIGS['clat-ug'];
  const faqs = getExamFAQs(examConfig);

  return (
    <>
      <StructuredData examConfig={examConfig} faqs={faqs} />
      <PredictorDashboard
        initialExam="clat-ug"
        pageTitle="CLAT UG 2027 Law College Predictor"
        pageSubtitle="All India & State Domicile seat allocation forecast for 26+ National Law Universities based on marks out of 120."
      />
    </>
  );
}
