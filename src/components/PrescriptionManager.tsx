import React, { useState } from 'react';
import { Medicine } from '../types';
import { Plus, Package, Clock, ShieldCheck, AlertTriangle, Phone, FileText, Check, X } from 'lucide-react';

interface PrescriptionManagerProps {
  medicines: Medicine[];
  onAddMedicine: (newMed: Omit<Medicine, 'id'>) => void;
  onRefillMedicine: (id: string, count: number) => void;
}

export const PrescriptionManager: React.FC<PrescriptionManagerProps> = ({
  medicines,
  onAddMedicine,
  onRefillMedicine,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [condition, setCondition] = useState('');
  const [dosage, setDosage] = useState('');
  const [form, setForm] = useState<Medicine['form']>('pill');
  const [time1, setTime1] = useState('08:00');
  const [time2, setTime2] = useState('');
  const [instructions, setInstructions] = useState('');
  const [stockCount, setStockCount] = useState(30);
  const [refillThreshold, setRefillThreshold] = useState(7);
  const [prescribingDoctor, setPrescribingDoctor] = useState('Dr. Aris Thorne');
  const [pharmacyName, setPharmacyName] = useState('CVS Pharmacy');
  const [pharmacyPhone, setPharmacyPhone] = useState('(555) 782-9011');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    const scheduledTimes = [time1];
    if (time2.trim()) scheduledTimes.push(time2.trim());

    onAddMedicine({
      name: name.trim(),
      genericName: genericName.trim() || undefined,
      condition: condition.trim() || 'General health maintenance',
      dosage: dosage.trim(),
      form,
      scheduledTimes,
      instructions: instructions.trim() || 'Take as directed by physician',
      stockCount: Number(stockCount) || 30,
      refillThreshold: Number(refillThreshold) || 7,
      refillUnit: 'pills',
      prescribingDoctor: prescribingDoctor.trim() || 'Attending Physician',
      pharmacyName: pharmacyName.trim() || 'Local Pharmacy',
      pharmacyPhone: pharmacyPhone.trim() || '(555) 000-0000',
      colorTag: 'teal',
    });

    setIsAddModalOpen(false);
    // Reset fields
    setName('');
    setDosage('');
    setCondition('');
    setInstructions('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400">
            <span>Prescription & Stock Inventory</span>
            <span aria-hidden="true">·</span>
            <span>Early Warning Protection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Your Prescribed Medicines
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
            Track daily pill counts, receive restock warnings before running out, and keep your care team synced.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-900 dark:text-white">Prescription Integrity:</span> The app never changes your dosage or therapy. All medications listed here reflect your doctor's exact orders.
        </p>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medicines.map((med) => {
          const isLowStock = med.stockCount <= med.refillThreshold;
          return (
            <div
              key={med.id}
              className={`p-5 rounded-2xl border transition-all ${
                isLowStock
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {med.name}
                    </h3>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {med.dosage}
                    </span>
                  </div>
                  {med.genericName && (
                    <div className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                      {med.genericName}
                    </div>
                  )}
                  <div className="text-xs text-teal-700 dark:text-teal-400 font-medium mt-1">
                    {med.condition}
                  </div>
                </div>

                {isLowStock ? (
                  <div className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center gap-1 shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Low Stock</span>
                  </div>
                ) : (
                  <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium shrink-0">
                    Stock OK
                  </div>
                )}
              </div>

              {/* Schedule and Instructions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    Scheduled at: <strong>{med.scheduledTimes.join(', ')}</strong> daily
                  </span>
                </div>
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{med.instructions}</span>
                </div>
              </div>

              {/* Stock and Refill Controls */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Pills Remaining</div>
                  <div className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                    {med.stockCount}{' '}
                    <span className="text-xs font-normal text-slate-500">{med.refillUnit}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Warns when below {med.refillThreshold}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRefillMedicine(med.id, 30)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
                    title="Add 30 pills to supply count"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+30 Refill</span>
                  </button>
                  <button
                    onClick={() => onRefillMedicine(med.id, 60)}
                    className="px-3 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-100 hover:bg-teal-200 dark:bg-teal-900/60 rounded-lg transition-colors flex items-center gap-1"
                    title="Add 60 pills to supply count"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+60 Refill</span>
                  </button>
                </div>
              </div>

              {/* Pharmacy & Doctor */}
              <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Prescribed by {med.prescribingDoctor}</span>
                {med.pharmacyPhone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{med.pharmacyPhone}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Medicine Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Add New Prescription
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Brand / Medicine Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Metformin"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 500 mg"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Treated Condition
                </label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="e.g. Type 2 Diabetes, High Blood Pressure"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Morning Timing (Time 1)
                  </label>
                  <input
                    type="time"
                    required
                    value={time1}
                    onChange={(e) => setTime1(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Evening Timing (Time 2, optional)
                  </label>
                  <input
                    type="time"
                    value={time2}
                    onChange={(e) => setTime2(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Pill Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stockCount}
                    onChange={(e) => setStockCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Refill Warning At (Pills)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={refillThreshold}
                    onChange={(e) => setRefillThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Food Instructions / Notes
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Take with breakfast or with food"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors"
                >
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
