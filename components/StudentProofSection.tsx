import React from 'react';
import { Star, Quote, Award, Building, HeartHandshake } from 'lucide-react';

export function StudentProofSection() {
  const reviews = [
    {
      student: 'Aarav Singhania',
      college: 'DTU (Delhi Technological University)',
      branch: 'Computer Engineering (Software)',
      exam: 'JEE Main',
      score: '97.2 %ile (AIR 31,400)',
      quote:
        '“I was completely depressed thinking 97.2 percentile wouldn’t get me any top college in Delhi. This platform’s Home State quota forecast showed me that DTU Software was in my Target tier! Joined DTU and currently in 2nd year. Forever grateful!”',
    },
    {
      student: 'Sneha Mukherjee',
      college: 'KGMU (King George’s Medical University)',
      branch: 'MBBS (Bachelor of Medicine)',
      exam: 'NEET UG',
      score: '624 Marks (AIR 14,800)',
      quote:
        '“Private college agents were asking for ₹40 Lakh donation claiming I’d never get a GMC. The NEET predictor clearly categorized KGMU State Quota as a viable Target. Got my allotment letter in MCC Round 2!”',
    },
    {
      student: 'Aditya Raj',
      college: 'NIT Trichy',
      branch: 'Electronics and Communication (ECE)',
      exam: 'JEE Main & Adv',
      score: '99.1 %ile (AIR 9,800)',
      quote:
        '“The side-by-side college comparison drawer made all the difference between choosing a lower branch at IIT BHU vs ECE at NIT Trichy. Placement stats and median packages were 100% accurate.”',
    },
  ];

  return (
    <section className="py-12 border-t border-slate-200 text-left">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <HeartHandshake className="h-3.5 w-3.5 text-emerald-600" />
            <span>Real Aspirant Success Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How Smart Choice Filling Changed Their Destinations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Read how verified students turned their confusion into confirmed allotments across top colleges in India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium italic">
                  {r.quote}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1">
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                  <span>{r.student}</span>
                  <span className="text-[10px] text-indigo-600 font-bold px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                    {r.exam}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-800 truncate">
                  {r.college}
                </p>
                <p className="text-[10px] text-slate-400">
                  {r.branch} • {r.score}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

