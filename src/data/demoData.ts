import type { ApprovalTask, AuditLog, DocumentRecord, ReleaseItem, UserProfile, VersionRecord } from "@/types/domain";

export const demoUsers: Array<UserProfile & { password: string }> = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    displayName: "系统管理员",
    department: "质量管理部",
    roles: ["admin", "document_manager", "publisher", "auditor"],
    permissions: ["document.read", "document.write", "version.submit", "approval.handle", "release.publish", "permission.manage", "audit.read"],
  },
  {
    id: 2,
    username: "author",
    password: "author123",
    displayName: "研发作者",
    department: "研发中心",
    roles: ["author"],
    permissions: ["document.read", "document.write", "version.submit"],
  },
  {
    id: 3,
    username: "approver",
    password: "approver123",
    displayName: "质量审批人",
    department: "质量管理部",
    roles: ["approver"],
    permissions: ["document.read", "approval.handle"],
  },
];

export const documents: DocumentRecord[] = [
  {
    id: 101,
    code: "QMS-SOP-001",
    title: "生产异常处理标准操作规程",
    category: "质量体系",
    owner: "研发作者",
    department: "质量管理部",
    confidentialityLevel: "confidential",
    status: "active",
    currentVersionId: 1002,
    tags: ["SOP", "质量", "生产"],
    summary: "定义生产异常识别、升级、审批与复盘的标准流程。",
    updatedAt: "2026-07-01",
  },
  {
    id: 102,
    code: "RD-SPEC-014",
    title: "核心组件接口设计说明",
    category: "研发规范",
    owner: "研发作者",
    department: "研发中心",
    confidentialityLevel: "secret",
    status: "draft",
    currentVersionId: null,
    tags: ["接口", "架构", "研发"],
    summary: "描述核心组件 API 合约、兼容性规则和版本演进策略。",
    updatedAt: "2026-07-03",
  },
  {
    id: 103,
    code: "OPS-POL-006",
    title: "发布窗口与回滚管理制度",
    category: "运营制度",
    owner: "系统管理员",
    department: "运营部",
    confidentialityLevel: "internal",
    status: "active",
    currentVersionId: 3001,
    tags: ["发布", "回滚", "制度"],
    summary: "约束线上发布窗口、审批责任和回滚触发条件。",
    updatedAt: "2026-06-28",
  },
];

export const versions: VersionRecord[] = [
  {
    id: 1001,
    documentId: 101,
    versionNo: "v1.0",
    status: "published",
    createdBy: "研发作者",
    changeSummary: "首版发布，建立异常处理闭环。",
    submittedAt: "2026-06-12",
    approvedAt: "2026-06-14",
    publishedAt: "2026-06-15",
  },
  {
    id: 1002,
    documentId: 101,
    versionNo: "v1.1",
    status: "published",
    createdBy: "研发作者",
    changeSummary: "补充重大异常 2 小时内升级规则。",
    submittedAt: "2026-06-26",
    approvedAt: "2026-06-29",
    publishedAt: "2026-07-01",
  },
  {
    id: 2001,
    documentId: 102,
    versionNo: "v0.3",
    status: "in_review",
    createdBy: "研发作者",
    changeSummary: "新增接口弃用策略与兼容性矩阵。",
    submittedAt: "2026-07-03",
    approvedAt: null,
    publishedAt: null,
  },
  {
    id: 3001,
    documentId: 103,
    versionNo: "v2.0",
    status: "approved",
    createdBy: "系统管理员",
    changeSummary: "增加灰度发布检查项和回滚口径。",
    submittedAt: "2026-06-25",
    approvedAt: "2026-06-27",
    publishedAt: null,
  },
];

export const approvalTasks: ApprovalTask[] = [
  {
    id: 501,
    versionId: 2001,
    documentCode: "RD-SPEC-014",
    documentTitle: "核心组件接口设计说明",
    nodeName: "质量负责人审批",
    assignee: "质量审批人",
    status: "pending",
    createdAt: "2026-07-03",
    opinion: "",
  },
];

export const releaseQueue: ReleaseItem[] = [
  {
    versionId: 3001,
    documentCode: "OPS-POL-006",
    documentTitle: "发布窗口与回滚管理制度",
    versionNo: "v2.0",
    approvedAt: "2026-06-27",
    checks: ["审批已完成", "版本号唯一", "当前文档未废止", "权限策略已配置"],
  },
];

export const auditLogs: AuditLog[] = [
  {
    id: 9001,
    actor: "研发作者",
    entityType: "document_version",
    entityId: 2001,
    action: "submit_review",
    message: "提交 v0.3 至质量负责人审批",
    createdAt: "2026-07-03 10:12",
  },
  {
    id: 9002,
    actor: "系统管理员",
    entityType: "document_version",
    entityId: 3001,
    action: "approve",
    message: "v2.0 审批通过，进入待发布",
    createdAt: "2026-06-27 16:42",
  },
];
