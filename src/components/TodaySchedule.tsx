import React from 'react';
import { Medicine, DoseLog } from '../types';
import { Check, X, Clock, AlertTriangle, ShieldCheck, RefreshCw, MessageSquare, Volume2, Sparkles } from 'lucide-react';

interface TodayScheduleProps {
  medicines: Medicine[];
  todayLogs: DoseLog[];
  onMarkTaken: (medicineId: string, scheduledTime: string) => void;
  onOpenSkipModal: (medicine: Medicine, scheduledTime: string) => void;
  onUndoStatus: (logId: string) => void;
  onSimulateWhatsApp: (medicine: Medicine, scheduledTime: string) => void;
  onTriggerVoice: (medicine: Medicine, scheduledTime: string) => void;
  onNavigateToPatterns: () => void;
  onNavigateToStock: () => void;
}

export const TodaySchedule: React.FC<TodayScheduleProps> = ({
  medicines,
  todayLogs,
  onMarkTaken,
  onOpenSkipModal,
  onUndoStatus,
  onSimulateWhatsApp,
  onTriggerVoice,
  onNavigateToPatterns,
  onNavigateToStock,
}) => {
  // Check low stock medicines
  const lowStockMeds = medicines.filter((m) => m.stockCount <= m.refillThreshold);

  // Group doses for today
  interface ScheduledDoseSlot {
    medicine: Medicine;
    time: string;
    log?: DoseLog;
  }

  const allScheduledDoses: ScheduledDoseSlot[] = [];
  medicines.forEach((med) => {
    med.scheduledTimes.forEach((time) => {
      const log = todayLogs.find((l) => l.medicineId === med.id && l.scheduledTime === time);
      allScheduledDoses.push({
        medicine: med,
        time,
        log,
      });
    });
  });

  // Sort by time
  allScheduledDoses.sort((a, b) => a.time.localeCompare(b.time));

  // Compute today progress
  const totalDoses = allScheduledDoses.length;
  const takenCount = allScheduledDoses.filter((d) => d.log?.status === 'taken').length;
  const skippedCount = allScheduledDoses.filter((d) => d.log?.status === 'skipped').length;
  const pendingCount = totalDoses - takenCount - skippedCount;

  return (
    <div className="space-y-6">
      {/* Hero Adherence Banner with Generated Asset */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400">
                <span>Personalized Daily Care</span>
                <span aria-hidden="true">·</span>
                <span>Gentle, Adaptive Health Tracking</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1.5 text-balance">
                Your Health, On Your Real Schedule
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 max-w-xl leading-relaxed">
                Standard apps only push alarms. NudgeMed learns when and why doses are skipped, protects against pharmacy runouts, and adapts reminders safely without ever touching your prescription.
              </p>
            </div>

            {/* Core Adherence Rule Callout */}
            <div className="mt-6 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">Cardinal Safety Rule:</span> "Reminder sent" is <span className="underline decoration-teal-500 font-medium text-slate-900 dark:text-white">never</span> counted as medicine taken. Only your confirmed tap logs a dose.
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
            <img
              src="/src/assets/images/medicine_organizer_calm_1794022583538.jpg"
              alt="Calm medicine bottles and modern weekly pill organizer in morning sunlight"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner if Any */}
      {lowStockMeds.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Early Refill Warning ({lowStockMeds.length} {lowStockMeds.length === 1 ? 'prescription' : 'prescriptions'} low)
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                {lowStockMeds.map((m) => `${m.name} (${m.stockCount} ${m.refillUnit} left)`).join(', ')}.
                Refill before stock runs out to prevent missed doses!
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToStock}
            className="px-3.5 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 rounded-lg transition-colors whitespace-nowrap self-start sm:self-center"
          >
            Review Refills
          </button>
        </div>
      )}

      {/* Today's Dose Progress Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Today's Summary</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {takenCount} of {totalDoses}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">doses confirmed taken</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400 font-medium tabular-nums">{takenCount} Taken</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-400 font-medium tabular-nums">{skippedCount} Skipped</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span className="text-slate-600 dark:text-slate-400 font-medium tabular-nums">{pendingCount} Awaiting</span>
          </div>
        </div>
      </div>

      {/* Doses Timeline List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Today's Scheduled Medicines
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {allScheduledDoses.map((slot, idx) => {
            const { medicine, time, log } = slot;
            const status = log?.status || 'pending';
            const isTaken = status === 'taken';
            const isSkipped = status === 'skipped';

            return (
              <div
                key={`${medicine.id}-${time}-${idx}`}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isTaken
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                    : isSkipped
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Timing and Medicine info */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700/60">
                      <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 mb-0.5" />
                      <span className="text-[11px] font-bold tabular-nums text-slate-800 dark:text-slate-200">
                        {time}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {medicine.name}
                        </h4>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {medicine.dosage}
                        </span>
                        {medicine.stockCount <= medicine.refillThreshold && (
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-md">
                            {medicine.stockCount} left
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span>{medicine.condition}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {medicine.instructions}
                        </span>
                      </div>

                      {/* Display Log Info if Taken or Skipped */}
                      {isTaken && (
                        <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                          <Check className="w-3.5 h-3.5" />
                          <span>
                            Confirmed taken {log?.takenTime ? `at ${log.takenTime}` : 'on schedule'}
                          </span>
                        </div>
                      )}

                      {isSkipped && (
                        <div className="mt-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            Skipped: <strong className="capitalize">{log?.skipReason?.replace('_', ' ')}</strong>
                            {log?.sideEffectDetails && ` — ${log.sideEffectDetails}`}
                            {log?.customNote && ` (${log.customNote})`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {status === 'pending' ? (
                      <>
                        <button
                          onClick={() => onOpenSkipModal(medicine, time)}
                          className="min-h-[44px] px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
                          title="Record why you are skipping this dose"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Skipped</span>
                        </button>
                        <button
                          onClick={() => onMarkTaken(medicine.id, time)}
                          className="min-h-[44px] px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                          title="Confirm you have taken this medicine"
                        >
                          <Check className="w-4 h-4" />
                          <span>Taken</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => log && onUndoStatus(log.id)}
                        className="min-h-[44px] px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                        title="Change log status"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Change</span>
                      </button>
                    )}

                    {/* Simulation triggers for Elderly options */}
                    <div className="border-l border-slate-200 dark:border-slate-800 pl-2 flex items-center gap-1">
                      <button
                        onClick={() => onTriggerVoice(medicine, time)}
                        aria-label="Simulate audio voice call"
                        title="Simulate Voice Reminder"
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSimulateWhatsApp(medicine, time)}
                        aria-label="Simulate WhatsApp reminder"
                        title="Simulate WhatsApp Reminder"
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Routine Calibration Teaser */}
      <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
          <div className="text-xs text-teal-900 dark:text-teal-200">
            <span className="font-semibold">Adaptive Habit Discovery:</span> We noticed you take your evening Metformin at 21:15 instead of 20:00. Would you like to adjust the reminder so it fits your real routine?
          </div>
        </div>
        <button
          onClick={onNavigateToPatterns}
          className="px-3.5 py-1.5 text-xs font-semibold text-teal-900 dark:text-teal-100 bg-teal-200/80 hover:bg-teal-200 dark:bg-teal-900 rounded-lg transition-colors whitespace-nowrap self-start sm:self-center"
        >
          View Pattern Insights
        </button>
      </div>
    </div>
  );
};
