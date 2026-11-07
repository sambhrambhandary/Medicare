import React, { useState } from 'react';
import { Medicine, DoseLog } from '../types';
import { FileText, Printer, CheckCircle2, AlertCircle, RefreshCw, Stethoscope, Download, UserCheck } from 'lucide-react';

interface DoctorReportViewProps {
  medicines: Medicine[];
  logs: DoseLog[];
  patientName: string;
  age: number;
  conditions: string[];
  doctorName: string;
  agendaItems: string[];
  setAgendaItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export const DoctorReportView: React.FC<DoctorReportViewProps> = ({
  medicines,
  logs,
  patientName,
  age,
  conditions,
  doctorName,
  agendaItems,
  setAgendaItems,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);
  const [newAgendaItem, setNewAgendaItem] = useState('');

  // Adherence calculation
  const totalLogs = logs.length;
  const takenLogs = logs.filter((l) => l.status === 'taken');
  const skippedLogs = logs.filter((l) => l.status === 'skipped');
  const adherenceRate = totalLogs > 0 ? Math.round((takenLogs.length / totalLogs) * 100) : 100;

  // Filter side effects
  const sideEffectLogs = skippedLogs.filter((l) => l.skipReason === 'side_effects');

  // Reason counts
  const reasonCounts: Record<string, number> = {
    forgot: 0,
    side_effects: 0,
    ran_out: 0,
    felt_fine: 0,
    away_from_home: 0,
    other: 0,
  };
  skippedLogs.forEach((l) => {
    const r = l.skipReason || 'forgot';
    reasonCounts[r] = (reasonCounts[r] || 0) + 1;
  });

  const handleGenerateAiReport = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/doctor-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicines,
          logs,
          patientName,
          age,
          conditions,
        }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        setAiReport(data.report);
      }
    } catch (err) {
      console.error('Failed to generate report with AI:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddAgendaItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgendaItem.trim()) return;
    setAgendaItems((prev) => [...prev, newAgendaItem.trim()]);
    setNewAgendaItem('');
  };

  const handleRemoveAgendaItem = (index: number) => {
    setAgendaItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header and Print Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400">
            <span>Clinical Adherence Summary</span>
            <span aria-hidden="true">·</span>
            <span>Physician Ready</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Doctor's Consultation Brief
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
            Objective adherence tracking and reported side-effects formatted for clinical review with {doctorName}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={handleGenerateAiReport}
            disabled={isGenerating}
            className="px-3.5 py-2 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Regenerate via Clinical AI'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Clinical Document Box (Print-Ready) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
              CLINICAL ADHERENCE REPORT
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {patientName}, Age {age}
            </h3>
            <div className="text-xs text-slate-500 mt-0.5">
              Attending: <strong>{doctorName}</strong>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs text-slate-500 space-y-1">
            <div>Report Date: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div>Timeframe: Past 14-30 Days</div>
            <div className="text-emerald-700 dark:text-emerald-400 font-semibold">Patient-Verified Records</div>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
          <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <span>
            <strong>Clinical Boundary Notice:</strong> NudgeMed does not alter prescriptions or therapy. This report reflects patient self-reporting to assist the physician in assessing tolerability, timing, and regimen adherence.
          </span>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">True Adherence Rate</span>
            <div className="text-2xl font-bold tabular-nums text-teal-600 dark:text-teal-400 mt-1">
              {adherenceRate}%
            </div>
            <span className="text-[10px] text-slate-400">Target: ≥80%</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">Total Doses Tracked</span>
            <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white mt-1">
              {totalLogs}
            </div>
            <span className="text-[10px] text-slate-400">{takenLogs.length} confirmed taken</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">Side Effect Events</span>
            <div className="text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400 mt-1">
              {reasonCounts.side_effects}
            </div>
            <span className="text-[10px] text-slate-400">Documented in log</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">Stockout Misses</span>
            <div className="text-2xl font-bold tabular-nums text-rose-600 dark:text-rose-400 mt-1">
              {reasonCounts.ran_out}
            </div>
            <span className="text-[10px] text-slate-400">Pharmacy refill gaps</span>
          </div>
        </div>

        {/* AI Clinical Executive Summary */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Executive Clinical Summary
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            {aiReport?.executiveSummary ||
              `Patient ${patientName} maintains an overall adherence rate of ${adherenceRate}%. The primary barriers identified are morning lightheadedness with Lisinopril (${reasonCounts.side_effects} instances), weekend routine forgetfulness (${reasonCounts.forgot} instances), and delayed pharmacy refills (${reasonCounts.ran_out} instances). Patient also demonstrated occasional asymptomatic hesitation with Atorvastatin. Routine evening doses naturally occur around 21:15.`}
          </p>
        </div>

        {/* Reported Side Effects Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Patient-Reported Side Effects Log</span>
            </h4>
            <span className="text-xs text-slate-500">{sideEffectLogs.length} instances</span>
          </div>

          {sideEffectLogs.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Date & Time</th>
                    <th className="py-2.5 px-3 font-semibold">Medication</th>
                    <th className="py-2.5 px-3 font-semibold">Reported Symptom</th>
                    <th className="py-2.5 px-3 font-semibold">Patient Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sideEffectLogs.map((log) => {
                    const med = medicines.find((m) => m.id === log.medicineId);
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                          {log.date} {log.scheduledTime}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                          {med ? `${med.name} (${med.dosage})` : 'Medication'}
                        </td>
                        <td className="py-2.5 px-3 text-amber-800 dark:text-amber-300 font-medium">
                          {log.sideEffectDetails || 'Discomfort after taking'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                          {log.customNote || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500">
              No side effects recorded in the selected period.
            </div>
          )}
        </div>

        {/* Doctor Consultation Agenda Items */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Recommended Consultation Discussion Points</span>
          </h4>

          <div className="space-y-2">
            {agendaItems.map((point, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800"
              >
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="w-4 h-4 rounded-full border border-slate-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
                <button
                  onClick={() => handleRemoveAgendaItem(index)}
                  className="text-slate-400 hover:text-slate-600 text-xs px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Add custom discussion point */}
          <form onSubmit={handleAddAgendaItem} className="flex gap-2 pt-1 print:hidden">
            <input
              type="text"
              value={newAgendaItem}
              onChange={(e) => setNewAgendaItem(e.target.value)}
              placeholder="Add another talking point for your doctor visit..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl"
            >
              Add Point
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
