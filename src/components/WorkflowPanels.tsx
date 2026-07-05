import { CheckCircle2, ClipboardCheck, LockKeyhole, Rocket, ShieldCheck, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type { ApprovalTask, AuditLog, ReleaseItem, UserProfile } from "@/types/domain";

type ApprovalProps = {
  user: UserProfile;
  tasks: ApprovalTask[];
  onHandle: (taskId: number, approved: boolean) => void;
};

type ReleaseProps = {
  user: UserProfile;
  items: ReleaseItem[];
  onPublish: (versionId: number) => void;
};

export function ApprovalPanel({ user, tasks, onHandle }: ApprovalProps) {
  const canApprove = user.permissions.includes("approval.handle");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <PanelTitle icon={ClipboardCheck} title="审批中心" subtitle="待办节点、审批意见和流程推进。" />
      <div className="mt-5 space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{task.documentTitle}</p>
                <p className="mt-1 text-xs text-slate-500">{task.documentCode} · {task.nodeName}</p>
              </div>
              <StatusBadge value={task.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button disabled={!canApprove || task.status !== "pending"} onClick={() => onHandle(task.id, true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300">
                <CheckCircle2 size={16} /> 通过
              </button>
              <button disabled={!canApprove || task.status !== "pending"} onClick={() => onHandle(task.id, false)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400">
                <XCircle size={16} /> 驳回
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ReleasePanel({ user, items, onPublish }: ReleaseProps) {
  const canPublish = user.permissions.includes("release.publish");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <PanelTitle icon={Rocket} title="发布管控" subtitle="发布前检查、当前有效版本控制和发布队列。" />
      <div className="mt-5 space-y-3">
        {items.length === 0 ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">暂无待发布版本。</p> : null}
        {items.map((item) => (
          <div key={item.versionId} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{item.documentTitle}</p>
                <p className="mt-1 text-xs text-slate-500">{item.documentCode} · {item.versionNo} · 通过于 {item.approvedAt}</p>
              </div>
              <button disabled={!canPublish} onClick={() => onPublish(item.versionId)} className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300">
                发布
              </button>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {item.checks.map((check) => (
                <span key={check} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-teal-700 ring-1 ring-slate-100">
                  <ShieldCheck size={14} /> {check}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PermissionPanel({ user }: { user: UserProfile }) {
  const rows = [
    ["文档读取", "document.read"],
    ["文档编辑", "document.write"],
    ["提交审批", "version.submit"],
    ["审批处理", "approval.handle"],
    ["版本发布", "release.publish"],
    ["权限配置", "permission.manage"],
    ["审计查看", "audit.read"],
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <PanelTitle icon={LockKeyhole} title="权限隔离" subtitle={`${user.displayName} · ${user.department}`} />
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {rows.map(([label, permission]) => (
          <div key={permission} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
            <span className="text-slate-600">{label}</span>
            <span className={user.permissions.includes(permission) ? "font-semibold text-emerald-700" : "text-slate-400"}>
              {user.permissions.includes(permission) ? "允许" : "隔离"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AuditPanel({ logs }: { logs: AuditLog[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <PanelTitle icon={ShieldCheck} title="审计日志" subtitle="关键操作全链路留痕。" />
      <div className="mt-5 space-y-3">
        {logs.slice(0, 5).map((log) => (
          <div key={log.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">{log.message}</p>
            <p className="mt-1 text-xs text-slate-500">{log.actor} · {log.action} · {log.createdAt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PanelTitle({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-slate-950 p-3 text-amber-300">
        <Icon size={20} />
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}
