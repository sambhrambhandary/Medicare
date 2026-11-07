import React, { useEffect, useState } from 'react';
import { Medicine } from '../types';
import { Volume2, VolumeX, Check, X, Phone, PhoneOff, RotateCcw } from 'lucide-react';

interface VoiceReminderModalProps {
  isOpen: boolean;
  medicine: Medicine | null;
  scheduledTime: string;
  patientName: string;
  onClose: () => void;
  onMarkTaken: (medicineId: string, time: string) => void;
  onOpenSkipModal: (medicine: Medicine, time: string) => void;
}

export const VoiceReminderModal: React.FC<VoiceReminderModalProps> = ({
  isOpen,
  medicine,
  scheduledTime,
  patientName,
  onClose,
  onMarkTaken,
  onOpenSkipModal,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const reminderText = medicine
    ? `Hello ${patientName}. This is your gentle health reminder for ${medicine.name}, ${medicine.dosage}. Please ${medicine.instructions.toLowerCase()}. Have you taken this medicine?`
    : `Hello ${patientName}. This is your gentle health reminder.`;

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(reminderText);
    utterance.rate = 0.88; // Slightly slower, respectful senior cadence
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isOpen) {
      speak();
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    }
  }, [isOpen, medicine]);

  if (!isOpen || !medicine) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-center p-6 sm:p-8 space-y-6">
        {/* Caller Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center relative mb-3">
            <Volume2 className={`w-9 h-9 ${isPlaying ? 'animate-pulse text-teal-700 dark:text-teal-300' : ''}`} />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500"></span>
              </span>
            )}
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-teal-700 dark:text-teal-400">
            Gentle Voice Call Reminder
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {medicine.name} ({medicine.dosage})
          </h3>
          <p className="text-xs text-slate-500 mt-1">Scheduled for {scheduledTime}</p>
        </div>

        {/* Audio Script Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase">
            <span>Spoken Voice Prompt</span>
            <button
              onClick={speak}
              className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-normal capitalize"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Repeat speech</span>
            </button>
          </div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed italic">
            "{reminderText}"
          </p>
        </div>

        {/* Big Accessible Buttons for Elderly Users */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              onMarkTaken(medicine.id, scheduledTime);
              onClose();
            }}
            className="w-full min-h-[52px] px-6 py-3.5 text-base font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] rounded-2xl shadow-md transition-all flex items-center justify-center gap-2.5"
          >
            <Check className="w-5 h-5" />
            <span>Yes, I Took It</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenSkipModal(medicine, scheduledTime);
            }}
            className="w-full min-h-[48px] px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>I Skipped It (Pick Reason)</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 pt-2"
        >
          Dismiss Call
        </button>
      </div>
    </div>
  );
};
