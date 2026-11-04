'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Download,
  Search,
  RefreshCw,
  Phone,
  Mail,
  School,
  MapPin,
  Calendar,
  Award,
} from 'lucide-react';
import { StudentLead } from '@/lib/db/students';
import { toast } from 'sonner';

export default function AdminLeadsPage() {
  const [students, setStudents] = useState<StudentLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.students) {
        setStudents(data.students);
      }
    } catch (e) {
      toast.error('Failed to load registered student leads.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.schoolOrCoaching.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    if (students.length === 0) {
      toast.error('No student leads to export.');
      return;
    }

    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Academic Status',
      'Target Year',
      'City',
      'State',
      'School/Coaching',
      'Exam',
      'Score/Rank',
      'Category',
      'Predicted AIR',
      'Registered At',
    ];

    const rows = students.map((s) => [
      `"${s.id}"`,
      `"${s.fullName}"`,
      `"${s.email}"`,
      `"${s.phone}"`,
      `"${s.academicStatus}"`,
      `"${s.targetYear}"`,
      `"${s.city}"`,
      `"${s.state}"`,
      `"${s.schoolOrCoaching}"`,
      `"${s.exam}"`,
      `"${s.scoreOrRank}"`,
      `"${s.category}"`,
      `"${s.predictedRank || 'N/A'}"`,
      `"${s.createdAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_leads_database_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported student leads database to CSV successfully!');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-left py-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Predictor</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            <span>Registered Student Leads Database</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified registrations captured via mandatory sign-up gating before cutoff results.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLeads}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV ({students.length})</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, email, city..."
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          Total Registered: <strong className="text-indigo-600">{filtered.length} Leads</strong>
        </span>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[65vh]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 text-slate-600 font-bold">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Phone &amp; WhatsApp</th>
                <th className="p-3">Email</th>
                <th className="p-3">City &amp; State</th>
                <th className="p-3">School / Coaching</th>
                <th className="p-3">Academic Status</th>
                <th className="p-3">Exam / Score</th>
                <th className="p-3">Predicted AIR</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3 font-bold text-slate-900">{s.fullName}</td>
                    <td className="p-3 font-mono font-semibold text-slate-800">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3 text-emerald-600" />
                        +91 {s.phone}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{s.email}</td>
                    <td className="p-3 text-slate-600">
                      {s.city}, {s.state}
                    </td>
                    <td className="p-3 text-slate-700 font-medium">{s.schoolOrCoaching}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700">
                        {s.academicStatus}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-indigo-700">
                      <span className="uppercase text-[10px] block text-slate-400">{s.exam}</span>
                      {s.scoreOrRank} ({s.mode})
                    </td>
                    <td className="p-3 font-black text-slate-900">
                      {s.predictedRank ? `#${s.predictedRank.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="p-3 text-[10px] text-slate-400">
                      {new Date(s.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 text-xs">
                    {isLoading ? 'Loading leads from database...' : 'No registered student leads found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

