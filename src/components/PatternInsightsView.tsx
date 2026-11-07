import React, { useState } from 'react';
import { Medicine, DoseLog, PatternInsight } from '../types';
import { Brain, Sparkles, AlertCircle, PackageX, Clock, Calendar, Check, ArrowRight, ShieldAlert, FileText, RefreshCw } from 'lucide-react';

interface PatternInsightsViewProps {
  medicines: Medicine[];
  logs: DoseLog[];
  onShiftReminder: (medicineId: string, oldTime: string, newTime: string) => void;
  onRefillMedicine: (medicineId: string, amount: number) => void;
  onNavigateToDoctor: () => void;
  doctorAgendaItems: string[];
  setDoctorAgendaItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export const PatternInsightsView: React.FC<PatternInsightsViewProps> = ({
  medicines,
  logs,
  onShiftReminder,
  onRefillMedicine,
  onNavigateToDoctor,
  doctorAgendaItems,
  setDoctorAgendaItems,
}) => {
  const [analyzingWithAI, setAnalyzingWithAI] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [calibratedTimes, setCalibratedTimes] = useState<Record<string, boolean>>({});

  // Compute stats from logs
  const totalLogs = logs.length;
  const takenLogs = logs.filter((l) => l.status === 'taken');
  const skippedLogs = logs.filter((l) => l.status === 'skipped');
  const adherenceRate = totalLogs > 0 ? Math.round((takenLogs.length / totalLogs) * 100) : 100;

  // Breakdown of skip reasons
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

  const totalSkips = skippedLogs.length;

  // Run Gemini Live Pattern Engine
  const runAiPatternAnalysis = async () => {
    setAnalyzingWithAI(true);
    try {
      const res = await fetch('/api/analyze-patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicines,
          logs,
          patientName: 'Eleanor Vance',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiAnalysisResult(data.data);
      }
    } catch (err) {
      console.error('Failed to analyze with AI:', err);
    } finally {
      setAnalyzingWithAI(false);
    }
  };

  const handleApplyCalibration = (medicineId: string, oldTime: string, newTime: string) => {
    onShiftReminder(medicineId, oldTime, newTime);
    setCalibratedTimes((prev) => ({ ...prev, [`${medicineId}-${oldTime}`]: true }));
  };

  const handleAddToDoctorAgenda = (point: string) => {
    if (!doctorAgendaItems.includes(point)) {
      setDoctorAgendaItems((prev) => [...prev, point]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Mission */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400">
          <span>Root-Cause Behavioral Engine</span>
          <span aria-hidden="true">·</span>
          <span>Adaptive Support</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Why You Miss Doses & How We Fix It
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Traditional apps scold or buzz repeatedly. NudgeMed studies the real friction behind skipped doses—whether it's routine clashes, unpleasant side effects, or empty pill bottles—and solves them safely with your consent.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">True Adherence Rate</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold tabular-nums text-teal-600 dark:text-teal-400">
              {adherenceRate}%
            </span>
            <span className="text-xs text-slate-500">last 14 days</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Only confirmed intakes count.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Primary Friction</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              Forgot (42%)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Concentrated on weekend evenings.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Reported Side Effects</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
              {reasonCounts.side_effects}
            </span>
            <span className="text-xs text-slate-500">doses skipped</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Lisinopril morning dizziness flagged.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Supply Vulnerabilities</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold tabular-nums text-rose-600 dark:text-rose-400">
              {reasonCounts.ran_out}
            </span>
            <span className="text-xs text-slate-500">empty bottle skips</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Refill warning threshold active.
          </div>
        </div>
      </div>

      {/* Root Cause Reason Distribution */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Root-Cause Reason Breakdown ({totalSkips} Missed Doses)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Every missed dose provides valuable data to remove obstacles.
            </p>
          </div>
          <button
            onClick={runAiPatternAnalysis}
            disabled={analyzingWithAI}
            className="px-3.5 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${analyzingWithAI ? 'animate-spin' : ''}`} />
            <span>{analyzingWithAI ? 'Analyzing...' : 'Re-Run Behavioral AI Analysis'}</span>
          </button>
        </div>

        {/* Visual Reason Proportion Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
          <div
            style={{ width: `${totalSkips > 0 ? (reasonCounts.forgot / totalSkips) * 100 : 0}%` }}
            className="bg-indigo-500 h-full"
            title="Forgot"
          />
          <div
            style={{ width: `${totalSkips > 0 ? (reasonCounts.side_effects / totalSkips) * 100 : 0}%` }}
            className="bg-amber-500 h-full"
            title="Side Effects"
          />
          <div
            style={{ width: `${totalSkips > 0 ? (reasonCounts.ran_out / totalSkips) * 100 : 0}%` }}
            className="bg-rose-500 h-full"
            title="Ran Out"
          />
          <div
            style={{ width: `${totalSkips > 0 ? (reasonCounts.felt_fine / totalSkips) * 100 : 0}%` }}
            className="bg-teal-500 h-full"
            title="Felt Fine"
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-indigo-500 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Forgot:</span>{' '}
              <span className="text-slate-500 tabular-nums">
                {reasonCounts.forgot} ({totalSkips > 0 ? Math.round((reasonCounts.forgot / totalSkips) * 100) : 0}%)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-amber-500 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Side Effects:</span>{' '}
              <span className="text-slate-500 tabular-nums">
                {reasonCounts.side_effects} ({totalSkips > 0 ? Math.round((reasonCounts.side_effects / totalSkips) * 100) : 0}%)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-rose-500 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Ran Out:</span>{' '}
              <span className="text-slate-500 tabular-nums">
                {reasonCounts.ran_out} ({totalSkips > 0 ? Math.round((reasonCounts.ran_out / totalSkips) * 100) : 0}%)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-teal-500 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Felt Fine:</span>{' '}
              <span className="text-slate-500 tabular-nums">
                {reasonCounts.felt_fine} ({totalSkips > 0 ? Math.round((reasonCounts.felt_fine / totalSkips) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Discovered Patterns & Adaptive Interventions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Discovered Friction Patterns & 1-Tap Safe Fixes
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Fixes adjust reminders & alerts — never your medical dose
          </span>
        </div>

        {/* Pattern Card 1: Routine Calibration */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400">
              <Clock className="w-4 h-4" />
              <span>Timing Mismatch Discovery</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              You usually take your 20:00 Metformin at 21:15
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Across 8 recorded doses, you naturally took your medicine 75 minutes after the alarm, right when finishing dinner and evening tea. Shifting the reminder eliminates alarm fatigue.
            </p>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-300">Evidence:</strong> Average actual log timestamp is 21:14:32.
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            {calibratedTimes['med-1-20:00'] ? (
              <div className="px-4 py-2 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                <Check className="w-4 h-4" />
                <span>Calibrated to 21:15</span>
              </div>
            ) : (
              <button
                onClick={() => handleApplyCalibration('med-1', '20:00', '21:15')}
                className="px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Adjust Reminder to 21:15</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="text-[10px] text-center text-slate-400">Only shifts the alert time</span>
          </div>
        </div>

        {/* Pattern Card 2: Weekend Evening Forgetfulness */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
              <Calendar className="w-4 h-4" />
              <span>Weekend Routine Interruption</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              You mostly miss evening doses on weekends because you forget
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              When visiting family or relaxing on Saturday and Sunday, your normal weekday cues disappear. We can anchor the weekend alert to your evening meal or bedtime routine.
            </p>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-300">Evidence:</strong> 4 of 4 weekend evening skips were logged with reason "Forgot".
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            <button
              onClick={() => {
                alert('Weekend alert paired with dinner reminder (20:30) and WhatsApp notification enabled for Saturday/Sunday!');
              }}
              className="px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Anchor with Weekend Dinner</span>
              <Check className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-center text-slate-400">Applies contextual weekend nudge</span>
          </div>
        </div>

        {/* Pattern Card 3: Side Effect Warning */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <span>Reported Side Effect (Lisinopril)</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Skipped 3 times due to morning lightheadedness / dizziness
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Never stop blood pressure medication abruptly on your own. We automatically compiled these instances into your clinical report so Dr. Thorne can evaluate blood pressure timing or dose.
            </p>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-300">Safety Rule:</strong> NudgeMed never changes your medical dose. That is the doctor’s job.
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            {doctorAgendaItems.includes('Discuss morning dizziness from Lisinopril') ? (
              <div className="px-4 py-2 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-amber-200 dark:border-amber-800">
                <Check className="w-4 h-4" />
                <span>On Doctor Agenda</span>
              </div>
            ) : (
              <button
                onClick={() => handleAddToDoctorAgenda('Discuss morning dizziness from Lisinopril')}
                className="px-4 py-2.5 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Add to Doctor's Agenda</span>
              </button>
            )}
            <button
              onClick={onNavigateToDoctor}
              className="text-[11px] text-center text-teal-600 dark:text-teal-400 underline hover:text-teal-700"
            >
              View Clinical Brief
            </button>
          </div>
        </div>

        {/* Pattern Card 4: Inventory Stockout */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400">
              <PackageX className="w-4 h-4" />
              <span>Stockout Prevention Alert</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Metformin supply running out: 6 pills left (3 days remaining)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              You ran out of Metformin twice in the past month because refills take 3–4 days to dispense. We now trigger warnings 7 days before zero.
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            <button
              onClick={() => onRefillMedicine('med-1', 60)}
              className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Mark Refilled (+60 pills)</span>
              <Check className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-center text-slate-400">CVS Pharmacy: (555) 782-9011</span>
          </div>
        </div>

        {/* Pattern Card 5: Asymptomatic Skip ("Felt Fine") */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400">
            <Sparkles className="w-4 h-4" />
            <span>Asymptomatic Maintenance Understanding</span>
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
            Why feeling good can tempt you to skip Atorvastatin
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            You skipped Atorvastatin 3 times when you "felt fine". Unlike pain relievers, cholesterol and vascular medications do not give immediate sensation; they work silently behind the scenes to stabilize arterial walls. Consistent daily intake is what provides the long-term cardiac shield.
          </p>
        </div>
      </div>

      {/* Safety Manifesto Footer */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-900 dark:text-white">Our Promise to You:</span> The app never changes a dose or treatment. That is exclusively the doctor's job. Reminders are adjustable so they fit your life without annoying you.
        </div>
      </div>
    </div>
  );
};
