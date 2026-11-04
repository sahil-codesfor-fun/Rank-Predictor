import { ExamConfig } from './types';

export interface FAQItem {
  question: string;
  answer: string;
}

export function getExamFAQs(config: ExamConfig): FAQItem[] {
  return [
    {
      question: `How does the ${config.name} 2027 Rank Predictor calculate my rank?`,
      answer: `The engine employs Piecewise Linear Interpolation across official historical cutoff and marks-vs-rank data calibrated over the last 3 counseling cycles (2023–2025). It accounts for the total candidate pool (${config.candidateVolumeLabel}), test difficulty shifts, and applies dynamic volatility buffers (±${config.volatilityBufferPercent}%) to produce a realistic rank range.`,
    },
    {
      question: `How are Home State (HS) and Other State (OS) quotas handled?`,
      answer: `Our mathematical engine strictly cross-references your selected domicile with each institute's geographical state. Home State seats (with a 1.30x rank relaxation multiplier) are exclusively made available if your domicile matches the college's home state, while Other State seats are offered for out-of-state applicants. All India (AI) seats remain accessible to candidates from all 36 States & UTs.`,
    },
    {
      question: `What reservation category multipliers are used?`,
      answer: `The platform implements the standard empirical JoSAA/MCC multiplier benchmarks: OPEN (1.00x), GEN-EWS (1.22x), OBC-NCL (1.35x), SC (2.10x), and ST (2.85x). For female candidates applying under female-only supernumerary pools, an additional 1.20x multiplier is applied.`,
    },
    {
      question: `What is the difference between Safe, Target, and Dream college tiers?`,
      answer: `Colleges are classified based on the ratio of your predicted rank to the institute's effective closing rank (CR_eff): Safe Tier (Ratio ≤ 0.70, 92–99% admission probability), Target Tier (0.70 < Ratio ≤ 1.00, 60–89% probability), and Dream/Ambitious Tier (1.00 < Ratio ≤ 1.20, 25–59% probability).`,
    },
    {
      question: `Can I export my preference list for JoSAA / MCC choice filling?`,
      answer: `Yes! You can add multiple college branches to your Preference List, reorder them up or down based on your strategic priority, and either copy the formatted order to your clipboard or download a structured .txt file ready for reference during actual counseling rounds.`,
    },
  ];
}

