import { Medicine, DoseLog, PatientProfile } from '../types';

export const initialPatient: PatientProfile = {
  name: 'Eleanor Vance',
  age: 71,
  conditions: ['Type 2 Diabetes', 'Hypertension', 'Hyperlipidemia'],
  primaryDoctor: 'Dr. Aris Thorne, MD (Internal Medicine)',
  caregiverName: 'Sarah Vance',
  caregiverRelationship: 'Daughter',
  caregiverConsentEnabled: true,
  caregiverEmail: 'sarah.vance@example.com',
  caregiverPhone: '+1 (555) 389-4021',
  highContrastMode: false,
  largeTextMode: false,
  voiceReminderEnabled: true,
};

export const initialMedicines: Medicine[] = [
  {
    id: 'med-1',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    condition: 'Type 2 Diabetes',
    dosage: '500 mg',
    form: 'pill',
    scheduledTimes: ['08:00', '20:00'],
    instructions: 'Take with or immediately after meals to reduce stomach upset',
    stockCount: 6, // Low stock! Below 14 threshold
    refillThreshold: 14,
    refillUnit: 'pills',
    prescribingDoctor: 'Dr. Aris Thorne',
    rxNumber: 'RX-994820',
    pharmacyName: 'CVS Pharmacy #4192',
    pharmacyPhone: '(555) 782-9011',
    colorTag: 'teal',
    naturalTakenTimeOffset: 75, // Typically taken at 21:15 instead of 20:00
  },
  {
    id: 'med-2',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    condition: 'Hypertension (Blood Pressure)',
    dosage: '10 mg',
    form: 'pill',
    scheduledTimes: ['08:00'],
    instructions: 'Take once daily in the morning with a full glass of water',
    stockCount: 22,
    refillThreshold: 7,
    refillUnit: 'pills',
    prescribingDoctor: 'Dr. Aris Thorne',
    rxNumber: 'RX-882103',
    pharmacyName: 'CVS Pharmacy #4192',
    pharmacyPhone: '(555) 782-9011',
    colorTag: 'indigo',
  },
  {
    id: 'med-3',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    condition: 'Hyperlipidemia (Cholesterol)',
    dosage: '20 mg',
    form: 'pill',
    scheduledTimes: ['21:00'],
    instructions: 'Take in the evening. Maintain consistently even when asymptomatic',
    stockCount: 38,
    refillThreshold: 10,
    refillUnit: 'pills',
    prescribingDoctor: 'Dr. Aris Thorne',
    rxNumber: 'RX-773911',
    pharmacyName: 'CVS Pharmacy #4192',
    pharmacyPhone: '(555) 782-9011',
    colorTag: 'amber',
  },
  {
    id: 'med-4',
    name: 'Amlodipine',
    genericName: 'Amlodipine Besylate',
    condition: 'Hypertension',
    dosage: '5 mg',
    form: 'pill',
    scheduledTimes: ['08:00'],
    instructions: 'Take in the morning with or without food',
    stockCount: 26,
    refillThreshold: 7,
    refillUnit: 'pills',
    prescribingDoctor: 'Dr. Aris Thorne',
    rxNumber: 'RX-661042',
    pharmacyName: 'CVS Pharmacy #4192',
    pharmacyPhone: '(555) 782-9011',
    colorTag: 'rose',
  },
];

// Helper to generate past 14 days of realistic logs
export function generateInitialLogs(): DoseLog[] {
  const logs: DoseLog[] = [];
  const today = new Date();

  // Create logs for the past 14 days
  for (let i = 14; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === 0;
    const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Morning Meds (08:00)
    // 1. Metformin Morning
    if (isToday) {
      logs.push({
        id: `log-today-metformin-morn`,
        medicineId: 'med-1',
        date: dateStr,
        scheduledTime: '08:00',
        status: 'taken',
        loggedAt: `${dateStr}T08:14:00Z`,
        takenTime: '08:14',
      });
    } else {
      // 2 skips due to ran out on days -4 and -5
      if (i === 4 || i === 5) {
        logs.push({
          id: `log-${dateStr}-metformin-morn`,
          medicineId: 'med-1',
          date: dateStr,
          scheduledTime: '08:00',
          status: 'skipped',
          loggedAt: `${dateStr}T09:30:00Z`,
          skipReason: 'ran_out',
          customNote: 'Ran out of pills before picking up refill',
        });
      } else {
        logs.push({
          id: `log-${dateStr}-metformin-morn`,
          medicineId: 'med-1',
          date: dateStr,
          scheduledTime: '08:00',
          status: 'taken',
          loggedAt: `${dateStr}T08:10:00Z`,
          takenTime: '08:10',
        });
      }
    }

    // 2. Lisinopril Morning
    if (isToday) {
      logs.push({
        id: `log-today-lisinopril`,
        medicineId: 'med-2',
        date: dateStr,
        scheduledTime: '08:00',
        status: 'taken',
        loggedAt: `${dateStr}T08:14:00Z`,
        takenTime: '08:14',
      });
    } else {
      // 3 skips due to side effects (dizziness) on days -2, -6, -9
      if (i === 2 || i === 6 || i === 9) {
        logs.push({
          id: `log-${dateStr}-lisinopril`,
          medicineId: 'med-2',
          date: dateStr,
          scheduledTime: '08:00',
          status: 'skipped',
          loggedAt: `${dateStr}T08:45:00Z`,
          skipReason: 'side_effects',
          sideEffectDetails: 'Mild dizziness upon standing up after waking',
          customNote: 'Felt lightheaded, paused morning dose',
        });
      } else {
        logs.push({
          id: `log-${dateStr}-lisinopril`,
          medicineId: 'med-2',
          date: dateStr,
          scheduledTime: '08:00',
          status: 'taken',
          loggedAt: `${dateStr}T08:15:00Z`,
          takenTime: '08:15',
        });
      }
    }

    // 3. Amlodipine Morning
    if (isToday) {
      logs.push({
        id: `log-today-amlodipine`,
        medicineId: 'med-4',
        date: dateStr,
        scheduledTime: '08:00',
        status: 'taken',
        loggedAt: `${dateStr}T08:14:00Z`,
        takenTime: '08:14',
      });
    } else {
      logs.push({
        id: `log-${dateStr}-amlodipine`,
        medicineId: 'med-4',
        date: dateStr,
        scheduledTime: '08:00',
        status: 'taken',
        loggedAt: `${dateStr}T08:12:00Z`,
        takenTime: '08:12',
      });
    }

    // Evening Meds
    // 4. Metformin Evening (20:00)
    if (isToday) {
      logs.push({
        id: `log-today-metformin-eve`,
        medicineId: 'med-1',
        date: dateStr,
        scheduledTime: '20:00',
        status: 'pending', // Awaiting patient input!
      });
    } else {
      // On weekends, forgotten!
      if (isWeekend) {
        logs.push({
          id: `log-${dateStr}-metformin-eve`,
          medicineId: 'med-1',
          date: dateStr,
          scheduledTime: '20:00',
          status: 'skipped',
          loggedAt: `${dateStr}T22:30:00Z`,
          skipReason: 'forgot',
          customNote: 'Dinner routine changed with family visiting',
        });
      } else {
        // On weekdays, taken, but consistently at 21:15 (routine shift!)
        logs.push({
          id: `log-${dateStr}-metformin-eve`,
          medicineId: 'med-1',
          date: dateStr,
          scheduledTime: '20:00',
          status: 'taken',
          loggedAt: `${dateStr}T21:15:00Z`,
          takenTime: '21:15',
        });
      }
    }

    // 5. Atorvastatin Night (21:00)
    if (isToday) {
      logs.push({
        id: `log-today-atorvastatin`,
        medicineId: 'med-3',
        date: dateStr,
        scheduledTime: '21:00',
        status: 'pending',
      });
    } else {
      // Skipped 3 times because "felt fine" (common asymptomatic dropoff in statins/blood pressure)
      if (i === 3 || i === 7 || i === 11) {
        logs.push({
          id: `log-${dateStr}-atorvastatin`,
          medicineId: 'med-3',
          date: dateStr,
          scheduledTime: '21:00',
          status: 'skipped',
          loggedAt: `${dateStr}T21:40:00Z`,
          skipReason: 'felt_fine',
          customNote: 'Felt completely well with good energy, thought skip was harmless',
        });
      } else {
        logs.push({
          id: `log-${dateStr}-atorvastatin`,
          medicineId: 'med-3',
          date: dateStr,
          scheduledTime: '21:00',
          status: 'taken',
          loggedAt: `${dateStr}T21:10:00Z`,
          takenTime: '21:10',
        });
      }
    }
  }

  return logs;
}
