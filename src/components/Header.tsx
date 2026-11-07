import React from 'react';
import { Pill, Volume2, ShieldCheck, Eye } from 'lucide-react';

interface HeaderProps {
  activeTab: 'today' | 'patterns' | 'medicines' | 'doctor' | 'caregiver';
  setActiveTab: (tab: 'today' | 'patterns' | 'medicines' | 'doctor' | 'caregiver') => void;
  onTriggerVoiceReminder: () => void;
  largeText: boolean;
  setLargeText: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onTriggerVoiceReminder,
  largeText,
  setLargeText,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
              <Pill className="w-5 h-5" />
            </div>
            <a
              href="#today"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('today');
              }}
              className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
            >
              NudgeMed
            </a>
          </div>

          {/* Zone 2: Clean single-line text nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('today')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
                activeTab === 'today'
                  ? 'text-teal-700 dark:text-teal-400 border-teal-600 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
              }`}
            >
              Today's Schedule
            </button>
            <button
              onClick={() => setActiveTab('patterns')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
                activeTab === 'patterns'
                  ? 'text-teal-700 dark:text-teal-400 border-teal-600 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
              }`}
            >
              Why I Miss Doses
            </button>
            <button
              onClick={() => setActiveTab('medicines')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
                activeTab === 'medicines'
                  ? 'text-teal-700 dark:text-teal-400 border-teal-600 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
              }`}
            >
              Prescriptions & Stock
            </button>
            <button
              onClick={() => setActiveTab('doctor')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
                activeTab === 'doctor'
                  ? 'text-teal-700 dark:text-teal-400 border-teal-600 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
              }`}
            >
              Doctor's Brief
            </button>
            <button
              onClick={() => setActiveTab('caregiver')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
                activeTab === 'caregiver'
                  ? 'text-teal-700 dark:text-teal-400 border-teal-600 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
              }`}
            >
              Caregiver & Consent
            </button>
          </nav>

          {/* Zone 3: 1 primary action / senior assistance triggers */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setLargeText((prev) => !prev)}
              aria-label="Toggle senior-friendly large text"
              title="Senior-Friendly Large Text Mode"
              className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                largeText
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900'
                  : 'text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Large Text</span>
            </button>
            <button
              onClick={onTriggerVoiceReminder}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
              title="Test Voice Reminder for elderly users"
            >
              <Volume2 className="w-4 h-4" />
              <span>Voice Reminder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 gap-2 text-xs">
        {[
          { id: 'today', label: 'Today' },
          { id: 'patterns', label: 'Patterns & Why' },
          { id: 'medicines', label: 'Medicines' },
          { id: 'doctor', label: 'Doctor Brief' },
          { id: 'caregiver', label: 'Caregiver' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
