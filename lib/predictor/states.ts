export const INDIAN_STATES: string[] = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const STATE_ALIASES: Record<string, string> = {
  "delhi": "Delhi",
  "nct of delhi": "Delhi",
  "national capital territory of delhi": "Delhi",
  "new delhi": "Delhi",
  "up": "Uttar Pradesh",
  "uttar pradesh": "Uttar Pradesh",
  "mp": "Madhya Pradesh",
  "madhya pradesh": "Madhya Pradesh",
  "ap": "Andhra Pradesh",
  "andhra pradesh": "Andhra Pradesh",
  "andhra": "Andhra Pradesh",
  "wb": "West Bengal",
  "west bengal": "West Bengal",
  "bengal": "West Bengal",
  "tn": "Tamil Nadu",
  "tamil nadu": "Tamil Nadu",
  "tamilnadu": "Tamil Nadu",
  "ts": "Telangana",
  "telangana": "Telangana",
  "mh": "Maharashtra",
  "maharashtra": "Maharashtra",
  "rj": "Rajasthan",
  "rajasthan": "Rajasthan",
  "gj": "Gujarat",
  "gujarat": "Gujarat",
  "ka": "Karnataka",
  "karnataka": "Karnataka",
  "kl": "Kerala",
  "kerala": "Kerala",
  "pb": "Punjab",
  "punjab": "Punjab",
  "hr": "Haryana",
  "haryana": "Haryana",
  "uk": "Uttarakhand",
  "uttarakhand": "Uttarakhand",
  "uttaranchal": "Uttarakhand",
  "hp": "Himachal Pradesh",
  "himachal": "Himachal Pradesh",
  "himachal pradesh": "Himachal Pradesh",
  "jk": "Jammu and Kashmir",
  "j&k": "Jammu and Kashmir",
  "jammu & kashmir": "Jammu and Kashmir",
  "jammu and kashmir": "Jammu and Kashmir",
  "jh": "Jharkhand",
  "jharkhand": "Jharkhand",
  "br": "Bihar",
  "bihar": "Bihar",
  "cg": "Chhattisgarh",
  "chhattisgarh": "Chhattisgarh",
  "orissa": "Odisha",
  "odisha": "Odisha",
  "od": "Odisha",
  "as": "Assam",
  "assam": "Assam",
  "ch": "Chandigarh",
  "chandigarh": "Chandigarh",
  "py": "Puducherry",
  "pondicherry": "Puducherry",
  "puducherry": "Puducherry",
  "ga": "Goa",
  "goa": "Goa",
  "sk": "Sikkim",
  "sikkim": "Sikkim",
  "tr": "Tripura",
  "tripura": "Tripura",
  "mn": "Manipur",
  "manipur": "Manipur",
  "ml": "Meghalaya",
  "meghalaya": "Meghalaya",
  "mz": "Mizoram",
  "mizoram": "Mizoram",
  "nl": "Nagaland",
  "nagaland": "Nagaland",
  "ar": "Arunachal Pradesh",
  "arunachal pradesh": "Arunachal Pradesh",
  "ladakh": "Ladakh",
  "lakshadweep": "Lakshadweep",
  "andaman": "Andaman and Nicobar Islands",
  "andaman and nicobar": "Andaman and Nicobar Islands",
  "andaman and nicobar islands": "Andaman and Nicobar Islands",
  "daman and diu": "Dadra and Nagar Haveli and Daman and Diu",
  "dadra and nagar haveli": "Dadra and Nagar Haveli and Daman and Diu",
  "dnh": "Dadra and Nagar Haveli and Daman and Diu",
};

/**
 * Normalizes state name handling casing, abbreviations, and common aliases.
 */
export function normalizeState(stateName: string): string {
  if (!stateName) return "";
  const cleaned = stateName.trim().toLowerCase().replace(/[^a-z0-9& ]/g, " ");
  const normalizedKey = cleaned.replace(/\s+/g, " ").trim();

  if (STATE_ALIASES[normalizedKey]) {
    return STATE_ALIASES[normalizedKey];
  }

  // Exact or partial match check with INDIAN_STATES
  const match = INDIAN_STATES.find(
    (s) => s.toLowerCase() === normalizedKey
  );
  if (match) return match;

  return stateName.trim();
}

/**
 * Checks if candidate state matches the institute state for Home State (HS) eligibility.
 */
export function isHomeStateMatch(candidateState: string, instituteState: string): boolean {
  const normCandidate = normalizeState(candidateState);
  const normInstitute = normalizeState(instituteState);
  if (!normCandidate || !normInstitute) return false;
  return normCandidate.toLowerCase() === normInstitute.toLowerCase();
}

