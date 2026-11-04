import {
  EXAM_CONFIGS,
  validateInput,
  interpolateFromMarks,
  interpolateFromPercentile,
  interpolateFromRank,
  calculateRankAnalysis,
  evaluateCollegeAdmissionChance,
  CATEGORY_MULTIPLIERS,
  FEMALE_POOL_MULTIPLIER,
  HOME_STATE_MULTIPLIER,
} from '../lib/predictor/engine';
import { INITIAL_COLLEGE_CUTOFFS } from '../lib/predictor/data';
import { normalizeState, isHomeStateMatch } from '../lib/predictor/states';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${msg}`);
}

console.log('--- Running Mathematical Engine Verification Tests ---');

// 1. Test Exam Configs
assert(EXAM_CONFIGS['jee-main'].maxMarks === 300, 'JEE Main Max Marks is 300');
assert(EXAM_CONFIGS['jee-advanced'].maxMarks === 360, 'JEE Advanced Max Marks is 360');
assert(EXAM_CONFIGS['neet-ug'].maxMarks === 720, 'NEET UG Max Marks is 720');
assert(EXAM_CONFIGS['cuet-ug'].maxMarks === 800, 'CUET UG Max Marks is 800');
assert(EXAM_CONFIGS['clat-ug'].maxMarks === 120, 'CLAT UG Max Marks is 120');

// 2. Test Volatility Buffers
assert(EXAM_CONFIGS['jee-main'].volatilityBufferPercent === 8, 'JEE Main volatility buffer is ±8%');
assert(EXAM_CONFIGS['neet-ug'].volatilityBufferPercent === 8, 'NEET UG volatility buffer is ±8%');
assert(EXAM_CONFIGS['jee-advanced'].volatilityBufferPercent === 12, 'JEE Advanced volatility buffer is ±12%');
assert(EXAM_CONFIGS['cuet-ug'].volatilityBufferPercent === 12, 'CUET UG volatility buffer is ±12%');
assert(EXAM_CONFIGS['clat-ug'].volatilityBufferPercent === 12, 'CLAT UG volatility buffer is ±12%');

// 3. Test Piecewise Linear Interpolation
const jmTop = interpolateFromMarks('jee-main', 300);
assert(jmTop.rank === 1 && jmTop.percentile === 100, 'JEE Main 300 marks gives Rank 1 & 100%ile');

const jmMid = interpolateFromMarks('jee-main', 150);
assert(jmMid.rank > 25000 && jmMid.rank < 45000, `JEE Main 150 marks gives rank in expected band (${jmMid.rank})`);

const neetTop = interpolateFromMarks('neet-ug', 720);
assert(neetTop.rank === 1, 'NEET 720 gives Rank 1');

// 4. Test State Normalization & Domicile
assert(normalizeState('delhi') === 'Delhi', 'Normalizes "delhi"');
assert(normalizeState('NCT of Delhi') === 'Delhi', 'Normalizes "NCT of Delhi"');
assert(normalizeState('UP') === 'Uttar Pradesh', 'Normalizes "UP"');
assert(normalizeState('MH') === 'Maharashtra', 'Normalizes "MH"');
assert(isHomeStateMatch('delhi', 'New Delhi'), 'Matches Delhi variants');
assert(!isHomeStateMatch('Delhi', 'Uttar Pradesh'), 'Distinct states do not match');

// 5. Test Multipliers
assert(CATEGORY_MULTIPLIERS['OPEN'] === 1.0, 'OPEN multiplier is 1.0x');
assert(CATEGORY_MULTIPLIERS['GEN-EWS'] === 1.22, 'GEN-EWS multiplier is 1.22x');
assert(CATEGORY_MULTIPLIERS['OBC-NCL'] === 1.35, 'OBC-NCL multiplier is 1.35x');
assert(CATEGORY_MULTIPLIERS['SC'] === 2.10, 'SC multiplier is 2.10x');
assert(CATEGORY_MULTIPLIERS['ST'] === 2.85, 'ST multiplier is 2.85x');
assert(FEMALE_POOL_MULTIPLIER === 1.20, 'Female pool multiplier is 1.20x');
assert(HOME_STATE_MULTIPLIER === 1.30, 'Home state multiplier is 1.30x');

// 6. Test Quota Filtering
const nitTrichyHS = INITIAL_COLLEGE_CUTOFFS.find((c) => c.id === 'jm-2')!; // HS Tamil Nadu
const outOfStateEval = evaluateCollegeAdmissionChance(nitTrichyHS, 5000, 'OPEN', 'Gender-Neutral', 'Delhi');
assert(outOfStateEval === null, 'Out-of-state candidate cannot see or claim HS seat');

const homeStateEval = evaluateCollegeAdmissionChance(nitTrichyHS, 5000, 'OPEN', 'Gender-Neutral', 'Tamil Nadu');
assert(homeStateEval !== null, 'Home-state candidate sees HS seat');
assert(homeStateEval !== null && homeStateEval.isHomeStateApplied, 'HS multiplier 1.30x applied for eligible candidate');

// 7. Test Admission Chance Formula
// Ratio <= 0.70 => HIGH
// 0.70 < Ratio <= 1.00 => MODERATE
// 1.00 < Ratio <= 1.20 => AMBITIOUS
// Ratio > 1.20 => LOW
const safeRecord = { ...nitTrichyHS, closingRank: 10000, quota: 'AI' as const };
const evalSafe = evaluateCollegeAdmissionChance(safeRecord, 5000, 'OPEN', 'Gender-Neutral', 'Tamil Nadu')!;
assert(evalSafe.chance === 'HIGH' && evalSafe.chanceLabel === 'Safe', 'Ratio <= 0.70 yields Safe tier');

const targetRecord = { ...nitTrichyHS, closingRank: 6000, quota: 'AI' as const };
const evalTarget = evaluateCollegeAdmissionChance(targetRecord, 5500, 'OPEN', 'Gender-Neutral', 'Tamil Nadu')!;
assert(evalTarget.chance === 'MODERATE' && evalTarget.chanceLabel === 'Target', '0.70 < Ratio <= 1.0 yields Target tier');

const dreamRecord = { ...nitTrichyHS, closingRank: 5000, quota: 'AI' as const };
const evalDream = evaluateCollegeAdmissionChance(dreamRecord, 5500, 'OPEN', 'Gender-Neutral', 'Tamil Nadu')!;
assert(evalDream.chance === 'AMBITIOUS' && evalDream.chanceLabel === 'Dream', '1.0 < Ratio <= 1.20 yields Dream tier');

const lowRecord = { ...nitTrichyHS, closingRank: 3000, quota: 'AI' as const };
const evalLow = evaluateCollegeAdmissionChance(lowRecord, 6000, 'OPEN', 'Gender-Neutral', 'Tamil Nadu')!;
assert(evalLow.chance === 'LOW' && evalLow.chanceLabel === 'Low', 'Ratio > 1.20 yields Low tier');

console.log('🎉 ALL MATHEMATICAL ENGINE SPECIFICATIONS VERIFIED SUCCESSFULLY!');
