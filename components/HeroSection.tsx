'use client';

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  Zap,
  HelpCircle,
  Building2,
  Star,
  BookOpen,
} from 'lucide-react';
import { ExamType } from '@/lib/predictor/types';

export interface StudentDilemma {
  id: string;
  exam: ExamType;
  badge: string;
  studentQuote: string;
  dialogue: string;
  solution: string;
  actionValue: number;
  actionMode: 'marks' | 'percentile' | 'rank';
  state: string;
}

export const STUDENT_DILEMMAS: StudentDilemma[] = [
  {
    id: 'd1',
    exam: 'jee-main',
    badge: 'JEE Main 2027',
    studentQuote: '“Bhaiya, 98.4 percentile pe NIT CSE milega ya Core branch lena padega?”',
    dialogue: 'Should I sacrifice the Computer Science branch for a top-tier NIT campus?',
    solution: 'You qualify for NIT Calicut CSE, NIT Kurukshetra IT, and VNIT Nagpur ECE without branch compromise.',
    actionValue: 98.4,
    actionMode: 'percentile',
    state: 'Delhi',
  },
  {
    id: 'd2',
    exam: 'neet-ug',
    badge: 'NEET UG 2027',
    studentQuote: '“Scoring 618 in NEET — Will I get a Government Medical College or take a Drop?”',
    dialogue: 'Is a government MBBS seat realistic under 85% State Quota at this score?',
    solution: 'Yes! State Quota closing ranks for UP, MP, WB & Rajasthan GMCs comfortably accommodate 610–625 marks.',
    actionValue: 618,
    actionMode: 'marks',
    state: 'Uttar Pradesh',
  },
  {
    id: 'd3',
    exam: 'jee-advanced',
    badge: 'JEE Advanced',
    studentQuote: '“Rank 2,200: Lower branch at IIT Bombay vs Top CSE at NIT Trichy / Surathkal?”',
    dialogue: 'Does the IIT Bombay brand override a Tier-1 NIT flagship Computer Science degree?',
    solution: 'Evaluate placement CTCs, non-core tech eligibility, and branch-change policies before locking JoSAA Round 1.',
    actionValue: 2200,
    actionMode: 'rank',
    state: 'Maharashtra',
  },
  {
    id: 'd4',
    exam: 'cuet-ug',
    badge: 'CUET UG 2027',
    studentQuote: '“Scored 745/800: Can I get North Campus SRCC / Hindu or only South Campus?”',
    dialogue: 'How does DU CSAS normalize cutoffs across domain subjects and categories?',
    solution: 'You are in the Target Tier for SRCC B.Com (Hons) and Safe Tier for Ramjas & Hansraj College.',
    actionValue: 745,
    actionMode: 'marks',
    state: 'Delhi',
  },
];

interface HeroSectionProps {
  onSelectScenario?: (preset: any) => void;
}

export function HeroSection({ onSelectScenario }: HeroSectionProps) {
  const scrollToCalculator = () => {
    const el = document.getElementById('predictor-engine');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full pt-4 pb-12 overflow-hidden text-left">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-100/50 via-slate-50/20 to-transparent blur-3xl -z-10 pointer-events-none" />

      {/* Main Student-Focused Hero Container */}
      <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Trust Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-white text-indigo-700 border border-indigo-200/90 shadow-sm">
          <Sparkles className="h-4 w-4 text-amber-500 animate-spin-slow" />
          <span>India’s Most Trusted Student Counseling &amp; Rank Forecaster</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>

        {/* Primary Headline with Exact Requested Text */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.08]">
            Confused What <br />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 bg-clip-text text-transparent">
              To Choose?
            </span>
          </h1>
          <p className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-[1.12]">
            Turn Your Preparation Into Real Possibilities.
          </p>
        </div>

        {/* Compelling Student Dialogue Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
          Don’t let unpredictable cutoffs and confusing JoSAA, CSAB &amp; MCC rules waste 2 years of relentless hard work. <strong className="text-slate-900 font-bold">Discover your exact All India Rank, 85% Home State Quota advantage, and safe college tiers</strong> before official counseling begins.
        </p>

        {/* Action CTAs & Student Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={scrollToCalculator}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-3 group"
          >
            <span>Predict My Colleges &amp; Rank Free</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <a
            href="#student-dilemmas"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <HelpCircle className="h-4 w-4 text-indigo-600" />
            <span>"What Should I Choose?" Dilemma Guide</span>
          </a>
        </div>

        {/* Real Student Proof Bar */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <span className="inline-block h-7 w-7 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                IIT
              </span>
              <span className="inline-block h-7 w-7 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                NIT
              </span>
              <span className="inline-block h-7 w-7 rounded-full bg-amber-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                GMC
              </span>
            </div>
            <span><strong>50,000+ Students</strong> Guided across JoSAA &amp; MCC</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-1.5 text-amber-500">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-slate-800">4.9 / 5</span>
            <span className="text-slate-500">(1,840+ Aspirant Reviews)</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>100% Verified Cutoff Calibration (2023–2025)</span>
          </div>
        </div>
      </div>

      {/* Interactive Student Dilemmas Grid (SEO-Rich & Highly Engaging) */}
      <div id="student-dilemmas" className="mt-14 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
              Real Student Questions &amp; Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Questions That Keep Aspirants Awake at 2:00 AM
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Click any dilemma below to auto-simulate your admission chances and view matching institutes:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STUDENT_DILEMMAS.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (onSelectScenario) {
                  onSelectScenario({
                    exam: item.exam,
                    mode: item.actionMode,
                    value: item.actionValue,
                    homeState: item.state,
                  });
                }
                scrollToCalculator();
              }}
              className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                    {item.badge}
                  </span>
                  <span className="text-[11px] font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Simulate This</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>

                <p className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {item.studentQuote}
                </p>

                <p className="text-xs font-semibold text-slate-500 italic">
                  Key dilemma: {item.dialogue}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 block">
                  ✓ Counselor’s Analytical Breakdown:
                </span>
                <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                  {item.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
