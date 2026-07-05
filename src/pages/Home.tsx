import { FormEvent, useMemo, useState } from "react";
import { Archive, BookOpenCheck, FileSearch, GitBranch, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { ApprovalPanel, AuditPanel, PermissionPanel, ReleasePanel } from "@/components/WorkflowPanels";
import { DocumentTable } from "@/components/DocumentTable";
import { FilterPanel } from "@/components/FilterPanel";
import { MetricCard } from "@/components/MetricCard";
import { VersionTimeline } from "@/components/VersionTimeline";
import { useDocumentStore } from "@/store/useDocumentStore";

const navItems = [
  ["dashboard", "工作台", LayoutDashboard],
  ["documents", "文档库", FileSearch],
  ["versions", "版本", GitBranch],
  ["workflow", "审批发布", BookOpenCheck],
  ["security", "权限审计", ShieldCheck],
] as const;

export default function Home() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const store = useDocumentStore();

  const filteredDocuments = useMemo(() => {
    const keyword = store.filters.keyword.trim().toLowerCase();
    return store.documents.filter((document) => {
      const haystack = [document.code, document.title, document.category, document.owner, document.department, document.summary, ...document.tags].join(" ").toLowerCase();
      return (
        (!keyword || haystack.includes(keyword)) &&
        (!store.filters.status || document.status === store.filters.status) &&
        (!store.filters.category || document.category === store.filters.category) &&
        (!store.filters.department || document.department === store.filters.department) &&
        (!store.filters.confidentialityLevel || document.confidentialityLevel === store.filters.confidentialityLevel)
      );
    });
  }, [store.documents, store.filters]);

  const selectedDocument = store.documents.find((document) => document.id === store.selectedDocumentId) ?? filteredDocuments[0];
  const selectedVersions = store.versions.filter((version) => version.documentId === selectedDocument?.id);

  const pendingTasks = store.approvalTasks.filter((task) => task.status === "pending").length;
  const publishedVersions = store.versions.filter((version) => version.status === "published").length;

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    store.login(username, password);
  };

  if (!store.user) {
    return (
      <main className="min-h-screen bg-[#0f2235] text-white">
        <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">Document Governance</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight tracking-tight">文档版本审批系统</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
              集中文档基础信息、多版本管理、审批流程、发布管控、权限隔离和多条件检索于一体，适合企业内部文控和合规审计场景。
            </p>
            <div className="mt-8 grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
              {["版本可追溯", "审批可留痕", "权限可隔离"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <form onSubmit={handleLogin} className="rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-2xl">
            <h2 className="text-2xl font-semibold">登录工作台</h2>
            <p className="mt-2 text-sm text-slate-500">演示账号：admin / admin123，也可使用 author / author123、approver / approver123。</p>
            <label className="mt-6 block text-sm font-semibold text-slate-700">
              用户名
              <input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-100" />
            </label>
            <label className="mt-4 block text-sm font-semibold text-slate-700">
              密码
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-100" />
            </label>
            {store.loginError ? <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{store.loginError}</p> : null}
            <button className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">进入系统</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f2ea] text-slate-950">
      <div className="mx-auto flex max-w-[1500px] gap-6 px-5 py-5">
        <aside className="sticky top-5 hidden h-[calc(100vh-40px)] w-64 shrink-0 rounded-3xl bg-slate-950 p-5 text-white shadow-xl lg:block">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-300 p-3 text-slate-950">
              <Archive size={22} />
            </div>
            <div>
              <p className="font-semibold">文档治理</p>
              <p className="text-xs text-slate-400">Version Control</p>
            </div>
          </div>
          <nav className="mt-8 space-y-2">
            {navItems.map(([id, label, Icon]) => (
              <a key={id} href={`#${id}`} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
                <Icon size={18} /> {label}
              </a>
            ))}
          </nav>
          <button onClick={store.logout} className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
            <LogOut size={16} /> 退出登录
          </button>
        </aside>

        <section className="min-w-0 flex-1 space-y-6">
          <header id="dashboard" className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">Controlled Release Desk</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight">文档版本审批工作台</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">当前用户：{store.user.displayName} · {store.user.department} · {store.user.roles.join(" / ")}</p>
              </div>
              <button onClick={store.logout} className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 lg:hidden">
                <LogOut size={16} /> 退出
              </button>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={FileSearch} label="文档总数" value={store.documents.length} note="覆盖质量、研发、运营分类" />
            <MetricCard icon={GitBranch} label="版本总数" value={store.versions.length} note={`${publishedVersions} 个版本已发布`} />
            <MetricCard icon={BookOpenCheck} label="待审批" value={pendingTasks} note="按审批人和权限隔离" />
            <MetricCard icon={ShieldCheck} label="待发布" value={store.releaseQueue.length} note="发布前检查全部留痕" />
          </section>

          <section id="documents" className="space-y-4">
            <FilterPanel filters={store.filters} onChange={store.setFilter} />
            <DocumentTable documents={filteredDocuments} selectedId={selectedDocument?.id ?? 0} onSelect={store.selectDocument} />
          </section>

          <section id="versions" className="grid gap-6 xl:grid-cols-[1fr_420px]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-950">文档基础信息</h2>
              <p className="mt-1 text-sm text-slate-500">{selectedDocument?.summary}</p>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["编号", selectedDocument?.code],
                  ["标题", selectedDocument?.title],
                  ["分类", selectedDocument?.category],
                  ["部门", selectedDocument?.department],
                  ["负责人", selectedDocument?.owner],
                  ["当前版本 ID", selectedDocument?.currentVersionId ?? "未发布"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-4">
                    <dt className="text-xs text-slate-500">{label}</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <VersionTimeline document={selectedDocument} versions={selectedVersions} />
          </section>

          <section id="workflow" className="grid gap-6 xl:grid-cols-2">
            <ApprovalPanel user={store.user} tasks={store.approvalTasks} onHandle={store.handleApproval} />
            <ReleasePanel user={store.user} items={store.releaseQueue} onPublish={store.publishVersion} />
          </section>

          <section id="security" className="grid gap-6 xl:grid-cols-2">
            <PermissionPanel user={store.user} />
            <AuditPanel logs={store.auditLogs} />
          </section>
        </section>
      </div>
    </main>
  );
}
