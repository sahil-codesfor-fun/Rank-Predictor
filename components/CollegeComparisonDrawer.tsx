'use client';

import React, { useState } from 'react';
import { CollegePredictionItem } from '@/lib/predictor/types';
import {
  X,
  Scale,
  Award,
  Wallet,
  Briefcase,
  TrendingUp,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface CollegeComparisonDrawerProps {
  selectedItems: CollegePredictionItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export function CollegeComparisonDrawer({
  selectedItems,
  onRemoveItem,
  onClearAll,
}: CollegeComparisonDrawerProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  if (selectedItems.length === 0) return null;

  return (
    <>
      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-slate-900/95 text-white dark:bg-slate-950/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 animate-slide-up">
        <div className="flex items-center gap-3 overflow-x-auto py-1 max-w-full sm:max-w-xl">
          <div className="flex items-center gap-1.5 shrink-0">
            <Scale className="h-5 w-5 text-indigo-400" />
            <span className="text-xs font-bold">
              Compare ({selectedItems.length}/4):
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedItems.map((item) => (
              <div
                key={item.record.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 text-xs text-slate-200 border border-slate-700 shrink-0"
              >
                <span className="font-semibold truncate max-w-[120px] sm:max-w-[160px]">
                  {item.record.institute}
                </span>
                <button
                  onClick={() => onRemoveItem(item.record.id)}
                  className="text-slate-400 hover:text-rose-400 transition"
                  title="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsOpenModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition"
          >
            Compare Side-by-Side
          </button>
          <button
            onClick={onClearAll}
            className="px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
            title="Clear all selected"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Side-by-Side College Comparison
                  </h3>
                  <p className="text-xs text-slate-500">
                    Evaluating {selectedItems.length} shortlisted programs across NIRF, packages, fees, and cutoffs.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpenModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Comparison Table / Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3 font-bold text-slate-400 uppercase w-48">Parameter</th>
                    {selectedItems.map((item) => (
                      <th key={item.record.id} className="p-3 font-bold text-slate-900 dark:text-white min-w-[200px]">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            {item.record.type}
                          </span>
                          <div className="font-bold text-sm leading-tight">{item.record.institute}</div>
                          <div className="text-[11px] font-normal text-slate-500">{item.record.branch}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {/* NIRF Ranking */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500 flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-amber-500" /> NIRF Rank
                    </td>
                    {selectedItems.map((item) => (
                      <td key={item.record.id} className="p-3 font-bold text-slate-900 dark:text-white">
                        #{item.record.nirfRank}
                      </td>
                    ))}
                  </tr>

                  {/* Admission Probability & Tier */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500">Admission Tier</td>
                    {selectedItems.map((item) => (
                      <td key={item.record.id} className="p-3">
                        <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                          {item.chanceLabel} ({item.probability}% Chance)
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Effective Cutoff Rank */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500">Effective Closing Rank</td>
                    {selectedItems.map((item) => (
                      <td key={item.record.id} className="p-3 font-bold text-slate-900 dark:text-white">
                        CR ~{item.effectiveClosingRank.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>

                  {/* Average Package */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500 flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-emerald-500" /> Average Package
                    </td>
                    {selectedItems.map((item) => (
                      <td key={item.record.id} className="p-3 font-black text-emerald-600 dark:text-emerald-400">
                        {item.record.avgPackage}
                      </td>
                    ))}
                  </tr>

                  {/* Highest CTC */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-indigo-500" /> Highest CTC
                    </td>
                    {selectedItems.map((item) => (
                      <td key={item.record.id} className="p-3 font-bold text-slate-900 dark:text-white">
                        {item.record.highestPackage}
                      </td>
                    ))}
                  </tr>

                  {/* Tuition Fee */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500 flex items-center gap-1.5">
                      <Wallet className="h-4 w-4 text-blue-500" /> Tuition Fee
                    </td>
                    {selectedItems.map((item) => (
                      <td key={item.record.id} className="p-3 text-slate-700 dark:text-slate-300">
                        {item.record.tuitionFee}
                      </td>
                    ))}
                  </tr>

                  {/* Location & Quota */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" /> City & Quota
                    </td>
                    {selectedItems.map((item) => (
                      <td key={item.record.id} className="p-3 text-slate-600 dark:text-slate-400">
                        {item.record.city}, {item.record.state} (Quota: {item.record.quota})
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsOpenModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

