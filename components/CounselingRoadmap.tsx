import React from 'react';
import {
  Compass,
  MapPin,
  Layers,
  FileCheck,
  TrendingUp,
  Award,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export function CounselingRoadmap() {
  const steps = [
    {
      step: '01',
      title: 'Piecewise Score-to-AIR Interpolation',
      subtitle: 'Why raw marks deceive you',
      description:
        'A score of 180 in JEE Main can mean AIR 12,000 in an easy shift or AIR 6,500 in a tough shift. Our engine calculates empirical percentile distributions across 1.42M candidates with dynamic volatility buffers.',
      badge: 'Scientific Calibration',
    },
    {
      step: '02',
      title: 'The 85% Home State Quota Edge',
      subtitle: 'The secret edge 90% of students overlook',
      description:
        'Institutes like DTU, NSUT, and NITs reserve up to 85% of seats for state domiciles. We apply verified 1.30x Home State relaxation multipliers so you never leave your rightful seat on the table.',
      badge: 'Domicile Optimization',
    },
    {
      step: '03',
      title: 'Safe, Target & Dream Tier Allocation',
      subtitle: 'Zero-risk counseling strategy',
      description:
        'Colleges are classified by Effective Closing Rank ratio: Safe (>92% chance), Target (60–89% chance), and Dream (25–59% chance). This ensures you never face round elimination or seat forfeiture.',
      badge: 'Risk Mitigation',
    },
    {
      step: '04',
      title: 'JoSAA / MCC Choice List Export',
      subtitle: 'Instant ready-to-fill priority order',
      description:
        'Build your customized preference list with real NIRF rankings and placement CTC data. Reorder choices and download a structured .txt file ready for the official JoSAA/CSAB choice portal.',
      badge: '1-Click Submission',
    },
  ];

  return (
    <section className="py-12 border-t border-slate-200 text-left">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Strategic Admission Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            How Indian Counseling Works (And How to Win Your Dream Seat)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
            From mock scores to final allotment: Master the mathematics behind JoSAA, CSAB, and MCC seat matrix.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    Step {s.step}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {s.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {s.title}
                </h3>
                <p className="text-xs font-semibold text-indigo-600">
                  {s.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

