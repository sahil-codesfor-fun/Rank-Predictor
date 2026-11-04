import {
  ExamConfig,
  ExamType,
  CalibrationPoint,
  PredictionInput,
  RankAnalysisResult,
  CollegeCutoffRecord,
  CollegePredictionItem,
  ChanceLevel,
  ChanceLabel,
  Category,
  GenderPool,
} from './types';
import { isHomeStateMatch } from './states';

// 1. Exam Configuration Constants
export const EXAM_CONFIGS: Record<ExamType, ExamConfig> = {
  'jee-main': {
    id: 'jee-main',
    name: 'JEE Main',
    fullName: 'Joint Entrance Examination (Main)',
    maxMarks: 300,
    totalCandidates: 1420000,
    candidateVolumeLabel: '1.42M candidates',
    authorities: ['JoSAA', 'CSAB'],
    targetInstitutes: '32 NITs, 26 IIITs, 40+ GFTIs & State Colleges',
    quotas: ['HS', 'OS', 'AI'],
    pools: ['Gender-Neutral', 'Female-only'],
    volatilityBufferPercent: 8,
    defaultCategory: 'OPEN',
    examYear: 2027,
    description: 'Premier engineering entrance exam for admissions into NITs, IIITs, and Central/State GFTIs.',
  },
  'jee-advanced': {
    id: 'jee-advanced',
    name: 'JEE Advanced',
    fullName: 'Joint Entrance Examination (Advanced)',
    maxMarks: 360,
    totalCandidates: 185000,
    candidateVolumeLabel: '185K candidates',
    authorities: ['JoSAA'],
    targetInstitutes: '23 Indian Institutes of Technology (IITs)',
    quotas: ['AI'],
    pools: ['Gender-Neutral', 'Female-only'],
    volatilityBufferPercent: 12,
    defaultCategory: 'OPEN',
    examYear: 2027,
    description: 'Gateway to the elite 23 IITs and IISC/IISERs for top JEE Main qualifiers.',
  },
  'neet-ug': {
    id: 'neet-ug',
    name: 'NEET UG',
    fullName: 'National Eligibility cum Entrance Test (Undergraduate)',
    maxMarks: 720,
    totalCandidates: 2380000,
    candidateVolumeLabel: '2.38M candidates',
    authorities: ['MCC', 'State Quota Counseling'],
    targetInstitutes: 'AIIMS, Central Universities, GMCs, Deemed Medical',
    quotas: ['AI', 'HS'],
    pools: ['Gender-Neutral'],
    volatilityBufferPercent: 8,
    defaultCategory: 'OPEN',
    examYear: 2027,
    description: 'Single national entrance test for MBBS, BDS, and AYUSH across India.',
  },
  'cuet-ug': {
    id: 'cuet-ug',
    name: 'CUET UG',
    fullName: 'Common University Entrance Test (Undergraduate)',
    maxMarks: 800,
    totalCandidates: 1490000,
    candidateVolumeLabel: '1.49M candidates',
    authorities: ['DU CSAS', 'BHU Portal', 'Central Universities SAMARTH'],
    targetInstitutes: 'Delhi University, BHU, JNU, Jamia & Central Universities',
    quotas: ['AI'],
    pools: ['Gender-Neutral'],
    volatilityBufferPercent: 12,
    defaultCategory: 'OPEN',
    examYear: 2027,
    description: 'Common entrance assessment for undergraduate degree admissions in 250+ Universities.',
  },
  'clat-ug': {
    id: 'clat-ug',
    name: 'CLAT UG',
    fullName: 'Common Law Admission Test (Undergraduate)',
    maxMarks: 120,
    totalCandidates: 76000,
    candidateVolumeLabel: '76K candidates',
    authorities: ['Consortium of NLUs'],
    targetInstitutes: '26+ National Law Universities (NLSIU, NALSAR, WBNUJS, etc.)',
    quotas: ['AI', 'HS'],
    pools: ['Gender-Neutral', 'Female-only'],
    volatilityBufferPercent: 12,
    defaultCategory: 'OPEN',
    examYear: 2027,
    description: 'Premier national entrance test for 5-Year Integrated B.A. LL.B & B.B.A. LL.B programs.',
  },
};

// 2. Calibration Curves (Marks -> Rank, Percentile)
// Sorted descending by marks
export const CALIBRATION_DATA: Record<ExamType, CalibrationPoint[]> = {
  'jee-main': [
    { marks: 300, rank: 1, percentile: 100.000 },
    { marks: 285, rank: 80, percentile: 99.994 },
    { marks: 270, rank: 350, percentile: 99.975 },
    { marks: 250, rank: 1200, percentile: 99.915 },
    { marks: 230, rank: 3200, percentile: 99.775 },
    { marks: 210, rank: 6800, percentile: 99.521 },
    { marks: 190, rank: 12500, percentile: 99.120 },
    { marks: 170, rank: 21000, percentile: 98.521 },
    { marks: 150, rank: 34000, percentile: 97.605 },
    { marks: 130, rank: 55000, percentile: 96.126 },
    { marks: 115, rank: 78000, percentile: 94.507 },
    { marks: 100, rank: 110000, percentile: 92.253 },
    { marks: 85, rank: 165000, percentile: 88.380 },
    { marks: 70, rank: 250000, percentile: 82.394 },
    { marks: 55, rank: 380000, percentile: 73.239 },
    { marks: 40, rank: 580000, percentile: 59.155 },
    { marks: 25, rank: 850000, percentile: 40.141 },
    { marks: 10, rank: 1150000, percentile: 19.014 },
    { marks: 0, rank: 1420000, percentile: 0.000 },
  ],
  'jee-advanced': [
    { marks: 340, rank: 1, percentile: 100.000 },
    { marks: 300, rank: 50, percentile: 99.973 },
    { marks: 270, rank: 250, percentile: 99.865 },
    { marks: 240, rank: 750, percentile: 99.595 },
    { marks: 210, rank: 1800, percentile: 99.027 },
    { marks: 180, rank: 3500, percentile: 98.108 },
    { marks: 160, rank: 5500, percentile: 97.027 },
    { marks: 140, rank: 8500, percentile: 95.405 },
    { marks: 120, rank: 13000, percentile: 92.973 },
    { marks: 105, rank: 18000, percentile: 90.270 },
    { marks: 90, rank: 24000, percentile: 87.027 },
    { marks: 75, rank: 32000, percentile: 82.703 },
    { marks: 60, rank: 45000, percentile: 75.676 },
    { marks: 40, rank: 80000, percentile: 56.757 },
    { marks: 20, rank: 135000, percentile: 27.027 },
    { marks: 0, rank: 185000, percentile: 0.000 },
  ],
  'neet-ug': [
    { marks: 720, rank: 1, percentile: 100.000 },
    { marks: 715, rank: 15, percentile: 99.999 },
    { marks: 710, rank: 75, percentile: 99.997 },
    { marks: 700, rank: 350, percentile: 99.985 },
    { marks: 685, rank: 1200, percentile: 99.949 },
    { marks: 670, rank: 3200, percentile: 99.865 },
    { marks: 655, rank: 6500, percentile: 99.727 },
    { marks: 640, rank: 12000, percentile: 99.496 },
    { marks: 620, rank: 22000, percentile: 99.076 },
    { marks: 600, rank: 35000, percentile: 98.529 },
    { marks: 575, rank: 55000, percentile: 97.689 },
    { marks: 550, rank: 80000, percentile: 96.639 },
    { marks: 520, rank: 115000, percentile: 95.168 },
    { marks: 480, rank: 175000, percentile: 92.647 },
    { marks: 440, rank: 250000, percentile: 89.496 },
    { marks: 400, rank: 340000, percentile: 85.714 },
    { marks: 350, rank: 480000, percentile: 79.832 },
    { marks: 300, rank: 660000, percentile: 72.269 },
    { marks: 250, rank: 900000, percentile: 62.185 },
    { marks: 200, rank: 1250000, percentile: 47.479 },
    { marks: 150, rank: 1650000, percentile: 30.672 },
    { marks: 100, rank: 2050000, percentile: 13.865 },
    { marks: 0, rank: 2380000, percentile: 0.000 },
  ],
  'cuet-ug': [
    { marks: 800, rank: 1, percentile: 100.000 },
    { marks: 780, rank: 150, percentile: 99.990 },
    { marks: 750, rank: 850, percentile: 99.943 },
    { marks: 720, rank: 2800, percentile: 99.812 },
    { marks: 690, rank: 7500, percentile: 99.497 },
    { marks: 650, rank: 18000, percentile: 98.792 },
    { marks: 600, rank: 38000, percentile: 97.450 },
    { marks: 550, rank: 72000, percentile: 95.168 },
    { marks: 500, rank: 125000, percentile: 91.611 },
    { marks: 450, rank: 200000, percentile: 86.577 },
    { marks: 400, rank: 310000, percentile: 79.195 },
    { marks: 350, rank: 460000, percentile: 69.128 },
    { marks: 300, rank: 650000, percentile: 56.376 },
    { marks: 250, rank: 900000, percentile: 39.597 },
    { marks: 150, rank: 1250000, percentile: 16.107 },
    { marks: 0, rank: 1490000, percentile: 0.000 },
  ],
  'clat-ug': [
    { marks: 118, rank: 1, percentile: 100.000 },
    { marks: 110, rank: 20, percentile: 99.974 },
    { marks: 102, rank: 120, percentile: 99.842 },
    { marks: 96, rank: 350, percentile: 99.539 },
    { marks: 90, rank: 850, percentile: 98.882 },
    { marks: 85, rank: 1600, percentile: 97.895 },
    { marks: 80, rank: 2700, percentile: 96.447 },
    { marks: 75, rank: 4200, percentile: 94.474 },
    { marks: 70, rank: 6200, percentile: 91.842 },
    { marks: 65, rank: 9000, percentile: 88.158 },
    { marks: 60, rank: 13000, percentile: 82.895 },
    { marks: 55, rank: 18500, percentile: 75.658 },
    { marks: 50, rank: 26000, percentile: 65.789 },
    { marks: 45, rank: 35000, percentile: 53.947 },
    { marks: 35, rank: 50000, percentile: 34.211 },
    { marks: 20, rank: 68000, percentile: 10.526 },
    { marks: 0, rank: 76000, percentile: 0.000 },
  ],
};

// 3. Multiplier Matrix
export const CATEGORY_MULTIPLIERS: Record<Category, number> = {
  'OPEN': 1.0,
  'GEN-EWS': 1.22,
  'OBC-NCL': 1.35,
  'SC': 2.10,
  'ST': 2.85,
};

export const FEMALE_POOL_MULTIPLIER = 1.20;
export const HOME_STATE_MULTIPLIER = 1.30;

/**
 * Validates input parameters strictly.
 */
export function validateInput(input: PredictionInput): { valid: boolean; error?: string } {
  const config = EXAM_CONFIGS[input.exam];
  if (!config) return { valid: false, error: 'Invalid exam selected.' };

  if (input.mode === 'marks') {
    if (input.marks === undefined || isNaN(input.marks)) {
      return { valid: false, error: 'Please enter valid marks.' };
    }
    if (input.marks < 0 || input.marks > config.maxMarks) {
      return { valid: false, error: `Marks must be between 0 and ${config.maxMarks}.` };
    }
  } else if (input.mode === 'percentile') {
    if (input.percentile === undefined || isNaN(input.percentile)) {
      return { valid: false, error: 'Please enter valid percentile.' };
    }
    if (input.percentile < 0 || input.percentile > 100) {
      return { valid: false, error: 'Percentile must be between 0.00 and 100.00.' };
    }
  } else if (input.mode === 'rank') {
    if (input.rank === undefined || isNaN(input.rank) || input.rank < 1) {
      return { valid: false, error: 'Rank must be greater than or equal to 1.' };
    }
    if (input.rank > config.totalCandidates * 1.2) {
      return { valid: false, error: `Rank exceeds expected candidate range for ${config.name}.` };
    }
  }

  return { valid: true };
}

/**
 * Piecewise Linear Interpolation: Marks -> (Rank, Percentile)
 */
export function interpolateFromMarks(
  exam: ExamType,
  marks: number
): { rank: number; percentile: number } {
  const points = CALIBRATION_DATA[exam];
  const maxMarks = EXAM_CONFIGS[exam].maxMarks;
  const clampedMarks = Math.max(0, Math.min(maxMarks, marks));

  // If higher than highest calibration point
  if (clampedMarks >= points[0].marks) {
    return { rank: points[0].rank, percentile: points[0].percentile };
  }
  // If lower than lowest calibration point
  if (clampedMarks <= points[points.length - 1].marks) {
    return {
      rank: points[points.length - 1].rank,
      percentile: points[points.length - 1].percentile,
    };
  }

  // Find enclosing interval [p_i, p_{i+1}]
  for (let i = 0; i < points.length - 1; i++) {
    const pUpper = points[i];
    const pLower = points[i + 1];

    if (clampedMarks <= pUpper.marks && clampedMarks >= pLower.marks) {
      const marksRange = pUpper.marks - pLower.marks;
      const t = marksRange === 0 ? 0 : (pUpper.marks - clampedMarks) / marksRange;

      // As marks decrease from pUpper to pLower, rank increases from pUpper.rank to pLower.rank
      const interpolatedRank = Math.round(pUpper.rank + t * (pLower.rank - pUpper.rank));
      // Percentile decreases from pUpper.percentile to pLower.percentile
      const interpolatedPercentile = Number(
        (pUpper.percentile - t * (pUpper.percentile - pLower.percentile)).toFixed(4)
      );

      return {
        rank: Math.max(1, interpolatedRank),
        percentile: Math.max(0, Math.min(100, interpolatedPercentile)),
      };
    }
  }

  return { rank: points[0].rank, percentile: points[0].percentile };
}

/**
 * Piecewise Linear Interpolation: Percentile -> (Rank, Marks)
 */
export function interpolateFromPercentile(
  exam: ExamType,
  percentile: number
): { rank: number; marks: number } {
  const points = CALIBRATION_DATA[exam];
  const clampedP = Math.max(0, Math.min(100, percentile));

  if (clampedP >= points[0].percentile) {
    return { rank: points[0].rank, marks: points[0].marks };
  }
  if (clampedP <= points[points.length - 1].percentile) {
    return {
      rank: points[points.length - 1].rank,
      marks: points[points.length - 1].marks,
    };
  }

  for (let i = 0; i < points.length - 1; i++) {
    const pUpper = points[i];
    const pLower = points[i + 1];

    if (clampedP <= pUpper.percentile && clampedP >= pLower.percentile) {
      const pRange = pUpper.percentile - pLower.percentile;
      const t = pRange === 0 ? 0 : (pUpper.percentile - clampedP) / pRange;

      const rank = Math.round(pUpper.rank + t * (pLower.rank - pUpper.rank));
      const marks = Math.round((pUpper.marks - t * (pUpper.marks - pLower.marks)) * 10) / 10;

      return {
        rank: Math.max(1, rank),
        marks: Math.max(0, marks),
      };
    }
  }

  return { rank: points[0].rank, marks: points[0].marks };
}

/**
 * Interpolation: Rank -> (Percentile, Marks)
 */
export function interpolateFromRank(
  exam: ExamType,
  rank: number
): { percentile: number; marks: number } {
  const points = CALIBRATION_DATA[exam];
  const total = EXAM_CONFIGS[exam].totalCandidates;
  const clampedRank = Math.max(1, rank);

  if (clampedRank <= points[0].rank) {
    return { percentile: points[0].percentile, marks: points[0].marks };
  }
  if (clampedRank >= points[points.length - 1].rank) {
    return {
      percentile: points[points.length - 1].percentile,
      marks: points[points.length - 1].marks,
    };
  }

  for (let i = 0; i < points.length - 1; i++) {
    const pUpper = points[i];
    const pLower = points[i + 1];

    if (clampedRank >= pUpper.rank && clampedRank <= pLower.rank) {
      const rankRange = pLower.rank - pUpper.rank;
      const t = rankRange === 0 ? 0 : (clampedRank - pUpper.rank) / rankRange;

      const percentile = Number(
        (pUpper.percentile - t * (pUpper.percentile - pLower.percentile)).toFixed(4)
      );
      const marks = Math.round((pUpper.marks - t * (pUpper.marks - pLower.marks)) * 10) / 10;

      return {
        percentile: Math.max(0, Math.min(100, percentile)),
        marks: Math.max(0, marks),
      };
    }
  }

  // Fallback formula
  const calculatedPercentile = Math.max(0, ((total - clampedRank) / total) * 100);
  return {
    percentile: Number(calculatedPercentile.toFixed(3)),
    marks: 0,
  };
}

/**
 * Core Rank Analysis Engine
 */
export function calculateRankAnalysis(input: PredictionInput): RankAnalysisResult {
  const config = EXAM_CONFIGS[input.exam];
  const bufferPercent = config.volatilityBufferPercent;
  let estimatedRank = 1;
  let estimatedPercentile = 100.0;
  let estimatedMarks = input.marks;
  let confidence: 'High' | 'Moderate' = 'High';

  if (input.mode === 'marks') {
    const marks = input.marks ?? 0;
    const res = interpolateFromMarks(input.exam, marks);
    estimatedRank = res.rank;
    estimatedPercentile = res.percentile;
    estimatedMarks = marks;

    // High confidence in central 80% range, Moderate near extreme boundaries
    const ratio = marks / config.maxMarks;
    confidence = ratio > 0.12 && ratio < 0.94 ? 'High' : 'Moderate';
  } else if (input.mode === 'percentile') {
    const p = input.percentile ?? 100.0;
    const res = interpolateFromPercentile(input.exam, p);
    estimatedRank = res.rank;
    estimatedMarks = res.marks;
    estimatedPercentile = p;
    confidence = p > 25 && p < 99.8 ? 'High' : 'Moderate';
  } else if (input.mode === 'rank') {
    const r = input.rank ?? 1;
    const res = interpolateFromRank(input.exam, r);
    estimatedRank = r;
    estimatedPercentile = res.percentile;
    estimatedMarks = res.marks;
    confidence = 'High';
  }

  // Calculate volatility buffer (±8% or ±12%)
  const bufferFraction = bufferPercent / 100;
  const minRank = Math.max(1, Math.round(estimatedRank * (1 - bufferFraction)));
  const maxRank = Math.max(minRank, Math.round(estimatedRank * (1 + bufferFraction)));

  // Generate analytical summary
  const summary = generateAnalyticalSummary(
    config,
    estimatedRank,
    minRank,
    maxRank,
    estimatedPercentile,
    estimatedMarks,
    input.category
  );

  return {
    estimatedRank,
    likelyRankRange: { minRank, maxRank },
    estimatedPercentile,
    estimatedMarks,
    confidence,
    volatilityBufferPercent: bufferPercent,
    summary,
    examConfig: config,
    calculatedAt: new Date().toISOString(),
  };
}

function generateAnalyticalSummary(
  config: ExamConfig,
  rank: number,
  minRank: number,
  maxRank: number,
  percentile: number,
  marks: number | undefined,
  category: Category
): string {
  const marksPart = marks !== undefined ? `with ~${marks}/${config.maxMarks} marks` : '';
  const catPart = category !== 'OPEN' ? ` under ${category} category` : '';

  if (rank <= 1000) {
    return `Exceptional Top Tier performance! Predicted AIR ${rank.toLocaleString('en-IN')} (Range: ${minRank.toLocaleString('en-IN')} – ${maxRank.toLocaleString('en-IN')}) at ~${percentile}%ile ${marksPart}${catPart}. Eligible for the top 5 flagship institutes and prime engineering/medical/law branches nationwide.`;
  } else if (rank <= 8000) {
    return `Outstanding competitive position! Estimated AIR ${rank.toLocaleString('en-IN')} (Range: ${minRank.toLocaleString('en-IN')} – ${maxRank.toLocaleString('en-IN')}) placed in the top ~${(100 - percentile).toFixed(2)}% of the cohort${catPart}. Strong shot at Tier-1 NITs, AIIMS, top NLUs, and core branches.`;
  } else if (rank <= 35000) {
    return `Solid competitive standing! Estimated AIR ${rank.toLocaleString('en-IN')} (Range: ${minRank.toLocaleString('en-IN')} – ${maxRank.toLocaleString('en-IN')}) placed at ${percentile}%ile${catPart}. High probability for reputable state GMCs, established NITs/IIITs, and prominent Central Universities.`;
  } else if (rank <= 90000) {
    return `Moderate competitive band! Predicted AIR ${rank.toLocaleString('en-IN')} (Range: ${minRank.toLocaleString('en-IN')} – ${maxRank.toLocaleString('en-IN')})${catPart}. Viable opportunities in specialized branches, Home State quotas, newer NITs/IIITs, and reputable GFTIs.`;
  } else {
    return `Estimated AIR ${rank.toLocaleString('en-IN')} (Range: ${minRank.toLocaleString('en-IN')} – ${maxRank.toLocaleString('en-IN')})${catPart}. Consider exploring state counseling rounds, private & deemed institutions, and strategic choice ordering.`;
  }
}

/**
 * Calculates Effective Closing Rank and Chance Level for a college cutoff record.
 */
export function evaluateCollegeAdmissionChance(
  record: CollegeCutoffRecord,
  candidateRank: number,
  candidateCategory: Category,
  candidateGender: GenderPool,
  candidateHomeState: string
): CollegePredictionItem | null {
  // 1. Quota & Domicile Filtering
  // AI seats open to everyone
  // HS seats ONLY shown if candidate's domicile matches the institute state
  // OS seats ONLY shown if candidate's domicile does NOT match the institute state
  const isMatch = isHomeStateMatch(candidateHomeState, record.state);

  if (record.quota === 'HS' && !isMatch) {
    return null; // Reject HS seat for out-of-state candidates
  }
  if (record.quota === 'OS' && isMatch) {
    return null; // Reject OS seat for home-state candidates
  }

  // 2. Multipliers calculation
  // Base closing rank
  let effectiveClosingRank = record.closingRank;
  let categoryMultiplier = 1.0;
  let isHomeStateApplied = false;

  // If cutoff record is general 'OPEN' and candidate has a reserved category, apply category multiplier
  if (record.category === 'OPEN' && candidateCategory !== 'OPEN') {
    categoryMultiplier = CATEGORY_MULTIPLIERS[candidateCategory];
    effectiveClosingRank *= categoryMultiplier;
  }

  // Female-only pool multiplier (if applicable)
  if (candidateGender === 'Female-only' && record.gender === 'Gender-Neutral') {
    effectiveClosingRank *= FEMALE_POOL_MULTIPLIER;
  }

  // Home State multiplier if candidate is eligible for HS benefit
  if (isMatch && record.quota === 'HS') {
    effectiveClosingRank *= HOME_STATE_MULTIPLIER;
    isHomeStateApplied = true;
  }

  effectiveClosingRank = Math.round(effectiveClosingRank);

  // 3. Admission Chance Formula:
  // Ratio = Candidate Rank / Effective Closing Rank
  const ratio = Number((candidateRank / effectiveClosingRank).toFixed(3));
  let chance: ChanceLevel;
  let chanceLabel: ChanceLabel;
  let probability: number;

  if (ratio <= 0.70) {
    chance = 'HIGH';
    chanceLabel = 'Safe';
    // 92-99% probability
    probability = Math.min(99, Math.round(92 + (0.70 - ratio) * 10));
  } else if (ratio <= 1.00) {
    chance = 'MODERATE';
    chanceLabel = 'Target';
    // 60-89% probability
    probability = Math.round(60 + ((1.00 - ratio) / 0.30) * 29);
  } else if (ratio <= 1.20) {
    chance = 'AMBITIOUS';
    chanceLabel = 'Dream';
    // 25-59% probability
    probability = Math.round(25 + ((1.20 - ratio) / 0.20) * 34);
  } else {
    chance = 'LOW';
    chanceLabel = 'Low';
    // 2-24% probability
    const drop = Math.min(22, (ratio - 1.20) * 20);
    probability = Math.max(2, Math.round(24 - drop));
  }

  const bufferDelta = effectiveClosingRank - candidateRank;

  return {
    record,
    effectiveClosingRank,
    ratio,
    chance,
    chanceLabel,
    probability,
    bufferDelta,
    isHomeStateApplied,
    categoryMultiplierApplied: categoryMultiplier,
  };
}

/**
 * Runs prediction across all cutoff records.
 */
export function predictColleges(
  analysis: RankAnalysisResult,
  cutoffs: CollegeCutoffRecord[],
  input: PredictionInput
): CollegePredictionItem[] {
  const candidateRank = analysis.estimatedRank;
  const results: CollegePredictionItem[] = [];

  for (const record of cutoffs) {
    if (record.exam !== input.exam) continue;

    const evaluated = evaluateCollegeAdmissionChance(
      record,
      candidateRank,
      input.category,
      input.gender,
      input.homeState
    );

    if (evaluated) {
      results.push(evaluated);
    }
  }

  // Sort by ratio ascending (best chances first) or by probability descending
  return results.sort((a, b) => a.ratio - b.ratio);
}

