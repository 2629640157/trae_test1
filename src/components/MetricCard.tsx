import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  note: string;
  icon: LucideIcon;
};

export function MetricCard({ label, value, note, icon: Icon }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className="rounded-xl bg-slate-950 p-3 text-amber-300">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{note}</p>
    </div>
  );
}
