export type DoseStatus = 'pending' | 'taken' | 'skipped';

export type SkipReasonType =
  | 'forgot'
  | 'side_effects'
  | 'ran_out'
  | 'felt_fine'
  | 'away_from_home'
  | 'other';

export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  condition: string;
  dosage: string;
  form: 'pill' | 'capsule' | 'liquid' | 'injection' | 'inhaler' | 'drops';
  scheduledTimes: string[]; // HH:mm format e.g. ["08:00", "20:00"]
  instructions: string; // e.g. "Take with food", "Empty stomach"
  stockCount: number; // e.g. 14 pills
  refillThreshold: number; // e.g. 7 pills
  refillUnit: string; // e.g. "pills", "doses", "ml"
  prescribingDoctor: string;
  rxNumber?: string;
  pharmacyName?: string;
  pharmacyPhone?: string;
  colorTag: string; // Tailwind color token
  naturalTakenTimeOffset?: number; // Minutes delta from scheduled time
}

export interface DoseLog {
  id: string;
  medicineId: string;
  date: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: DoseStatus;
  loggedAt?: string; // ISO timestamp
  takenTime?: string; // HH:mm actual time taken
  skipReason?: SkipReasonType;
  sideEffectDetails?: string; // e.g. "dizziness", "nausea"
  customNote?: string;
}

export interface PatternInsight {
  id: string;
  type: 'timing_mismatch' | 'weekend_forget' | 'stockout_risk' | 'side_effect_alert' | 'asymptomatic_stop';
  title: string;
  description: string;
  evidence: string;
  severity: 'info' | 'warning' | 'alert';
  suggestedAction?: {
    label: string;
    actionType: 'shift_reminder' | 'order_refill' | 'doctor_discussion' | 'routine_anchor';
    targetTime?: string;
    medicineId?: string;
    details?: string;
  };
}

export interface PatientProfile {
  name: string;
  age: number;
  conditions: string[];
  primaryDoctor: string;
  caregiverName: string;
  caregiverRelationship: string;
  caregiverConsentEnabled: boolean;
  caregiverEmail: string;
  caregiverPhone: string;
  highContrastMode: boolean;
  largeTextMode: boolean;
  voiceReminderEnabled: boolean;
}
