import React, { useState, useEffect } from 'react';
import { Medicine, DoseLog, PatientProfile, SkipReasonType } from './types';
import { initialPatient, initialMedicines, generateInitialLogs } from './data/mockData';
import { Header } from './components/Header';
import { TodaySchedule } from './components/TodaySchedule';
import { PatternInsightsView } from './components/PatternInsightsView';
import { PrescriptionManager } from './components/PrescriptionManager';
import { DoctorReportView } from './components/DoctorReportView';
import { CaregiverDigestView } from './components/CaregiverDigestView';
import { ReasonModal } from './components/ReasonModal';
import { VoiceReminderModal } from './components/VoiceReminderModal';
import { WhatsAppSimulationModal } from './components/WhatsAppSimulationModal';
import { ShieldCheck, Heart, Pill, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'patterns' | 'medicines' | 'doctor' | 'caregiver'>('today');
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [logs, setLogs] = useState<DoseLog[]>(() => generateInitialLogs());
  const [patient, setPatient] = useState<PatientProfile>(initialPatient);
  const [largeText, setLargeText] = useState(false);

  // Modals state
  const [skipModalOpen, setSkipModalOpen] = useState(false);
  const [targetMedicineForSkip, setTargetMedicineForSkip] = useState<Medicine | null>(null);
  const [targetTimeForSkip, setTargetTimeForSkip] = useState<string>('20:00');

  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [targetVoiceMedicine, setTargetVoiceMedicine] = useState<Medicine | null>(null);
  const [targetVoiceTime, setTargetVoiceTime] = useState<string>('20:00');

  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [targetWhatsAppMedicine, setTargetWhatsAppMedicine] = useState<Medicine | null>(null);
  const [targetWhatsAppTime, setTargetWhatsAppTime] = useState<string>('20:00');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [doctorAgendaItems, setDoctorAgendaItems] = useState<string[]>([
    'Evaluate morning lightheadedness with Lisinopril 10mg (3 instances logged).',
    'Review 90-day supply refill options for Metformin to prevent pharmacy lapses.',
    'Confirm lipid panel target with current 20mg Atorvastatin.',
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter logs for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter((l) => l.date === todayStr);

  // Mark Dose as Taken
  const handleMarkTaken = (medicineId: string, scheduledTime: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const existingLogIndex = logs.findIndex(
      (l) => l.medicineId === medicineId && l.scheduledTime === scheduledTime && l.date === todayStr
    );

    const updatedLog: DoseLog = {
      id: existingLogIndex >= 0 ? logs[existingLogIndex].id : `log-${Date.now()}`,
      medicineId,
      date: todayStr,
      scheduledTime,
      status: 'taken',
      loggedAt: new Date().toISOString(),
      takenTime: nowTime,
    };

    if (existingLogIndex >= 0) {
      setLogs((prev) => {
        const copy = [...prev];
        copy[existingLogIndex] = updatedLog;
        return copy;
      });
    } else {
      setLogs((prev) => [...prev, updatedLog]);
    }

    // Decrement stock count
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === medicineId ? { ...m, stockCount: Math.max(0, m.stockCount - 1) } : m
      )
    );

    const med = medicines.find((m) => m.id === medicineId);
    showToast(`Confirmed taken: ${med ? med.name : 'Medicine'} at ${nowTime}`);
  };

  // Open Skip Reason Modal
  const handleOpenSkipModal = (medicine: Medicine, scheduledTime: string) => {
    setTargetMedicineForSkip(medicine);
    setTargetTimeForSkip(scheduledTime);
    setSkipModalOpen(true);
  };

  // Submit Skip Reason
  const handleSubmitSkipReason = (reason: SkipReasonType, details?: string, note?: string) => {
    if (!targetMedicineForSkip) return;

    const existingLogIndex = logs.findIndex(
      (l) =>
        l.medicineId === targetMedicineForSkip.id &&
        l.scheduledTime === targetTimeForSkip &&
        l.date === todayStr
    );

    const updatedLog: DoseLog = {
      id: existingLogIndex >= 0 ? logs[existingLogIndex].id : `log-${Date.now()}`,
      medicineId: targetMedicineForSkip.id,
      date: todayStr,
      scheduledTime: targetTimeForSkip,
      status: 'skipped',
      loggedAt: new Date().toISOString(),
      skipReason: reason,
      sideEffectDetails: details,
      customNote: note,
    };

    if (existingLogIndex >= 0) {
      setLogs((prev) => {
        const copy = [...prev];
        copy[existingLogIndex] = updatedLog;
        return copy;
      });
    } else {
      setLogs((prev) => [...prev, updatedLog]);
    }

    // If reason is side_effects, add to doctor agenda automatically
    if (reason === 'side_effects' && details) {
      const point = `Discuss ${details} experienced with ${targetMedicineForSkip.name}.`;
      if (!doctorAgendaItems.includes(point)) {
        setDoctorAgendaItems((prev) => [...prev, point]);
      }
    }

    showToast(`Dose logged as skipped (${reason.replace('_', ' ')}). Reason recorded safely.`);
  };

  // Undo Dose Status
  const handleUndoStatus = (logId: string) => {
    setLogs((prev) =>
      prev.map((l) => (l.id === logId ? { ...l, status: 'pending', skipReason: undefined } : l))
    );
    showToast('Dose reset to pending.');
  };

  // Shift Reminder Time (e.g. from 20:00 to 21:15)
  const handleShiftReminder = (medicineId: string, oldTime: string, newTime: string) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === medicineId) {
          return {
            ...m,
            scheduledTimes: m.scheduledTimes.map((t) => (t === oldTime ? newTime : t)),
          };
        }
        return m;
      })
    );
    showToast(`Reminder shifted to ${newTime} to fit your natural routine!`);
  };

  // Refill Medicine Stock
  const handleRefillMedicine = (medicineId: string, amount: number) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === medicineId ? { ...m, stockCount: m.stockCount + amount } : m))
    );
    const med = medicines.find((m) => m.id === medicineId);
    showToast(`Added +${amount} pills to ${med ? med.name : 'medicine'} supply.`);
  };

  // Add New Medicine
  const handleAddMedicine = (newMed: Omit<Medicine, 'id'>) => {
    const created: Medicine = {
      ...newMed,
      id: `med-${Date.now()}`,
    };
    setMedicines((prev) => [...prev, created]);
    showToast(`Added ${created.name} (${created.dosage}) to prescriptions.`);
  };

  // Triggers for Voice & WhatsApp Demos
  const handleTriggerVoiceDemo = (med?: Medicine, time?: string) => {
    const selectedMed = med || medicines.find((m) => m.name === 'Metformin') || medicines[0];
    setTargetVoiceMedicine(selectedMed);
    setTargetVoiceTime(time || selectedMed.scheduledTimes[selectedMed.scheduledTimes.length - 1] || '20:00');
    setVoiceModalOpen(true);
  };

  const handleTriggerWhatsAppDemo = (med?: Medicine, time?: string) => {
    const selectedMed = med || medicines.find((m) => m.name === 'Metformin') || medicines[0];
    setTargetWhatsAppMedicine(selectedMed);
    setTargetWhatsAppTime(time || selectedMed.scheduledTimes[selectedMed.scheduledTimes.length - 1] || '20:00');
    setWhatsAppModalOpen(true);
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col ${largeText ? 'text-lg' : ''}`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTriggerVoiceReminder={() => handleTriggerVoiceDemo()}
        largeText={largeText}
        setLargeText={setLargeText}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'today' && (
          <TodaySchedule
            medicines={medicines}
            todayLogs={todayLogs}
            onMarkTaken={handleMarkTaken}
            onOpenSkipModal={handleOpenSkipModal}
            onUndoStatus={handleUndoStatus}
            onSimulateWhatsApp={(med, time) => handleTriggerWhatsAppDemo(med, time)}
            onTriggerVoice={(med, time) => handleTriggerVoiceDemo(med, time)}
            onNavigateToPatterns={() => setActiveTab('patterns')}
            onNavigateToStock={() => setActiveTab('medicines')}
          />
        )}

        {activeTab === 'patterns' && (
          <PatternInsightsView
            medicines={medicines}
            logs={logs}
            onShiftReminder={handleShiftReminder}
            onRefillMedicine={handleRefillMedicine}
            onNavigateToDoctor={() => setActiveTab('doctor')}
            doctorAgendaItems={doctorAgendaItems}
            setDoctorAgendaItems={setDoctorAgendaItems}
          />
        )}

        {activeTab === 'medicines' && (
          <PrescriptionManager
            medicines={medicines}
            onAddMedicine={handleAddMedicine}
            onRefillMedicine={handleRefillMedicine}
          />
        )}

        {activeTab === 'doctor' && (
          <DoctorReportView
            medicines={medicines}
            logs={logs}
            patientName={patient.name}
            age={patient.age}
            conditions={patient.conditions}
            doctorName={patient.primaryDoctor}
            agendaItems={doctorAgendaItems}
            setAgendaItems={setDoctorAgendaItems}
          />
        )}

        {activeTab === 'caregiver' && (
          <CaregiverDigestView
            medicines={medicines}
            logs={logs}
            patientName={patient.name}
            caregiverName={patient.caregiverName}
            caregiverRelationship={patient.caregiverRelationship}
            caregiverConsentEnabled={patient.caregiverConsentEnabled}
            onToggleConsent={(enabled) =>
              setPatient((prev) => ({ ...prev, caregiverConsentEnabled: enabled }))
            }
            onTriggerVoiceDemo={() => handleTriggerVoiceDemo()}
            onTriggerWhatsAppDemo={() => handleTriggerWhatsAppDemo()}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-700 dark:border-slate-200 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-teal-400 dark:text-teal-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Reason Selector Modal */}
      <ReasonModal
        isOpen={skipModalOpen}
        medicine={targetMedicineForSkip}
        scheduledTime={targetTimeForSkip}
        onClose={() => setSkipModalOpen(false)}
        onSubmit={handleSubmitSkipReason}
      />

      {/* Senior Voice Reminder Modal */}
      <VoiceReminderModal
        isOpen={voiceModalOpen}
        medicine={targetVoiceMedicine}
        scheduledTime={targetVoiceTime}
        patientName={patient.name.split(' ')[0]}
        onClose={() => setVoiceModalOpen(false)}
        onMarkTaken={handleMarkTaken}
        onOpenSkipModal={handleOpenSkipModal}
      />

      {/* WhatsApp Message Flow Simulation Modal */}
      <WhatsAppSimulationModal
        isOpen={whatsAppModalOpen}
        medicine={targetWhatsAppMedicine}
        scheduledTime={targetWhatsAppTime}
        patientName={patient.name.split(' ')[0]}
        onClose={() => setWhatsAppModalOpen(false)}
        onMarkTaken={handleMarkTaken}
        onOpenSkipModal={handleOpenSkipModal}
      />

      {/* Clean Editorial Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">NudgeMed</span>
            <span>—</span>
            <span>We don't just remind patients, we learn why they miss doses and help fix it safely.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Patient Consent Guaranteed</span>
            <span aria-hidden="true">·</span>
            <span>No Unsupervised Dose Changes</span>
            <span aria-hidden="true">·</span>
            <span>Physician-Verified Reporting</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
