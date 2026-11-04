'use client';

import React, { useState } from 'react';
import { RankAnalysisResult, CollegePredictionItem, Category, GenderPool } from '@/lib/predictor/types';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: RankAnalysisResult;
  topColleges: CollegePredictionItem[];
  category: Category;
  gender: GenderPool;
  homeState: string;
}

export function SocialShareModal({
  isOpen,
  onClose,
  analysis,
  topColleges,
  category,
  gender,
  homeState,
}: SocialShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  // Build shareable URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const searchParams = new URLSearchParams({
    exam: analysis.examConfig.id,
    rank: String(analysis.estimatedRank),
    category,
    gender,
    state: homeState,
  });
  if (analysis.estimatedMarks !== undefined) {
    searchParams.set('marks', String(analysis.estimatedMarks));
  }
  const shareableUrl = `${baseUrl}/?${searchParams.toString()}`;

  // Build message text for WhatsApp/Telegram
  const safeColleges = topColleges.slice(0, 3).map((c) => `• ${c.record.institute} (${c.record.branch}) [${c.chanceLabel}]`).join('\n');
  const shareMessage = `🎯 My ${analysis.examConfig.name} 2027 Forecast:
🏆 Estimated AIR: #${analysis.estimatedRank.toLocaleString('en-IN')} (Range: ${analysis.likelyRankRange.minRank.toLocaleString('en-IN')} – ${analysis.likelyRankRange.maxRank.toLocaleString('en-IN')})
📊 Percentile: ${analysis.estimatedPercentile.toFixed(2)}%ile
🏛️ Eligible Top Colleges:
${safeColleges || 'Check platform for eligible institutes'}

Predict your rank & colleges free on RankPredictor:
${shareableUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    toast.success('Shareable link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopiedText(true);
    toast.success('Formatted summary copied! Ready to paste into WhatsApp/Telegram.');
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareableUrl)}&text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Share Prediction Report
              </h3>
              <p className="text-xs text-slate-500">
                Share your estimated rank and eligible colleges with friends and family.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preview Card */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 text-xs space-y-2 mb-5">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
            <span>{analysis.examConfig.name} Predicted Rank</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
              AIR #{analysis.estimatedRank.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
            Likely Range: {analysis.likelyRankRange.minRank.toLocaleString('en-IN')} – {analysis.likelyRankRange.maxRank.toLocaleString('en-IN')} ({analysis.estimatedPercentile.toFixed(2)}%ile)
          </p>
          <div className="pt-2 border-t border-indigo-200/50 dark:border-indigo-900/50 text-[11px] text-slate-500">
            {topColleges.length > 0 && `${topColleges.length} eligible programs calculated based on your domicile and reservation category.`}
          </div>
        </div>

        {/* Quick Social Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={handleWhatsAppShare}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Share to WhatsApp</span>
          </button>
          <button
            onClick={handleTelegramShare}
            className="py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            <Send className="h-4 w-4" />
            <span>Share to Telegram</span>
          </button>
        </div>

        {/* Shareable Link Input */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
              Direct Shareable Link:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shrink-0 transition flex items-center gap-1"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div>
            <button
              onClick={handleCopyText}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2"
            >
              {copiedText ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              <span>{copiedText ? 'Formatted Text Copied!' : 'Copy Formatted Text Summary'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

