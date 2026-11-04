'use client';

import React from 'react';
import { ExamType } from '@/lib/predictor/types';
import { EXAM_CONFIGS } from '@/lib/predictor/engine';
import { Award, Users, BookOpen, ShieldCheck, Scale, Stethoscope, Compass } from 'lucide-react';

interface ExamTabsProps {
  selectedExam: ExamType;
  onSelectExam: (exam: ExamType) => void;
}

const EXAM_ICONS: Record<ExamType, React.ElementType> = {
  'jee-main': Compass,
  'jee-advanced': Award,
  'neet-ug': Stethoscope,
  'cuet-ug': BookOpen,
  'clat-ug': Scale,
};

export function ExamTabs({ selectedExam, onSelectExam }: ExamTabsProps) {
  const currentConfig = EXAM_CONFIGS[selectedExam];

  return (
    <div className="w-full">
      {/* Tabs list */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
        {(Object.keys(EXAM_CONFIGS) as ExamType[]).map((examKey) => {
          const config = EXAM_CONFIGS[examKey];
          const isSelected = selectedExam === examKey;
          const Icon = EXAM_ICONS[examKey];

          return (
            <button
              key={examKey}
              onClick={() => onSelectExam(examKey)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span>{config.name}</span>
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Exam Details Banner */}
      <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {currentConfig.fullName}
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700">
                Max {currentConfig.maxMarks} Marks
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                Session {currentConfig.examYear}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {currentConfig.description} • Target: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentConfig.targetInstitutes}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
              <Users className="h-3.5 w-3.5 text-indigo-500" />
              <span>{currentConfig.candidateVolumeLabel}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Auth: {currentConfig.authorities.join(' & ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

