'use client';

import type { BusinessStatus } from '@/lib/supabaseClient';

const STATUSES: { value: BusinessStatus; label: string; dot: string }[] = [
  { value: 'new', label: 'חדש', dot: 'bg-slate-400' },
  { value: 'sent', label: 'נשלח ללקוח', dot: 'bg-blue-400' },
  { value: 'negotiating', label: 'במשא ומתן', dot: 'bg-amber-400' },
  { value: 'closed', label: 'נסגר / שולם', dot: 'bg-emerald-400' },
  { value: 'irrelevant', label: 'לא רלוונטי', dot: 'bg-red-400' },
];

export function StatusSelector({
  value,
  onChange,
}: {
  value: BusinessStatus;
  onChange: (status: BusinessStatus) => void;
}) {
  const selectedStatus = STATUSES.find((s) => s.value === value) ?? STATUSES[0];

  return (
    <div className="relative w-full">
      <span className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${selectedStatus.dot}`} />
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as BusinessStatus)}
        className="w-full appearance-none rounded-xl border border-slate-700/50 bg-slate-800/70 px-10 py-3 text-sm font-heebo font-medium text-slate-200 shadow-sm shadow-slate-950/20 outline-none transition-colors hover:border-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700/40"
        aria-label="שינוי סטטוס"
      >
        {STATUSES.map((status) => (
          <option key={status.value} value={status.value} className="bg-slate-900 text-slate-200">
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
}
