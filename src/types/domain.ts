export type ConfidentialityLevel = "public" | "internal" | "confidential" | "secret";
export type DocumentStatus = "draft" | "active" | "archived" | "voided";
export type VersionStatus = "draft" | "in_review" | "approved" | "published" | "rejected" | "withdrawn" | "voided";

export type UserProfile = {
  id: number;
  username: string;
  displayName: string;
  department: string;
  roles: string[];
  permissions: string[];
};

export type DocumentRecord = {
  id: number;
  code: string;
  title: string;
  category: string;
  owner: string;
  department: string;
  confidentialityLevel: ConfidentialityLevel;
  status: DocumentStatus;
  currentVersionId: number | null;
  tags: string[];
  summary: string;
  updatedAt: string;
};

export type VersionRecord = {
  id: number;
  documentId: number;
  versionNo: string;
  status: VersionStatus;
  createdBy: string;
  changeSummary: string;
  submittedAt: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
};

export type ApprovalTask = {
  id: number;
  versionId: number;
  documentCode: string;
  documentTitle: string;
  nodeName: string;
  assignee: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  opinion: string;
};

export type ReleaseItem = {
  versionId: number;
  documentCode: string;
  documentTitle: string;
  versionNo: string;
  approvedAt: string;
  checks: string[];
};

export type AuditLog = {
  id: number;
  actor: string;
  entityType: string;
  entityId: number;
  action: string;
  message: string;
  createdAt: string;
};

export type DocumentFilters = {
  keyword: string;
  status: string;
  category: string;
  department: string;
  confidentialityLevel: string;
};
