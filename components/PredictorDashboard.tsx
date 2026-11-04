'use client';

import React, { useState, useEffect } from 'react';
import {
  ExamType,
  PredictionInput,
  RankAnalysisResult,
  CollegePredictionItem,
  PreferenceItem,
} from '@/lib/predictor/types';
import {
  EXAM_CONFIGS,
  calculateRankAnalysis,
  predictColleges,
} from '@/lib/predictor/engine';
import { getCollegeCutoffs } from '@/lib/predictor/storage';
import { HeroSection } from './HeroSection';
import { ExamTabs } from './ExamTabs';
import { PredictionForm } from './PredictionForm';
import { RankAnalysisCard } from './RankAnalysisCard';
import { CollegePredictionList } from './CollegePredictionList';
import { CollegeComparisonDrawer } from './CollegeComparisonDrawer';
import { PreferenceListDrawer } from './PreferenceListDrawer';
import { SocialShareModal } from './SocialShareModal';
import { FAQSection } from './FAQSection';
import { CounselingRoadmap } from './CounselingRoadmap';
import { StudentProofSection } from './StudentProofSection';
import {
  StudentRegistrationModal,
  StudentRegistrationData,
} from './StudentRegistrationModal';
import { UserCheck, ShieldCheck, User } from 'lucide-react';
import { toast } from 'sonner';

interface PredictorDashboardProps {
  initialExam?: ExamType;
  pageTitle?: string;
  pageSubtitle?: string;
  showHero?: boolean;
}

export function PredictorDashboard({
  initialExam = 'jee-main',
  pageTitle,
  pageSubtitle,
  showHero = true,
}: PredictorDashboardProps) {
  const [selectedExam, setSelectedExam] = useState<ExamType>(initialExam);
  const [analysisResult, setAnalysisResult] = useState<RankAnalysisResult | null>(null);
  const [predictedColleges, setPredictedColleges] = useState<CollegePredictionItem[]>([]);
  const [activeInput, setActiveInput] = useState<PredictionInput | null>(null);
  const [formInitialValues, setFormInitialValues] = useState<Partial<PredictionInput> | undefined>();

  // Mandatory Sign-Up Gating State
  const [registeredStudent, setRegisteredStudent] = useState<StudentRegistrationData | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [pendingInput, setPendingInput] = useState<PredictionInput | null>(null);

  // College Comparison selection (up to 4)
  const [compareItems, setCompareItems] = useState<CollegePredictionItem[]>([]);

  // Counselling Preference List
  const [preferenceItems, setPreferenceItems] = useState<PreferenceItem[]>([]);
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);

  // Social Share Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Load registered student & preferences on mount
  useEffect(() => {
    try {
      const storedStudent = localStorage.getItem('registered_student_v1');
      if (storedStudent) {
        setRegisteredStudent(JSON.parse(storedStudent));
      }

      const storedPrefs = localStorage.getItem('counseling_preferences_v1');
      if (storedPrefs) {
        setPreferenceItems(JSON.parse(storedPrefs));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const savePreferences = (items: PreferenceItem[]) => {
    setPreferenceItems(items);
    try {
      localStorage.setItem('counseling_preferences_v1', JSON.stringify(items));
    } catch (err) {
      console.error(err);
    }
  };

  // Reset/Clear Stale Results immediately
  const handleReset = () => {
    setAnalysisResult(null);
    setPredictedColleges([]);
    setActiveInput(null);
  };

  // Handle Exam Switching
  const handleExamChange = (newExam: ExamType) => {
    setSelectedExam(newExam);
    setFormInitialValues(undefined);
    handleReset();
    setCompareItems([]);
  };

  // Core execution logic
  const executeCalculation = (input: PredictionInput) => {
    try {
      // 1. Calculate Rank, Percentile, and Volatility Range
      const analysis = calculateRankAnalysis(input);
      setAnalysisResult(analysis);
      setActiveInput(input);

      // 2. Fetch Cutoff Database and Run Multiplier/Quota Logic
      const allCutoffs = getCollegeCutoffs();
      const predictions = predictColleges(analysis, allCutoffs, input);
      setPredictedColleges(predictions);

      toast.success(
        `Predicted AIR #${analysis.estimatedRank.toLocaleString('en-IN')} with ${predictions.length} matching college programs!`
      );
    } catch (err: any) {
      toast.error(err.message || 'Error executing prediction calculation.');
    }
  };

  // Form Submit Handler with Mandatory Sign-up Gating
  const handlePredictAttempt = (input: PredictionInput) => {
    // If student has NOT registered yet, gate results and trigger mandatory sign-up modal
    if (!registeredStudent) {
      setPendingInput(input);
      setIsRegistrationModalOpen(true);
      return;
    }

    // If already registered, execute calculation immediately
    executeCalculation(input);
  };

  // Callback when student completes registration
  const handleRegistrationComplete = (student: StudentRegistrationData) => {
    setRegisteredStudent(student);
    setIsRegistrationModalOpen(false);

    if (pendingInput) {
      executeCalculation(pendingInput);
      setPendingInput(null);
    }
  };

  // Handle Scenario Click from Hero
  const handleSelectScenario = (preset: {
    exam: ExamType;
    mode: 'marks' | 'percentile' | 'rank';
    value: number;
    homeState: string;
  }) => {
    setSelectedExam(preset.exam);
    const input: PredictionInput = {
      exam: preset.exam,
      mode: preset.mode,
      marks: preset.mode === 'marks' ? preset.value : undefined,
      percentile: preset.mode === 'percentile' ? preset.value : undefined,
      rank: preset.mode === 'rank' ? preset.value : undefined,
      category: 'OPEN',
      gender: 'Gender-Neutral',
      homeState: preset.homeState,
    };
    setFormInitialValues(input);
    handlePredictAttempt(input);
  };

  // Compare Toggle
  const handleToggleCompare = (item: CollegePredictionItem) => {
    const exists = compareItems.some((c) => c.record.id === item.record.id);
    if (exists) {
      setCompareItems(compareItems.filter((c) => c.record.id !== item.record.id));
      toast.info(`Removed ${item.record.institute} from comparison.`);
    } else {
      if (compareItems.length >= 4) {
        toast.warning('You can compare a maximum of 4 colleges at once.');
        return;
      }
      setCompareItems([...compareItems, item]);
      toast.success(`Added ${item.record.institute} to comparison.`);
    }
  };

  // Preference List Toggle
  const handleTogglePreference = (item: CollegePredictionItem) => {
    const exists = preferenceItems.some((p) => p.collegeId === item.record.id);
    if (exists) {
      const updated = preferenceItems.filter((p) => p.collegeId !== item.record.id);
      savePreferences(updated);
      toast.info(`Removed ${item.record.institute} from Preference List.`);
    } else {
      const newItem: PreferenceItem = {
        id: `pref-${Date.now()}-${item.record.id}`,
        collegeId: item.record.id,
        institute: item.record.institute,
        branch: item.record.branch,
        quota: item.record.quota,
        closingRank: item.effectiveClosingRank,
        chanceLabel: item.chanceLabel,
        nirfRank: item.record.nirfRank,
        avgPackage: item.record.avgPackage,
        addedAt: Date.now(),
      };
      const updated = [...preferenceItems, newItem];
      savePreferences(updated);
      toast.success(`Added choice #${updated.length}: ${item.record.institute}`);
    }
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('registered_student_v1');
    } catch (e) {
      console.error(e);
    }
    setRegisteredStudent(null);
    handleReset();
    toast.info('Signed out. You will be prompted to sign up upon next prediction.');
  };

  const currentConfig = EXAM_CONFIGS[selectedExam];

  return (
    <div className="w-full space-y-12">
      {/* Student-Focused Hero Section */}
      {showHero && <HeroSection onSelectScenario={handleSelectScenario} />}

      {/* Main Predictor Engine Anchor */}
      <div id="predictor-engine" className="space-y-8 pt-4">
        {/* Section Header & Registered Badge */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          {registeredStudent && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span>Registered Student: <strong>{registeredStudent.fullName}</strong> (+91 {registeredStudent.phone})</span>
              <button
                onClick={handleSignOut}
                className="text-[10px] text-slate-500 hover:text-rose-600 underline ml-1"
                title="Sign out of this session"
              >
                (Switch)
              </button>
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {pageTitle || 'Interactive College & Rank Forecaster 2027'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {pageSubtitle ||
              'Select your exam, enter your marks, percentile or AIR, and explore safe vs target colleges.'}
          </p>
        </div>

        {/* Exam Switcher Tabs */}
        <ExamTabs
          selectedExam={selectedExam}
          onSelectExam={handleExamChange}
        />

        {/* Main Form */}
        <PredictionForm
          exam={selectedExam}
          onPredict={handlePredictAttempt}
          onReset={handleReset}
          initialValues={formInitialValues}
        />

        {/* Results View - Only shown once student is registered and calculation is done */}
        {analysisResult && activeInput && registeredStudent && (
          <div className="space-y-8 animate-fade-in">
            {/* Rank Analysis Card */}
            <RankAnalysisCard
              analysis={analysisResult}
              category={activeInput.category}
              gender={activeInput.gender}
              homeState={activeInput.homeState}
              onOpenShareModal={() => setIsShareModalOpen(true)}
            />

            {/* College Predictions */}
            <div className="pt-4 text-left">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Eligible Colleges &amp; Branches for {registeredStudent.fullName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculated against official 2023–2025 closing ranks for your reservation &amp; domicile.
                  </p>
                </div>
              </div>

              <CollegePredictionList
                items={predictedColleges}
                candidateRank={analysisResult.estimatedRank}
                selectedCompareList={compareItems}
                onToggleCompare={handleToggleCompare}
                preferenceList={preferenceItems.map((p) => p.collegeId)}
                onTogglePreference={handleTogglePreference}
              />
            </div>
          </div>
        )}
      </div>

      {/* Counseling Roadmap Section (Educational & SEO-Rich) */}
      <CounselingRoadmap />

      {/* Student Social Proof & Real Stories */}
      <StudentProofSection />

      {/* FAQ Section */}
      <FAQSection config={currentConfig} />

      {/* Sticky Bottom Comparison Drawer */}
      <CollegeComparisonDrawer
        selectedItems={compareItems}
        onRemoveItem={(id) => setCompareItems(compareItems.filter((c) => c.record.id !== id))}
        onClearAll={() => setCompareItems([])}
      />

      {/* Preference List Modal */}
      <PreferenceListDrawer
        isOpen={isPreferenceModalOpen}
        onClose={() => setIsPreferenceModalOpen(false)}
        items={preferenceItems}
        onReorder={savePreferences}
        onRemove={(id) => savePreferences(preferenceItems.filter((p) => p.id !== id))}
        onClear={() => savePreferences([])}
      />

      {/* Social Share Modal */}
      {analysisResult && activeInput && (
        <SocialShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          analysis={analysisResult}
          topColleges={predictedColleges}
          category={activeInput.category}
          gender={activeInput.gender}
          homeState={activeInput.homeState}
        />
      )}

      {/* Mandatory Student Registration Modal */}
      <StudentRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        pendingInput={pendingInput}
        predictedRank={analysisResult?.estimatedRank}
        onRegistrationSuccess={handleRegistrationComplete}
      />
    </div>
  );
}
