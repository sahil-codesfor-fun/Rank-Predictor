import { CollegeCutoffRecord } from './types';
import { INITIAL_COLLEGE_CUTOFFS } from './data';

const STORAGE_KEY = 'college_cutoffs_v1';

export function getCollegeCutoffs(): CollegeCutoffRecord[] {
  if (typeof window === 'undefined') {
    return INITIAL_COLLEGE_CUTOFFS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_COLLEGE_CUTOFFS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to parse cutoffs from localStorage', err);
  }

  return INITIAL_COLLEGE_CUTOFFS;
}

export function saveCollegeCutoffs(records: CollegeCutoffRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save cutoffs to localStorage', err);
  }
}

export function resetCollegeCutoffs(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset cutoffs', err);
  }
}

