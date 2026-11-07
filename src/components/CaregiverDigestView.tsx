import React, { useState } from 'react';
import { Medicine, DoseLog } from '../types';
import { HeartHandshake, ShieldCheck, Lock, Send, MessageSquare, Volume2, CheckCircle2, AlertTriangle, PhoneCall, RefreshCw } from 'lucide-react';

interface CaregiverDigestViewProps {
  medicines: Medicine[];
  logs: DoseLog[];
  patientName: string;
  caregiverName: string;
  caregiverRelationship: string;
  caregiverConsentEnabled: boolean;
  onToggleConsent: (enabled: boolean) => void;
  onTriggerVoiceDemo: () => void;
  onTriggerWhatsAppDemo: () => void;
}

export const CaregiverDigestView: React.FC<CaregiverDigestViewProps> = ({
  medicines,
  logs,
  patientName,
  caregiverName,
  caregiverRelationship,
  caregiverConsentEnabled,
  onToggleConsent,
  onTriggerVoiceDemo,
  onTriggerWhatsAppDemo,
}) => {
  const [digestSent, setDigestSent] = useState(false);

  // Compute adherence rate
  const totalLogs = logs.length;
  const takenLogs = logs.filter((l) => l.status === 'taken');
  const adherenceRate = totalLogs > 0 ? Math.round((takenLogs.length / totalLogs) * 100) : 100;
  const lowStockMeds = medicines.filter((m) => m.stockCount <= m.refillThreshold);

  const handleSendDigestNow = () => {
    setDigestSent(true);
    setTimeout(() => setDigestSent(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400">
          <span>Family Caregiver Support & Patient Privacy</span>
          <span aria-hidden="true">·</span>
          <span>Explicit Consent</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Caregiver Digest & Senior Reminders
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Keep loved ones reassured without invasive surveillance. You maintain complete control over who sees your health summaries, with senior-accessible voice and WhatsApp reminder channels.
        </p>
      </div>

      {/* Patient Consent Gate Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Patient Data Consent & Sharing Gate
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Share high-level weekly adherence digest with <strong>{caregiverName} ({caregiverRelationship})</strong>.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {caregiverConsentEnabled ? 'Consent Active' : 'Sharing Paused'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={caregiverConsentEnabled}
              onClick={() => onToggleConsent(!caregiverConsentEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                caregiverConsentEnabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  caregiverConsentEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>
            <strong>Your Privacy Principle:</strong> You can revoke consent anytime. Only weekly macro trends and stockout warnings are shared. Raw private notes are never sent without your choice.
          </span>
        </div>
      </div>

      {/* Caregiver Digest Preview & Image Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Digest Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400">
                <HeartHandshake className="w-4 h-4" />
                <span>Weekly Family Reassurance Digest</span>
              </div>
              <span className="text-xs text-slate-400">Sundays at 18:00</span>
            </div>

            {caregiverConsentEnabled ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 text-xs text-teal-950 dark:text-teal-100 space-y-1.5">
                  <p className="font-semibold text-sm text-teal-900 dark:text-white">
                    Hi {caregiverName}, here is {patientName}’s health routine update!
                  </p>
                  <p className="leading-relaxed">
                    Overall medicine adherence is steady at <strong>{adherenceRate}%</strong> this week. Morning routines have been 100% on time!
                  </p>
                </div>

                {lowStockMeds.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Pharmacy Assistance Needed:</span>{' '}
                      {patientName} has {lowStockMeds.map((m) => `${m.name} (${m.stockCount} ${m.refillUnit} left)`).join(', ')}.
                      A refill pickup or pharmacy call would be wonderfully helpful!
                    </div>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-white">Gentle Family Tip:</span> Weekend evenings showed a couple of missed doses due to schedule changes. A warm text around dinner on Saturday helps gently anchor the routine.
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                <Lock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">Sharing is currently paused</p>
                <p className="mt-1">Toggle the consent switch above to enable weekly updates for {caregiverName}.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Sent via email & SMS</span>
            <button
              onClick={handleSendDigestNow}
              disabled={!caregiverConsentEnabled || digestSent}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                digestSent
                  ? 'bg-emerald-600 text-white'
                  : caregiverConsentEnabled
                  ? 'bg-teal-600 hover:bg-teal-700 text-white active:scale-[0.98]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800'
              }`}
            >
              {digestSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Digest Sent to {caregiverName}!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Digest Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Empathy Image */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative min-h-[300px]">
          <img
            src="/src/assets/images/caregiver_reassurance_1794022584790.jpg"
            alt="Warm elderly senior smiling comfortably with supportive family caregiver"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-6 flex flex-col justify-end text-white">
            <span className="text-xs font-semibold tracking-wide uppercase text-teal-300">Dignified Independence</span>
            <p className="text-sm font-medium mt-1 leading-snug">
              "We don't just remind patients, we learn why they miss doses and help them fix it, safely and with their consent."
            </p>
          </div>
        </div>
      </div>

      {/* Elderly Accessibility & Assistive Reminders Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Elderly-Accessible Reminder Options
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For seniors who don't check complex smartphone apps, we deliver reminders via their everyday channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Channel 1: WhatsApp Reminders */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                </div>
                <span>WhatsApp Interactive Reminders</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                One-Tap Reply via WhatsApp
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                Sends a clear, large-font WhatsApp prompt with quick interactive reply buttons: "1 - Taken" or "2 - Skipped". Ideal for seniors familiar with WhatsApp chat.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">High response rate</span>
              <button
                onClick={onTriggerWhatsAppDemo}
                className="px-4 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/60 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Simulate WhatsApp Flow</span>
              </button>
            </div>
          </div>

          {/* Channel 2: Voice Audio Phone Call */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
                <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-950/60 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4 text-teal-600" />
                </div>
                <span>Gentle Voice Audio Reminders</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                Spoken Reminder Phone Simulation
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                Speaks aloud in clear, unhurried cadence with medicine name, dosage, and food instructions. Uses browser speech synthesis to read reminders.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Text-to-speech enabled</span>
              <button
                onClick={onTriggerVoiceDemo}
                className="px-4 py-2 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-100 hover:bg-teal-200 dark:bg-teal-900/60 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Voice Call Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
