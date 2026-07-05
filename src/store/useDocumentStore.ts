import { create } from "zustand";
import { approvalTasks, auditLogs, demoUsers, documents, releaseQueue, versions } from "@/data/demoData";
import type { ApprovalTask, AuditLog, DocumentFilters, DocumentRecord, ReleaseItem, UserProfile, VersionRecord } from "@/types/domain";

type StoreState = {
  user: UserProfile | null;
  loginError: string;
  documents: DocumentRecord[];
  versions: VersionRecord[];
  approvalTasks: ApprovalTask[];
  releaseQueue: ReleaseItem[];
  auditLogs: AuditLog[];
  selectedDocumentId: number;
  filters: DocumentFilters;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  setFilter: (key: keyof DocumentFilters, value: string) => void;
  selectDocument: (id: number) => void;
  handleApproval: (taskId: number, approved: boolean) => void;
  publishVersion: (versionId: number) => void;
};

const initialFilters: DocumentFilters = {
  keyword: "",
  status: "",
  category: "",
  department: "",
  confidentialityLevel: "",
};

const addAudit = (logs: AuditLog[], actor: string, action: string, message: string, entityId: number): AuditLog[] => [
  {
    id: Math.max(...logs.map((item) => item.id), 9000) + 1,
    actor,
    entityType: "document_version",
    entityId,
    action,
    message,
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
  },
  ...logs,
];

export const useDocumentStore = create<StoreState>((set, get) => ({
  user: null,
  loginError: "",
  documents,
  versions,
  approvalTasks,
  releaseQueue,
  auditLogs,
  selectedDocumentId: documents[0]?.id ?? 0,
  filters: initialFilters,

  login: (username, password) => {
    const found = demoUsers.find((item) => item.username === username && item.password === password);
    if (!found) {
      set({ loginError: "用户名或密码错误，可使用 admin/admin123 登录。" });
      return false;
    }

    const { password: _password, ...safeUser } = found;
    set({ user: safeUser, loginError: "" });
    return true;
  },

  logout: () => set({ user: null }),

  setFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
  },

  selectDocument: (id) => set({ selectedDocumentId: id }),

  handleApproval: (taskId, approved) => {
    const state = get();
    const task = state.approvalTasks.find((item) => item.id === taskId);
    if (!task || !state.user) {
      return;
    }

    set((current) => ({
      approvalTasks: current.approvalTasks.map((item) =>
        item.id === taskId ? { ...item, status: approved ? "approved" : "rejected", opinion: approved ? "同意发布前置审批。" : "请补充影响范围说明。" } : item,
      ),
      versions: current.versions.map((item) =>
        item.id === task.versionId
          ? {
              ...item,
              status: approved ? "approved" : "rejected",
              approvedAt: approved ? new Date().toISOString().slice(0, 10) : null,
            }
          : item,
      ),
      releaseQueue: approved
        ? [
            ...current.releaseQueue,
            {
              versionId: task.versionId,
              documentCode: task.documentCode,
              documentTitle: task.documentTitle,
              versionNo: current.versions.find((item) => item.id === task.versionId)?.versionNo ?? "vNext",
              approvedAt: new Date().toISOString().slice(0, 10),
              checks: ["审批已完成", "版本号唯一", "当前文档未废止", "权限策略已配置"],
            },
          ]
        : current.releaseQueue,
      auditLogs: addAudit(
        current.auditLogs,
        state.user.displayName,
        approved ? "approve" : "reject",
        `${task.documentCode} ${approved ? "审批通过" : "审批驳回"}`,
        task.versionId,
      ),
    }));
  },

  publishVersion: (versionId) => {
    const state = get();
    const version = state.versions.find((item) => item.id === versionId);
    const document = state.documents.find((item) => item.id === version?.documentId);
    if (!version || !document || !state.user) {
      return;
    }

    set((current) => ({
      versions: current.versions.map((item) =>
        item.documentId === version.documentId
          ? {
              ...item,
              status: item.id === versionId ? "published" : item.status === "published" ? "withdrawn" : item.status,
              publishedAt: item.id === versionId ? new Date().toISOString().slice(0, 10) : item.publishedAt,
            }
          : item,
      ),
      documents: current.documents.map((item) =>
        item.id === document.id
          ? {
              ...item,
              status: "active",
              currentVersionId: versionId,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : item,
      ),
      releaseQueue: current.releaseQueue.filter((item) => item.versionId !== versionId),
      auditLogs: addAudit(current.auditLogs, state.user.displayName, "publish", `${document.code} ${version.versionNo} 已发布为当前有效版本`, versionId),
    }));
  },
}));
