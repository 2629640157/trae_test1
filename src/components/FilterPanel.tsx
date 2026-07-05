import { Search } from "lucide-react";
import type { DocumentFilters } from "@/types/domain";

type Props = {
  filters: DocumentFilters;
  onChange: (key: keyof DocumentFilters, value: string) => void;
};

const selectClass = "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100";

export function FilterPanel({ filters, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.8fr]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
          <input
            value={filters.keyword}
            onChange={(event) => onChange("keyword", event.target.value)}
            placeholder="搜索编号、标题、标签、摘要"
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
          />
        </label>
        <select value={filters.status} onChange={(event) => onChange("status", event.target.value)} className={selectClass}>
          <option value="">全部状态</option>
          <option value="draft">草稿</option>
          <option value="active">生效</option>
          <option value="archived">归档</option>
        </select>
        <select value={filters.category} onChange={(event) => onChange("category", event.target.value)} className={selectClass}>
          <option value="">全部分类</option>
          <option value="质量体系">质量体系</option>
          <option value="研发规范">研发规范</option>
          <option value="运营制度">运营制度</option>
        </select>
        <select value={filters.department} onChange={(event) => onChange("department", event.target.value)} className={selectClass}>
          <option value="">全部部门</option>
          <option value="质量管理部">质量管理部</option>
          <option value="研发中心">研发中心</option>
          <option value="运营部">运营部</option>
        </select>
        <select value={filters.confidentialityLevel} onChange={(event) => onChange("confidentialityLevel", event.target.value)} className={selectClass}>
          <option value="">全部密级</option>
          <option value="public">公开</option>
          <option value="internal">内部</option>
          <option value="confidential">机密</option>
          <option value="secret">绝密</option>
        </select>
      </div>
    </div>
  );
}
