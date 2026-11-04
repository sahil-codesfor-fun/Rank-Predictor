export type ExamType =
  | 'jee-main'
  | 'jee-advanced'
  | 'neet-ug'
  | 'cuet-ug'
  | 'clat-ug';

export type InputMode = 'marks' | 'percentile' | 'rank';

export type Category = 'OPEN' | 'GEN-EWS' | 'OBC-NCL' | 'SC' | 'ST';

export type GenderPool = 'Gender-Neutral' | 'Female-only';

export type Quota = 'AI' | 'HS' | 'OS';

export type CollegeType =
  | 'IIT'
  | 'NIT'
  | 'IIIT'
  | 'GFTI'
  | 'AIIMS'
  | 'GMC'
  | 'CENTRAL_UNIV'
  | 'NLU';

export type ChanceLevel = 'HIGH' | 'MODERATE' | 'AMBITIOUS' | 'LOW';
export type ChanceLabel = 'Safe' | 'Target' | 'Dream' | 'Low';

export interface ExamConfig {
  id: ExamType;
  name: string;
  fullName: string;
  maxMarks: number;
  totalCandidates: number;
  candidateVolumeLabel: string;
  authorities: string[];
  targetInstitutes: string;
  quotas: Quota[];
  pools: GenderPool[];
  volatilityBufferPercent: number; // e.g. 8 for +/-8%, 12 for +/-12%
  defaultCategory: Category;
  examYear: number;
  description: string;
}

export interface CalibrationPoint {
  marks: number;
  rank: number;
  percentile: number;
}

export interface PredictionInput {
  exam: ExamType;
  mode: InputMode;
  marks?: number;
  percentile?: number;
  rank?: number;
  category: Category;
  gender: GenderPool;
  homeState: string;
}

export interface RankAnalysisResult {
  estimatedRank: number;
  likelyRankRange: {
    minRank: number;
    maxRank: number;
  };
  estimatedPercentile: number;
  estimatedMarks?: number;
  confidence: 'High' | 'Moderate';
  volatilityBufferPercent: number;
  summary: string;
  examConfig: ExamConfig;
  calculatedAt: string;
}

export interface CollegeCutoffRecord {
  id: string;
  exam: ExamType;
  institute: string;
  branch: string;
  state: string;
  category: Category;
  gender: GenderPool;
  quota: Quota;
  round: number;
  openingRank: number;
  closingRank: number;
  closingRank2023?: number;
  closingRank2024?: number;
  closingRank2025?: number;
  tuitionFee: string; // e.g. "₹2.1 Lakh/yr"
  avgPackage: string; // e.g. "₹18.5 LPA"
  highestPackage: string; // e.g. "₹52.0 LPA"
  nirfRank: number;
  type: CollegeType;
  city: string;
}

export interface CollegePredictionItem {
  record: CollegeCutoffRecord;
  effectiveClosingRank: number;
  ratio: number;
  chance: ChanceLevel;
  chanceLabel: ChanceLabel;
  probability: number; // e.g. 95 (Safe), 75 (Target), 40 (Dream), 10 (Low)
  bufferDelta: number; // effectiveClosingRank - estimatedRank
  isHomeStateApplied: boolean;
  categoryMultiplierApplied: number;
}

export interface PreferenceItem {
  id: string;
  collegeId: string;
  institute: string;
  branch: string;
  quota: Quota;
  closingRank: number;
  chanceLabel: ChanceLabel;
  nirfRank: number;
  avgPackage: string;
  addedAt: number;
}

