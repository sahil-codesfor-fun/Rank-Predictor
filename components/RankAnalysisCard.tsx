'use client';

import React from 'react';
import { RankAnalysisResult, Category, GenderPool } from '@/lib/predictor/types';
import {
  TrendingUp,
  Target,
  Percent,
  ShieldCheck,
  Share2,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';

interface RankAnalysisCardProps {
  analysis: RankAnalysisResult;
  category: Category;
  gender: GenderPool;
  homeState: string;
  onOpenShareModal: () => void;
}

export function RankAnalysisCard({
  analysis,
  category,
  gender,
  homeState,
  onOpenShareModal,
}: RankAnalysisCardProps) {
  const {
    estimatedRank,
    likelyRankRange,
    estimatedPercentile,
    confidence,
    volatilityBufferPercent,
    summary,
    examConfig,
  } = analysis;

  const isHighConfidence = confidence === 'High';

  return (
    <div className="w-full bg-gradient-to-br from-white via-indigo-50/20 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-500/10 border-2 border-indigo-200/80 dark:border-indigo-800/80 transition-all">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {examConfig.name} Rank & Percentile Forecast
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isHighConfidence
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300'
                }`}
              >
                ● {confidence} Confidence
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluated with JoSAA/MCC 2027 Calibration Model & Empirical Buffer
            </p>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={onOpenShareModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 shadow-xs transition"
          title="Share Prediction Report on WhatsApp / Telegram"
        >
          <Share2 className="h-4 w-4" />
          <span>Share Analysis</span>
        </button>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        {/* Metric 1: Estimated AIR */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <span>Predicted AIR</span>
            <Target className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
            #{estimatedRank.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">All India Rank Estimate</p>
        </div>

        {/* Metric 2: Likely Rank Range */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <span>Likely Rank Range</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              ±{volatilityBufferPercent}% Buffer
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {likelyRankRange.minRank.toLocaleString('en-IN')} – {likelyRankRange.maxRank.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Volatility band for exam cohort size
          </p>
        </div>

        {/* Metric 3: Estimated Percentile */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <span>Estimated Percentile</span>
            <Percent className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {estimatedPercentile.toFixed(3)}%ile
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Out of {examConfig.candidateVolumeLabel}
          </p>
        </div>
      </div>

      {/* Applied Criteria Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
        <span className="text-slate-500 font-medium">Applied Criteria:</span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
          Category: <strong className="text-indigo-600 dark:text-indigo-400">{category}</strong>
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
          Pool: <strong className="text-indigo-600 dark:text-indigo-400">{gender}</strong>
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
          Home State: <strong className="text-indigo-600 dark:text-indigo-400">{homeState}</strong>
        </span>
      </div>

      {/* Analytical Interpretation Summary Box */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="text-indigo-950 dark:text-indigo-200 font-bold block mb-0.5">
            Analytical Insight & Strategic Takeaway:
          </strong>
          {summary}
        </div>
      </div>
    </div>
  );
}

