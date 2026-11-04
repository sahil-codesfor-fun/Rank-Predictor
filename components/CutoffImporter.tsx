'use client';

import React, { useState, useEffect } from 'react';
import {
  parseCutoffsCSV,
  SAMPLE_CSV_TEMPLATE,
  CSVParseResult,
} from '@/lib/predictor/csv';
import {
  getCollegeCutoffs,
  saveCollegeCutoffs,
  resetCollegeCutoffs,
} from '@/lib/predictor/storage';
import { CollegeCutoffRecord } from '@/lib/predictor/types';
import {
  FileSpreadsheet,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Trash2,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export function CutoffImporter() {
  const [csvContent, setCsvContent] = useState('');
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [currentRecords, setCurrentRecords] = useState<CollegeCutoffRecord[]>([]);

  useEffect(() => {
    setCurrentRecords(getCollegeCutoffs());
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      setCsvContent(text);
      handleParse(text);
    };
    reader.readAsText(file);
  };

  const handleParse = (text: string) => {
    if (!text.trim()) {
      setParseResult(null);
      return;
    }
    const result = parseCutoffsCSV(text);
    setParseResult(result);
  };

  const handleImportSave = () => {
    if (!parseResult || parseResult.records.length === 0) {
      toast.error('No valid cutoff records to import.');
      return;
    }

    // Merge or replace records
    const existing = getCollegeCutoffs();
    const updated = [...parseResult.records, ...existing];
    saveCollegeCutoffs(updated);
    setCurrentRecords(updated);
    toast.success(`Successfully imported ${parseResult.records.length} new college cutoff records!`);
    setCsvContent('');
    setParseResult(null);
  };

  const handleResetToDefault = () => {
    if (confirm('Are you sure you want to reset all cutoffs to the default empirical database?')) {
      resetCollegeCutoffs();
      setCurrentRecords(getCollegeCutoffs());
      toast.success('Database reset to default calibration cutoffs.');
    }
  };

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cutoffs_sample_template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Sample CSV template downloaded!');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Predictor</span>
        </Link>
        <span className="text-xs text-slate-400">
          Current Database Size: <strong className="text-indigo-600 dark:text-indigo-400">{currentRecords.length} records</strong>
        </span>
      </div>

      {/* Main Importer Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Admin CSV Cutoff Importer
              </h2>
              <p className="text-xs text-slate-500">
                Bulk upload JoSAA, MCC, CSAB, or NLU closing rank records into the local database engine.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSample}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Sample CSV</span>
            </button>
            <button
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition"
              title="Reset to default mock cutoffs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Expected Format Description */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-indigo-500" />
            Required CSV Header Schema (13 Columns):
          </h4>
          <code className="block p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-indigo-700 dark:text-indigo-300 break-all select-all">
            exam,institute,branch,category,gender,quota,round,opening_rank,closing_rank,tuition_fee,avg_package,highest_package,nirf_rank
          </code>
          <p className="text-[11px] text-slate-500">
            • <strong>exam:</strong> <code>jee-main</code>, <code>jee-advanced</code>, <code>neet-ug</code>, <code>cuet-ug</code>, or <code>clat-ug</code><br />
            • <strong>quota:</strong> <code>AI</code>, <code>HS</code>, or <code>OS</code> | <strong>category:</strong> <code>OPEN</code>, <code>GEN-EWS</code>, <code>OBC-NCL</code>, <code>SC</code>, <code>ST</code>
          </p>
        </div>

        {/* Upload Zone */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-indigo-500 transition-colors bg-slate-50/50 dark:bg-slate-800/30">
            <Upload className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Drag & Drop your CSV cutoff file, or browse
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports CSV with standard comma-separated delimiter
            </p>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="mt-3 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Or Paste Raw CSV Data Directly:
            </label>
            <textarea
              rows={5}
              value={csvContent}
              onChange={(e) => {
                setCsvContent(e.target.value);
                handleParse(e.target.value);
              }}
              placeholder={`Paste CSV records here...\n${SAMPLE_CSV_TEMPLATE}`}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Validation Errors */}
        {parseResult && parseResult.errors.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              Parsing Warnings ({parseResult.errors.length}):
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] max-h-32 overflow-y-auto">
              {parseResult.errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Preview of Parsed Records */}
        {parseResult && parseResult.records.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Ready to Import: {parseResult.records.length} Valid Records</span>
              </div>
              <button
                onClick={handleImportSave}
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
              >
                Confirm & Import Records
              </button>
            </div>

            <div className="overflow-x-auto max-h-60 rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                  <tr>
                    <th className="p-2 font-bold">Exam</th>
                    <th className="p-2 font-bold">Institute</th>
                    <th className="p-2 font-bold">Branch</th>
                    <th className="p-2 font-bold">Category</th>
                    <th className="p-2 font-bold">Quota</th>
                    <th className="p-2 font-bold">Closing Rank</th>
                    <th className="p-2 font-bold">Avg Package</th>
                    <th className="p-2 font-bold">NIRF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {parseResult.records.slice(0, 15).map((r, i) => (
                    <tr key={i}>
                      <td className="p-2 font-semibold text-indigo-600">{r.exam}</td>
                      <td className="p-2 font-medium">{r.institute}</td>
                      <td className="p-2 text-slate-500">{r.branch}</td>
                      <td className="p-2">{r.category}</td>
                      <td className="p-2">{r.quota}</td>
                      <td className="p-2 font-bold">{r.closingRank}</td>
                      <td className="p-2">{r.avgPackage}</td>
                      <td className="p-2">#{r.nirfRank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parseResult.records.length > 15 && (
              <p className="text-[11px] text-slate-400 text-center">
                ...and {parseResult.records.length - 15} more records
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

