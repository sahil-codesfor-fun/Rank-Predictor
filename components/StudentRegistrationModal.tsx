'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  School,
  MapPin,
  Calendar,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { INDIAN_STATES } from '@/lib/predictor/states';
import { PredictionInput } from '@/lib/predictor/types';
import { toast } from 'sonner';

export interface StudentRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  academicStatus: 'Class 12th Appearing' | 'Class 12th Passed / Dropper' | 'Class 11th';
  targetYear: '2025' | '2026' | '2027';
  city: string;
  state: string;
  schoolOrCoaching: string;
  agreeConsent: boolean;
}

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingInput: PredictionInput | null;
  predictedRank?: number;
  onRegistrationSuccess: (student: StudentRegistrationData) => void;
}

export function StudentRegistrationModal({
  isOpen,
  onClose,
  pendingInput,
  predictedRank,
  onRegistrationSuccess,
}: StudentRegistrationModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [academicStatus, setAcademicStatus] = useState<StudentRegistrationData['academicStatus']>('Class 12th Appearing');
  const [targetYear, setTargetYear] = useState<StudentRegistrationData['targetYear']>('2027');
  const [city, setCity] = useState('');
  const [state, setState] = useState(pendingInput?.homeState || 'Delhi');
  const [schoolOrCoaching, setSchoolOrCoaching] = useState('');
  const [agreeConsent, setAgreeConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Strict validation for every mandatory field
    if (!fullName.trim() || fullName.trim().length < 2) {
      setValidationError('Full Name is mandatory (minimum 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setValidationError('A valid Email address is mandatory.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      setValidationError('A valid 10-digit Mobile / WhatsApp Number is mandatory.');
      return;
    }

    if (!city.trim()) {
      setValidationError('Your City is mandatory.');
      return;
    }

    if (!state.trim()) {
      setValidationError('Your State is mandatory.');
      return;
    }

    if (!schoolOrCoaching.trim()) {
      setValidationError('Your School or Coaching Institute Name is mandatory.');
      return;
    }

    if (!agreeConsent) {
      setValidationError('You must agree to the counseling updates consent to proceed.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      academicStatus,
      targetYear,
      city: city.trim(),
      state: state.trim(),
      schoolOrCoaching: schoolOrCoaching.trim(),
      agreeConsent,
      exam: pendingInput?.exam || 'jee-main',
      mode: pendingInput?.mode || 'marks',
      scoreOrRank:
        pendingInput?.mode === 'marks'
          ? pendingInput.marks
          : pendingInput?.mode === 'percentile'
          ? pendingInput.percentile
          : pendingInput?.rank || 0,
      category: pendingInput?.category || 'OPEN',
      gender: pendingInput?.gender || 'Gender-Neutral',
      homeState: pendingInput?.homeState || state,
      predictedRank: predictedRank || undefined,
    };

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to save student details in database.');
      }

      // Persist in client-side storage so student doesn't need to sign up again
      const studentData: StudentRegistrationData = {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        academicStatus: payload.academicStatus,
        targetYear: payload.targetYear,
        city: payload.city,
        state: payload.state,
        schoolOrCoaching: payload.schoolOrCoaching,
        agreeConsent: true,
      };

      try {
        localStorage.setItem('registered_student_v1', JSON.stringify(studentData));
      } catch (e) {
        console.error(e);
      }

      toast.success(`Welcome, ${payload.fullName}! Your predicted colleges and rank are now unlocked.`);
      onRegistrationSuccess(studentData);
    } catch (err: any) {
      setValidationError(err.message || 'An error occurred while saving your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          title="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-left space-y-2 pb-5 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Lock className="h-3.5 w-3.5 text-indigo-600" />
            <span>Mandatory Student Sign-Up to Unlock Results</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Unlock Your Predicted Rank &amp; Eligible Colleges
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            Every detail is <strong>mandatory and securely registered in our counseling database</strong> to verify your state quota, eligibility tier, and cutoff forecast.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-left">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aarav@gmail.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Mobile / WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp / Mobile No. <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-500 pointer-events-none">
                  <span>🇮🇳 +91</span>
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-16 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Academic Status & Target Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Academic Status <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={academicStatus}
                onChange={(e) => setAcademicStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Class 12th Appearing">Class 12th Appearing</option>
                <option value="Class 12th Passed / Dropper">Class 12th Passed / Dropper</option>
                <option value="Class 11th">Class 11th</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Exam Year <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="2027">2027 Session</option>
                <option value="2026">2026 Session</option>
                <option value="2025">2025 Session</option>
              </select>
            </div>
          </div>

          {/* City & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Jaipur, Lucknow, Patna"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* School or Coaching Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              School or Coaching Institute Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <School className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={schoolOrCoaching}
                onChange={(e) => setSchoolOrCoaching(e.target.value)}
                placeholder="e.g. Allen Career Institute, FIITJEE, Aakash, DPS"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreeConsent}
                onChange={(e) => setAgreeConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-600 leading-snug">
                I agree to save my details in the counseling database and receive official cutoffs, JoSAA/MCC updates, and personalized admission guidance on WhatsApp and Email. <span className="text-rose-500">*</span>
              </span>
            </label>
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Saving &amp; Unlocking Forecast...</span>
                </>
              ) : (
                <>
                  <span>Save Details &amp; Unlock Predicted Colleges</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>100% Privacy Protected • Stored Securely in Database</span>
          </div>
        </form>
      </div>
    </div>
  );
}

