import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ExternalLink, Award, Sparkles, Users } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: About */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                RP
              </div>
              <span className="font-extrabold text-base text-slate-900">
                RankPredictor India
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standalone mathematical forecasting engine delivering empirical rank curves, JoSAA/MCC category multipliers, and quota-aware college admission probability analysis.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Based on 2023–2025 Opening &amp; Closing Cutoffs</span>
            </div>
          </div>

          {/* Col 2: Exams Covered */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Supported Exams
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/jee-main-college-predictor" className="hover:text-indigo-600 transition">
                  JEE Main (JoSAA &amp; CSAB)
                </Link>
              </li>
              <li>
                <Link href="/jee-advanced-college-predictor" className="hover:text-indigo-600 transition">
                  JEE Advanced (23 IITs)
                </Link>
              </li>
              <li>
                <Link href="/neet-college-predictor" className="hover:text-indigo-600 transition">
                  NEET UG (MCC &amp; AIIMS)
                </Link>
              </li>
              <li>
                <Link href="/cuet-college-predictor" className="hover:text-indigo-600 transition">
                  CUET UG (DU CSAS &amp; BHU)
                </Link>
              </li>
              <li>
                <Link href="/clat-college-predictor" className="hover:text-indigo-600 transition">
                  CLAT UG (26+ NLUs)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Official Counseling
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a
                  href="https://josaa.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-indigo-600 transition"
                >
                  JoSAA Official <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://csab.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-indigo-600 transition"
                >
                  CSAB Special Rounds <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://mcc.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-indigo-600 transition"
                >
                  MCC NEET Counseling <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://consortiumofnlus.ac.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-indigo-600 transition"
                >
                  Consortium of NLUs <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Tools & Admin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Tools &amp; Admin
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/admin/leads" className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-800 transition">
                  <Users className="h-3.5 w-3.5" />
                  <span>Student Leads Database</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/import-cutoffs" className="hover:text-indigo-600 transition">
                  Bulk CSV Cutoff Importer
                </Link>
              </li>
              <li>
                <span className="text-slate-400">JoSAA Choice Filling Simulator</span>
              </li>
              <li>
                <span className="text-slate-400">Home State vs Other State Quotas</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Standalone College &amp; Rank Predictor Platform. All rights reserved.</p>
          <p className="text-[11px] text-slate-400">
            Disclaimer: Predictions are calculated estimates based on empirical cutoff trends and should be used as guidance only.
          </p>
        </div>
      </div>
    </footer>
  );
}
