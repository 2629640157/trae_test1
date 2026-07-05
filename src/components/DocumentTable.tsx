import { FileText } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type { DocumentRecord } from "@/types/domain";

type Props = {
  documents: DocumentRecord[];
  selectedId: number;
  onSelect: (id: number) => void;
};

export function DocumentTable({ documents, selectedId, onSelect }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">文档库</h2>
        <p className="mt-1 text-sm text-slate-500">按权限过滤后的文档基础信息与发布状态。</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">文档</th>
              <th className="px-5 py-3">分类</th>
              <th className="px-5 py-3">状态</th>
              <th className="px-5 py-3">密级</th>
              <th className="px-5 py-3">负责人</th>
              <th className="px-5 py-3">更新时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((document) => (
              <tr
                key={document.id}
                onClick={() => onSelect(document.id)}
                className={`cursor-pointer transition hover:bg-amber-50/50 ${selectedId === document.id ? "bg-amber-50" : "bg-white"}`}
              >
                <td className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">{document.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{document.code}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {document.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-600">{document.category}</td>
                <td className="px-5 py-4">
                  <StatusBadge value={document.status} />
                </td>
                <td className="px-5 py-4">
                  <StatusBadge value={document.confidentialityLevel} />
                </td>
                <td className="px-5 py-4 text-slate-600">{document.owner}</td>
                <td className="px-5 py-4 text-slate-500">{document.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
