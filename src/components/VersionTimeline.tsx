import { GitBranch } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type { DocumentRecord, VersionRecord } from "@/types/domain";

type Props = {
  document: DocumentRecord | undefined;
  versions: VersionRecord[];
};

export function VersionTimeline({ document, versions }: Props) {
  if (!document) {
    return null;
  }

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-slate-950 p-3 text-amber-300">
          <GitBranch size={20} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-950">版本时间线</h2>
          <p className="text-sm text-slate-500">{document.code}</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {versions.map((version) => (
          <div key={version.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{version.versionNo}</p>
                <p className="mt-1 text-xs text-slate-500">创建人：{version.createdBy}</p>
              </div>
              <StatusBadge value={version.status} />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{version.changeSummary}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500">
              <span>提交：{version.submittedAt ?? "-"}</span>
              <span>通过：{version.approvedAt ?? "-"}</span>
              <span>发布：{version.publishedAt ?? "-"}</span>
            </div>
            {document.currentVersionId === version.id ? (
              <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">当前有效版本</div>
            ) : null}
          </div>
        ))}
      </div>
    </aside>
  );
}
