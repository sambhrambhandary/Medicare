import React, { useState } from 'react';
import { Medicine, SkipReasonType } from '../types';
import { Brain, AlertCircle, PackageX, Sparkles, Navigation, FileQuestion, X, CheckCircle2 } from 'lucide-react';

interface ReasonModalProps {
  isOpen: boolean;
  medicine: Medicine | null;
  scheduledTime: string;
  onClose: () => void;
  onSubmit: (reason: SkipReasonType, details?: string, note?: string) => void;
}

const REASONS: {
  id: SkipReasonType;
  title: string;
  icon: any;
  shortDesc: string;
  tags?: string[];
  helperNote?: string;
  badge?: string;
}[] = [
  {
    id: 'forgot',
    title: 'Forgot',
    icon: Brain,
    shortDesc: 'Routine interrupted or distracted by other tasks.',
    tags: ['Busy with chores', 'Fell asleep early', 'Out of normal routine', 'Didn’t hear reminder'],
  },
  {
    id: 'side_effects',
    title: 'Side Effects / Discomfort',
    icon: AlertCircle,
    shortDesc: 'Experienced unpleasant physical symptoms after previous doses.',
    tags: ['Dizziness / Lightheaded', 'Nausea / Upset Stomach', 'Fatigue / Drowsiness', 'Headache', 'Dry cough'],
    helperNote: 'This will be flagged safely in your Doctor’s Clinical Brief for discussion.',
    badge: 'Clinical Alert',
  },
  {
    id: 'ran_out',
    title: 'Ran Out of Medicine',
    icon: PackageX,
    shortDesc: 'Bottle is empty, misplaced, or pharmacy refill delayed.',
    tags: ['Refill not yet ready', 'Pills finished early', 'Left bottle elsewhere'],
    helperNote: 'We can automate a 7-day early restock alert so you never hit empty.',
    badge: 'Restock Issue',
  },
  {
    id: 'felt_fine',
    title: 'Felt Fine / No Symptoms',
    icon: Sparkles,
    shortDesc: 'Felt healthy and didn’t feel the need for medication today.',
    tags: ['No pain or symptoms', 'Felt energetic', 'Thought it was optional'],
    helperNote: 'Important: Maintenance medications (blood pressure, cholesterol) protect your organs quietly even when you feel great.',
  },
  {
    id: 'away_from_home',
    title: 'Away from Home',
    icon: Navigation,
    shortDesc: 'Travelling, at work, or didn’t carry the daily pill pouch.',
    tags: ['At work', 'Visiting family', 'Left pouch at home'],
  },
  {
    id: 'other',
    title: 'Other Reason',
    icon: FileQuestion,
    shortDesc: 'Something else not listed above.',
  },
];

export const ReasonModal: React.FC<ReasonModalProps> = ({
  isOpen,
  medicine,
  scheduledTime,
  onClose,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState<SkipReasonType>('forgot');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');

  if (!isOpen || !medicine) return null;

  const currentReasonObj = REASONS.find((r) => r.id === selectedReason);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedReason, selectedTag, customNote.trim() || undefined);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>{medicine.condition}</span>
              <span aria-hidden="true">·</span>
              <span>Scheduled {scheduledTime}</span>
            </div>
            <h2 id="modal-title" className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              Skipping {medicine.name} ({medicine.dosage})
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reassuring Banner */}
        <div className="px-6 py-3 bg-teal-50/80 dark:bg-teal-950/30 border-b border-teal-100 dark:border-teal-900/50">
          <p className="text-xs text-teal-800 dark:text-teal-200 leading-relaxed">
            <span className="font-semibold">It is completely okay.</span> Life happens and routines shift. Learning why helps us adapt your reminders and keep you safe.
          </p>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              What made it difficult to take this dose?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {REASONS.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedReason === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setSelectedReason(r.id);
                      setSelectedTag('');
                    }}
                    className={`p-3.5 text-left rounded-xl border transition-all flex flex-col justify-between min-h-[96px] ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/40 dark:bg-teal-950/40 ring-1 ring-teal-600 dark:ring-teal-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? 'bg-teal-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {r.title}
                        </span>
                      </div>
                      {r.badge && (
                        <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {r.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                      {r.shortDesc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Context Details if Available */}
          {currentReasonObj?.tags && currentReasonObj.tags.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quick detail (optional):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {currentReasonObj.tags.map((tag) => {
                  const isTagActive = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(isTagActive ? '' : tag)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        isTagActive
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Supportive Educational / Clinical Notice */}
          {currentReasonObj?.helperNote && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>{currentReasonObj.helperNote}</span>
            </div>
          )}

          {/* Custom Note Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Add a private personal note (optional):
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. was at doctor appointment, felt slight heart flutter..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Safety Rule Reassurance */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="font-medium text-slate-700 dark:text-slate-300">NudgeMed Safety Guarantee:</span> We never change your dose or treatment. Only your doctor can adjust prescriptions.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Skipped Dose</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
