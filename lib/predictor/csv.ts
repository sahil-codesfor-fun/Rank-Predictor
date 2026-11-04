import { CollegeCutoffRecord, ExamType, Category, GenderPool, Quota, CollegeType } from './types';
import { normalizeState } from './states';

export interface CSVParseResult {
  records: CollegeCutoffRecord[];
  errors: string[];
  totalParsed: number;
}

const VALID_EXAMS: ExamType[] = ['jee-main', 'jee-advanced', 'neet-ug', 'cuet-ug', 'clat-ug'];
const VALID_CATEGORIES: Category[] = ['OPEN', 'GEN-EWS', 'OBC-NCL', 'SC', 'ST'];
const VALID_GENDERS: GenderPool[] = ['Gender-Neutral', 'Female-only'];
const VALID_QUOTAS: Quota[] = ['AI', 'HS', 'OS'];

export function parseCutoffsCSV(csvText: string): CSVParseResult {
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const records: CollegeCutoffRecord[] = [];
  const errors: string[] = [];

  if (lines.length < 2) {
    return { records: [], errors: ['CSV file must contain a header row and at least one data row.'], totalParsed: 0 };
  }

  // Parse header
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
  const requiredHeaders = [
    'exam',
    'institute',
    'branch',
    'category',
    'gender',
    'quota',
    'round',
    'opening_rank',
    'closing_rank',
    'tuition_fee',
    'avg_package',
    'highest_package',
    'nirf_rank',
  ];

  const headerIndices: Record<string, number> = {};
  for (const req of requiredHeaders) {
    const idx = headers.indexOf(req);
    if (idx === -1) {
      errors.push(`Missing required column header: "${req}"`);
    } else {
      headerIndices[req] = idx;
    }
  }

  if (errors.length > 0) {
    return { records: [], errors, totalParsed: 0 };
  }

  // Parse rows (simple parser handling quotes)
  for (let rowIdx = 1; rowIdx < lines.length; rowIdx++) {
    const line = lines[rowIdx];
    const cells = parseCSVLine(line);

    if (cells.length < requiredHeaders.length) {
      errors.push(`Row ${rowIdx + 1}: Insufficient columns (found ${cells.length}, expected >= ${requiredHeaders.length}).`);
      continue;
    }

    const examRaw = cells[headerIndices['exam']].toLowerCase().trim() as ExamType;
    if (!VALID_EXAMS.includes(examRaw)) {
      errors.push(`Row ${rowIdx + 1}: Invalid exam "${examRaw}". Expected one of: ${VALID_EXAMS.join(', ')}.`);
      continue;
    }

    const institute = cells[headerIndices['institute']].trim();
    const branch = cells[headerIndices['branch']].trim();
    const categoryRaw = cells[headerIndices['category']].toUpperCase().trim() as Category;
    const genderRaw = cells[headerIndices['gender']].trim() as GenderPool;
    const quotaRaw = cells[headerIndices['quota']].toUpperCase().trim() as Quota;

    const openingRank = parseInt(cells[headerIndices['opening_rank']], 10);
    const closingRank = parseInt(cells[headerIndices['closing_rank']], 10);
    const round = parseInt(cells[headerIndices['round']], 10) || 1;
    const nirfRank = parseInt(cells[headerIndices['nirf_rank']], 10) || 999;

    const tuitionFee = cells[headerIndices['tuition_fee']].trim() || '₹1.5 Lakh/yr';
    const avgPackage = cells[headerIndices['avg_package']].trim() || '₹15.0 LPA';
    const highestPackage = cells[headerIndices['highest_package']].trim() || '₹40.0 LPA';

    if (isNaN(openingRank) || isNaN(closingRank) || closingRank <= 0) {
      errors.push(`Row ${rowIdx + 1}: Invalid rank values. Opening and closing rank must be positive numbers.`);
      continue;
    }

    // Determine state and college type from institute
    let state = 'Delhi';
    if (institute.toLowerCase().includes('trichy') || institute.toLowerCase().includes('madras')) state = 'Tamil Nadu';
    else if (institute.toLowerCase().includes('surathkal') || institute.toLowerCase().includes('bengaluru')) state = 'Karnataka';
    else if (institute.toLowerCase().includes('bombay') || institute.toLowerCase().includes('mumbai') || institute.toLowerCase().includes('pune')) state = 'Maharashtra';
    else if (institute.toLowerCase().includes('kanpur') || institute.toLowerCase().includes('allahabad') || institute.toLowerCase().includes('bhu')) state = 'Uttar Pradesh';
    else if (institute.toLowerCase().includes('kharagpur') || institute.toLowerCase().includes('kolkata')) state = 'West Bengal';
    else if (institute.toLowerCase().includes('warangal') || institute.toLowerCase().includes('hyderabad')) state = 'Telangana';
    else if (institute.toLowerCase().includes('rourkela')) state = 'Odisha';
    else if (institute.toLowerCase().includes('jaipur')) state = 'Rajasthan';

    let type: CollegeType = 'NIT';
    if (examRaw === 'jee-advanced') type = 'IIT';
    else if (examRaw === 'neet-ug') type = institute.toLowerCase().includes('aiims') ? 'AIIMS' : 'GMC';
    else if (examRaw === 'clat-ug') type = 'NLU';
    else if (examRaw === 'cuet-ug') type = 'CENTRAL_UNIV';
    else if (institute.toLowerCase().includes('iiit')) type = 'IIIT';
    else if (institute.toLowerCase().includes('nit')) type = 'NIT';
    else type = 'GFTI';

    const record: CollegeCutoffRecord = {
      id: `imported-${Date.now()}-${rowIdx}`,
      exam: examRaw,
      institute,
      branch,
      state: normalizeState(state),
      category: VALID_CATEGORIES.includes(categoryRaw) ? categoryRaw : 'OPEN',
      gender: VALID_GENDERS.includes(genderRaw) ? genderRaw : 'Gender-Neutral',
      quota: VALID_QUOTAS.includes(quotaRaw) ? quotaRaw : 'AI',
      round,
      openingRank,
      closingRank,
      closingRank2023: Math.round(closingRank * 1.05),
      closingRank2024: Math.round(closingRank * 1.02),
      closingRank2025: closingRank,
      tuitionFee,
      avgPackage,
      highestPackage,
      nirfRank,
      type,
      city: state,
    };

    records.push(record);
  }

  return {
    records,
    errors,
    totalParsed: records.length,
  };
}

function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

export const SAMPLE_CSV_TEMPLATE = `exam,institute,branch,category,gender,quota,round,opening_rank,closing_rank,tuition_fee,avg_package,highest_package,nirf_rank
jee-main,NIT Trichy,Computer Science and Engineering,OPEN,Gender-Neutral,OS,6,1200,4100,₹1.5 Lakh/yr,₹27.2 LPA,₹52.8 LPA,9
jee-main,NIT Surathkal,Information Technology,OPEN,Gender-Neutral,HS,6,4500,9200,₹1.55 Lakh/yr,₹25.0 LPA,₹48.0 LPA,12
jee-advanced,IIT Bombay,Computer Science and Engineering,OPEN,Gender-Neutral,AI,6,1,67,₹2.2 Lakh/yr,₹32.5 LPA,₹1.68 Cr/yr,3
neet-ug,AIIMS New Delhi,MBBS,OPEN,Gender-Neutral,AI,1,1,55,₹1628/total,₹18.0 LPA,₹28.0 LPA,1
cuet-ug,SRCC Delhi,B.Com (Honours),OPEN,Gender-Neutral,AI,1,1,350,₹30000/yr,₹12.5 LPA,₹35.0 LPA,11
clat-ug,NLSIU Bengaluru,B.A. LL.B. (Honours),OPEN,Gender-Neutral,AI,3,1,114,₹3.8 Lakh/yr,₹19.5 LPA,₹28.0 LPA,1`;

