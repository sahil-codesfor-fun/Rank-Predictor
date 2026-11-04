'use client';

import React, { useState, useMemo } from 'react';
import {
  CollegePredictionItem,
  ChanceLabel,
  CollegeType,
  Quota,
} from '@/lib/predictor/types';
import { CollegeCard } from './CollegeCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Building,
  GraduationCap,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';

interface CollegePredictionListProps {
  items: CollegePredictionItem[];
  candidateRank: number;
  selectedCompareList: CollegePredictionItem[];
  onToggleCompare: (item: CollegePredictionItem) => void;
  preferenceList: string[]; // array of collegeIds
  onTogglePreference: (item: CollegePredictionItem) => void;
}

export function CollegePredictionList({
  items,
  candidateRank,
  selectedCompareList,
  onToggleCompare,
  preferenceList,
  onTogglePreference,
}: CollegePredictionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<ChanceLabel | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<CollegeType | 'ALL'>('ALL');
  const [selectedQuota, setSelectedQuota] = useState<Quota | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'probability' | 'nirf' | 'package' | 'cutoff'>('probability');

  // Count items by tier
  const tierCounts = useMemo(() => {
    const counts = { ALL: items.length, Safe: 0, Target: 0, Dream: 0, Low: 0 };
    for (const item of items) {
      if (counts[item.chanceLabel] !== undefined) {
        counts[item.chanceLabel]++;
      }
    }
    return counts;
  }, [items]);

  // Extract distinct college types
  const availableTypes = useMemo(() => {
    const set = new Set<CollegeType>();
    items.forEach((i) => set.add(i.record.type));
    return Array.from(set);
  }, [items]);

  // Filtered & sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = item.record.institute.toLowerCase().includes(q);
          const matchesBranch = item.record.branch.toLowerCase().includes(q);
          const matchesCity = item.record.city.toLowerCase().includes(q);
          if (!matchesName && !matchesBranch && !matchesCity) return false;
        }

        // Tier filter
        if (selectedTier !== 'ALL' && item.chanceLabel !== selectedTier) {
          return false;
        }

        // College Type filter
        if (selectedType !== 'ALL' && item.record.type !== selectedType) {
          return false;
        }

        // Quota filter
        if (selectedQuota !== 'ALL' && item.record.quota !== selectedQuota) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'probability') {
          return b.probability - a.probability;
        }
        if (sortBy === 'nirf') {
          return a.record.nirfRank - b.record.nirfRank;
        }
        if (sortBy === 'cutoff') {
          return a.effectiveClosingRank - b.effectiveClosingRank;
        }
        if (sortBy === 'package') {
          const parseP = (str: string) => parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
          return parseP(b.record.avgPackage) - parseP(a.record.avgPackage);
        }
        return 0;
      });
  }, [items, searchQuery, selectedTier, selectedType, selectedQuota, sortBy]);

  return (
    <div className="w-full space-y-6">
      {/* Tier Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedTier('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTier === 'ALL'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Eligible ({tierCounts.ALL})
          </button>
          <button
            onClick={() => setSelectedTier('Safe')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTier === 'Safe'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700'
            }`}
          >
            Safe Tier ({tierCounts.Safe})
          </button>
          <button
            onClick={() => setSelectedTier('Target')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTier === 'Target'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-700'
            }`}
          >
            Target Tier ({tierCounts.Target})
          </button>
          <button
            onClick={() => setSelectedTier('Dream')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTier === 'Dream'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-700'
            }`}
          >
            Dream Tier ({tierCounts.Dream})
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          <ArrowUpDown className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
          >
            <option value="probability">Highest Probability</option>
            <option value="nirf">NIRF Ranking (Top First)</option>
            <option value="package">Average Package (High to Low)</option>
            <option value="cutoff">Effective Cutoff Rank</option>
          </select>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by institute name, branch, or city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* College Type Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All College Types</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Quota Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={selectedQuota}
            onChange={(e) => setSelectedQuota(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Quotas (AI, HS, OS)</option>
            <option value="AI">AI (All India)</option>
            <option value="HS">HS (Home State)</option>
            <option value="OS">OS (Other State)</option>
          </select>
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          Showing <strong>{filteredItems.length}</strong> matching college programs
        </span>
        {filteredItems.length !== items.length && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTier('ALL');
              setSelectedType('ALL');
              setSelectedQuota('ALL');
            }}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* College Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isSelectedForCompare = selectedCompareList.some(
              (c) => c.record.id === item.record.id
            );
            const isInPreference = preferenceList.includes(item.record.id);

            return (
              <CollegeCard
                key={item.record.id}
                item={item}
                candidateRank={candidateRank}
                isSelectedForCompare={isSelectedForCompare}
                onToggleCompare={onToggleCompare}
                isInPreferenceList={isInPreference}
                onTogglePreference={onTogglePreference}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
          <GraduationCap className="h-10 w-10 text-slate-400 mx-auto mb-2 opacity-50" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No college programs match current filters
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Try adjusting your search keywords, switching from Safe to Dream tiers, or clearing quota filters.
          </p>
        </div>
      )}
    </div>
  );
}

