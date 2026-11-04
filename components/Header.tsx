'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Sparkles,
  FileSpreadsheet,
  ListOrdered,
  Search,
  ArrowRight,
  Users,
  UserCheck,
} from 'lucide-react';

interface HeaderProps {
  preferenceCount?: number;
  onOpenPreferences?: () => void;
}

export function Header({ preferenceCount = 0, onOpenPreferences }: HeaderProps) {
  const pathname = usePathname();
  const [studentName, setStudentName] = useState<string | null>(null);

  useEffect(() => {
    const checkStudent = () => {
      try {
        const stored = localStorage.getItem('registered_student_v1');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.fullName) {
            setStudentName(parsed.fullName.split(' ')[0]);
          }
        } else {
          setStudentName(null);
        }
      } catch (e) {
        console.error(e);
      }
    };

    checkStudent();
    window.addEventListener('storage', checkStudent);
    return () => window.removeEventListener('storage', checkStudent);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/jee-main-college-predictor', label: 'JEE Main' },
    { href: '/jee-advanced-college-predictor', label: 'JEE Adv' },
    { href: '/neet-college-predictor', label: 'NEET UG' },
    { href: '/cuet-college-predictor', label: 'CUET UG' },
    { href: '/clat-college-predictor', label: 'CLAT UG' },
  ];

  const scrollToCalculator = () => {
    const el = document.getElementById('predictor-engine');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo matching TestExplorer dark square badge */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
              RP
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-950">
                  RankPredictor
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  2027
                </span>
              </div>
            </div>
          </Link>

          {/* Center Navigation Links with clean light pill styling */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-bold border border-indigo-200/60'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Student Logged In Indicator */}
            {studentName && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Hi, {studentName}</span>
              </span>
            )}

            {/* Leads Database Link */}
            <Link
              href="/admin/leads"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 transition"
              title="View Registered Student Leads Database"
            >
              <Users className="h-3.5 w-3.5 text-indigo-600" />
              <span>Leads DB</span>
            </Link>

            {/* Preference List Trigger */}
            <button
              onClick={onOpenPreferences}
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 hover:border-indigo-400 transition"
              title="View Counselling Preference List"
            >
              <ListOrdered className="h-3.5 w-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Preferences</span>
              {preferenceCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 min-w-4 h-4 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                  {preferenceCount}
                </span>
              )}
            </button>

            {/* Get Started Pill Button */}
            <button
              onClick={scrollToCalculator}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-95 transition"
            >
              <span>Predict Colleges</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
