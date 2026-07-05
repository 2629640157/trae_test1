import type { DocumentStatus, VersionStatus, ConfidentialityLevel } from "@/types/domain";

const statusMap: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  archived: "bg-zinc-100 text-zinc-600 ring-zinc-200",
  voided: "bg-red-50 text-red-700 ring-red-200",
  in_review: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-teal-50 text-teal-700 ring-teal-200",
  published: "bg-blue-50 text-blue-700 ring-blue-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  withdrawn: "bg-zinc-100 text-zinc-600 ring-zinc-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  public: "bg-green-50 text-green-700 ring-green-200",
  internal: "bg-sky-50 text-sky-700 ring-sky-200",
  confidential: "bg-orange-50 text-orange-700 ring-orange-200",
  secret: "bg-red-50 text-red-700 ring-red-200",
};

const labelMap: Record<string, string> = {
  draft: "草稿",
  active: "生效",
  archived: "归档",
  voided: "废止",
  in_review: "审批中",
  approved: "已通过",
  published: "已发布",
  rejected: "已驳回",
  withdrawn: "已撤回",
  pending: "待处理",
  public: "公开",
  internal: "内部",
  confidential: "机密",
  secret: "绝密",
};

type Props = {
  value: DocumentStatus | VersionStatus | ConfidentialityLevel | "pending" | "approved" | "rejected";
};

export function StatusBadge({ value }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusMap[value] ?? "bg-slate-100 text-slate-700 ring-slate-200"}`}>
      {labelMap[value] ?? value}
    </span>
  );
}
