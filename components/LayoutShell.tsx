'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PreferenceListDrawer } from './PreferenceListDrawer';
import { PreferenceItem } from '@/lib/predictor/types';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [preferenceItems, setPreferenceItems] = useState<PreferenceItem[]>([]);
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);

  useEffect(() => {
    const loadPrefs = () => {
      try {
        const stored = localStorage.getItem('counseling_preferences_v1');
        if (stored) {
          setPreferenceItems(JSON.parse(stored));
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadPrefs();
    window.addEventListener('storage', loadPrefs);
    return () => window.removeEventListener('storage', loadPrefs);
  }, []);

  const savePreferences = (items: PreferenceItem[]) => {
    setPreferenceItems(items);
    try {
      localStorage.setItem('counseling_preferences_v1', JSON.stringify(items));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors">
      <Header
        preferenceCount={preferenceItems.length}
        onOpenPreferences={() => setIsPreferenceModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>

      <Footer />

      <PreferenceListDrawer
        isOpen={isPreferenceModalOpen}
        onClose={() => setIsPreferenceModalOpen(false)}
        items={preferenceItems}
        onReorder={savePreferences}
        onRemove={(id) => savePreferences(preferenceItems.filter((p) => p.id !== id))}
        onClear={() => savePreferences([])}
      />
    </div>
  );
}

