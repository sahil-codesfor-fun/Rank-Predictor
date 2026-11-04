'use client';

import React, { useState, useEffect } from 'react';
import {
  ExamType,
  InputMode,
  Category,
  GenderPool,
  PredictionInput,
} from '@/lib/predictor/types';
import { EXAM_CONFIGS, validateInput } from '@/lib/predictor/engine';
import { INDIAN_STATES } from '@/lib/predictor/states';
import {
  Sparkles,
  Calculator,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface PredictionFormProps {
  exam: ExamType;
  onPredict: (input: PredictionInput) => void;
  onReset: () => void;
  initialValues?: Partial<PredictionInput>;
}

export function PredictionForm({
  exam,
  onPredict,
  onReset,
  initialValues,
}: PredictionFormProps) {
  const config = EXAM_CONFIGS[exam];

  const [mode, setMode] = useState<InputMode>(initialValues?.mode || 'marks');
  const [marks, setMarks] = useState<string>(
    initialValues?.marks !== undefined ? String(initialValues.marks) : ''
  );
  const [percentile, setPercentile] = useState<string>(
    initialValues?.percentile !== undefined ? String(initialValues.percentile) : ''
  );
  const [rank, setRank] = useState<string>(
    initialValues?.rank !== undefined ? String(initialValues.rank) : ''
  );
  const [category, setCategory] = useState<Category>(
    initialValues?.category || 'OPEN'
  );
  const [gender, setGender] = useState<GenderPool>(
    initialValues?.gender || 'Gender-Neutral'
  );
  const [homeState, setHomeState] = useState<string>(
    initialValues?.homeState || 'Delhi'
  );

  const [validationError, setValidationError] = useState<string | null>(null);

  // When exam prop changes, reset values to avoid cross-exam stale state
  useEffect(() => {
    if (initialValues?.exam && initialValues.exam === exam) {
      // Sync from initialValues if matching
      if (initialValues.mode) setMode(initialValues.mode);
      if (initialValues.marks !== undefined) setMarks(String(initialValues.marks));
      if (initialValues.percentile !== undefined) setPercentile(String(initialValues.percentile));
      if (initialValues.rank !== undefined) setRank(String(initialValues.rank));
      if (initialValues.category) setCategory(initialValues.category);
      if (initialValues.gender) setGender(initialValues.gender);
      if (initialValues.homeState) setHomeState(initialValues.homeState);
    } else {
      setMarks('');
      setPercentile('');
      setRank('');
      setValidationError(null);
      onReset();
    }
  }, [exam, initialValues]);

  // Handle Input Changes with immediate stale result clearing
  const handleModeChange = (newMode: InputMode) => {
    setMode(newMode);
    setValidationError(null);
    onReset(); // Immediately clear stale cards
  };

  const handleMarksChange = (val: string) => {
    setMarks(val);
    setValidationError(null);
    onReset(); // Immediate reset on input change
  };

  const handlePercentileChange = (val: string) => {
    setPercentile(val);
    setValidationError(null);
    onReset();
  };

  const handleRankChange = (val: string) => {
    setRank(val);
    setValidationError(null);
    onReset();
  };

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    onReset();
  };

  const handleGenderChange = (g: GenderPool) => {
    setGender(g);
    onReset();
  };

  const handleStateChange = (st: string) => {
    setHomeState(st);
    onReset();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: PredictionInput = {
      exam,
      mode,
      category,
      gender,
      homeState,
      marks: mode === 'marks' && marks !== '' ? parseFloat(marks) : undefined,
      percentile:
        mode === 'percentile' && percentile !== ''
          ? parseFloat(percentile)
          : undefined,
      rank: mode === 'rank' && rank !== '' ? parseInt(rank, 10) : undefined,
    };

    const validation = validateInput(payload);
    if (!validation.valid) {
      setValidationError(validation.error || 'Please enter valid credentials.');
      onReset();
      return;
    }

    setValidationError(null);
    onPredict(payload);
  };

  const handleResetClick = () => {
    setMarks('');
    setPercentile('');
    setRank('');
    setValidationError(null);
    onReset();
  };

  // Quick preset scores for testing/convenience
  const handleQuickPreset = (presetScore: number) => {
    if (mode === 'marks') {
      setMarks(String(presetScore));
    } else if (mode === 'percentile') {
      setPercentile(String(presetScore));
    } else {
      setRank(String(presetScore));
    }
    setValidationError(null);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-500/5 border border-slate-200/90 dark:border-slate-800">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Header & Mode Switcher */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-indigo-600" />
                Score & Domicile Parameters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your input metric and reservation credentials for tailored prediction.
              </p>
            </div>

            {/* Segmented Mode Control */}
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => handleModeChange('marks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'marks'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Marks (0–{config.maxMarks})
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('percentile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'percentile'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Percentile (%ile)
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('rank')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'rank'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Target Rank (AIR)
              </button>
            </div>
          </div>

          {/* Primary Input Metric with Wheel Disable */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {mode === 'marks' && `Your Expected ${config.name} Marks (out of ${config.maxMarks})`}
              {mode === 'percentile' && `Your Estimated Percentile (0.00 – 100.00)`}
              {mode === 'rank' && `Your All India Rank (AIR ≥ 1)`}
            </label>

            {mode === 'marks' && (
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max={config.maxMarks}
                  step="any"
                  value={marks}
                  onChange={(e) => handleMarksChange(e.target.value)}
                  onWheel={(e) => {
                    e.preventDefault();
                    (e.target as HTMLElement).blur();
                  }}
                  placeholder={`e.g. ${Math.round(config.maxMarks * 0.75)}`}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  / {config.maxMarks}
                </span>
              </div>
            )}

            {mode === 'percentile' && (
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.0001"
                  value={percentile}
                  onChange={(e) => handlePercentileChange(e.target.value)}
                  onWheel={(e) => {
                    e.preventDefault();
                    (e.target as HTMLElement).blur();
                  }}
                  placeholder="e.g. 98.7521"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  %ile
                </span>
              </div>
            )}

            {mode === 'rank' && (
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={rank}
                  onChange={(e) => handleRankChange(e.target.value)}
                  onWheel={(e) => {
                    e.preventDefault();
                    (e.target as HTMLElement).blur();
                  }}
                  placeholder="e.g. 4500"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  AIR
                </span>
              </div>
            )}

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto py-1">
              <span className="text-[11px] text-slate-400 font-medium">Quick presets:</span>
              {mode === 'marks' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(Math.round(config.maxMarks * 0.90))}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    Top Tier ({Math.round(config.maxMarks * 0.90)})
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(Math.round(config.maxMarks * 0.70))}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    Moderate ({Math.round(config.maxMarks * 0.70)})
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(Math.round(config.maxMarks * 0.50))}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    Average ({Math.round(config.maxMarks * 0.50)})
                  </button>
                </>
              )}
              {mode === 'percentile' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(99.5)}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    99.5%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(98.0)}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    98.0%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(95.0)}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    95.0%
                  </button>
                </>
              )}
              {mode === 'rank' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(1200)}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    AIR 1,200
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(5500)}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    AIR 5,500
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(15000)}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    AIR 15,000
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Reservation & Domicile Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category (Reservation)
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as Category)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="OPEN">OPEN / General (1.0x)</option>
              <option value="GEN-EWS">GEN-EWS (1.22x Multiplier)</option>
              <option value="OBC-NCL">OBC-NCL (1.35x Multiplier)</option>
              <option value="SC">SC (2.10x Multiplier)</option>
              <option value="ST">ST (2.85x Multiplier)</option>
            </select>
          </div>

          {/* Gender Pool */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Gender Pool
            </label>
            <select
              value={gender}
              onChange={(e) => handleGenderChange(e.target.value as GenderPool)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Gender-Neutral">Gender-Neutral</option>
              {config.pools.includes('Female-only') && (
                <option value="Female-only">Female-only (Supernumerary 1.20x)</option>
              )}
            </select>
          </div>

          {/* Home State (All 36 States & UTs) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Home State (Domicile)</span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400">36 States & UTs</span>
            </label>
            <div className="relative">
              <select
                value={homeState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none truncate"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 animate-shake">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Form Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="submit"
            className="w-full sm:flex-1 py-3 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
          >
            <Sparkles className="h-4 w-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Predict My Rank &amp; Eligible Colleges</span>
          </button>

          <button
            type="button"
            onClick={handleResetClick}
            className="w-full sm:w-auto py-3 px-4 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-1.5"
            title="Reset Form and Clear Stale Results"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </form>
    </div>
  );
}

