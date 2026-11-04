'use client';

import React from 'react';
import { CollegePredictionItem, PreferenceItem } from '@/lib/predictor/types';
import {
  Building2,
  Award,
  Wallet,
  Briefcase,
  TrendingUp,
  Plus,
  Check,
  BookmarkCheck,
  CheckSquare,
  Square,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

interface CollegeCardProps {
  item: CollegePredictionItem;
  candidateRank: number;
  isSelectedForCompare: boolean;
  onToggleCompare: (item: CollegePredictionItem) => void;
  isInPreferenceList: boolean;
  onTogglePreference: (item: CollegePredictionItem) => void;
}

export function CollegeCard({
  item,
  candidateRank,
  isSelectedForCompare,
  onToggleCompare,
  isInPreferenceList,
  onTogglePreference,
}: CollegeCardProps) {
  const { record, effectiveClosingRank, chance, chanceLabel, probability, bufferDelta, isHomeStateApplied } = item;

  // Chance styles
  const chanceColors: Record<string, { badge: string; border: string; bar: string; text: string }> = {
    HIGH: {
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
      border: 'hover:border-emerald-400',
      bar: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    MODERATE: {
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
      border: 'hover:border-blue-400',
      bar: 'bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
    },
    AMBITIOUS: {
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
      border: 'hover:border-amber-400',
      bar: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
    },
    LOW: {
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
      border: 'hover:border-rose-400',
      bar: 'bg-rose-500',
      text: 'text-rose-600 dark:text-rose-400',
    },
  };

  const currentTheme = chanceColors[chance] || chanceColors.LOW;

  // Buffer progress calculation (capped between 5% and 100%)
  const bufferPercent = Math.max(5, Math.min(100, Math.round((effectiveClosingRank / (candidateRank * 1.5)) * 100)));

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 transition-all duration-200 shadow-sm hover:shadow-md ${currentTheme.border} ${
        isSelectedForCompare ? 'ring-2 ring-indigo-500 bg-indigo-50/20' : ''
      }`}
    >
      {/* Top row: Institute, Type, NIRF & Checkbox */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {record.type}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
              <Award className="h-3.5 w-3.5" />
              NIRF #{record.nirfRank}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {record.city}, {record.state}
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            {record.institute}
          </h4>

          <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            {record.branch}
          </p>
        </div>

        {/* Compare Checkbox */}
        <button
          onClick={() => onToggleCompare(item)}
          className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
            isSelectedForCompare
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
          }`}
          title="Select to compare up to 4 colleges"
        >
          {isSelectedForCompare ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Compare</span>
        </button>
      </div>

      {/* Middle row: Admission Chance & Quota Details */}
      <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${currentTheme.badge}`}>
            {chanceLabel} ({probability}% Chance)
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Quota: {record.quota}
          </span>
          {isHomeStateApplied && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              ✓ HS 1.30x Applied
            </span>
          )}
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block font-medium">Effective Cutoff Rank</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">
            CR ~{effectiveClosingRank.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Visual Buffer Progress Bar */}
      <div className="mt-3 space-y-1">
        <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <span>Rank Safety Margin</span>
          <span className={currentTheme.text}>
            {bufferDelta >= 0 ? `+${bufferDelta.toLocaleString('en-IN')} rank cushion` : `${bufferDelta.toLocaleString('en-IN')} rank gap`}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${currentTheme.bar}`}
            style={{ width: `${bufferPercent}%` }}
          />
        </div>
      </div>

      {/* Stats Grid: Fees, Packages & 3-Year Trend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        {/* Tuition Fee */}
        <div className="p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40">
          <span className="text-[10px] text-slate-400 font-medium block flex items-center gap-1">
            <Wallet className="h-3 w-3" /> Tuition Fee
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
            {record.tuitionFee}
          </span>
        </div>

        {/* Avg Package */}
        <div className="p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40">
          <span className="text-[10px] text-slate-400 font-medium block flex items-center gap-1">
            <Briefcase className="h-3 w-3" /> Avg Package
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate block">
            {record.avgPackage}
          </span>
        </div>

        {/* Highest Package */}
        <div className="p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40">
          <span className="text-[10px] text-slate-400 font-medium block flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Highest CTC
          </span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400 truncate block">
            {record.highestPackage}
          </span>
        </div>

        {/* 3-Year Closing Rank Trend */}
        <div className="p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40">
          <span className="text-[10px] text-slate-400 font-medium block">
            Cutoff Trend (23/24/25)
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] block">
            {record.closingRank2023 || '-'} → {record.closingRank2024 || '-'} → {record.closingRank2025 || '-'}
          </span>
        </div>
      </div>

      {/* Card Action: Add to Preference List */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          onClick={() => onTogglePreference(item)}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isInPreferenceList
              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 hover:bg-emerald-100'
              : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900'
          }`}
        >
          {isInPreferenceList ? (
            <>
              <BookmarkCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>In Preference List</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5 text-indigo-600" />
              <span>Add to Preference List</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

