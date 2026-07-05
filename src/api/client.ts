import type { DocumentFilters } from "@/types/domain";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = window.localStorage.getItem("document_approval_token");
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: "请求失败" }));
    throw new Error(payload.error ?? "请求失败");
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  login(username: string, password: string) {
    return request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  documents(filters: Partial<DocumentFilters>) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    return request(`/documents?${params.toString()}`);
  },
  versions(documentId: number) {
    return request(`/documents/${documentId}/versions`);
  },
  approvalTasks() {
    return request("/approvals/tasks");
  },
  approveTask(taskId: number) {
    return request(`/approvals/tasks/${taskId}/approve`, { method: "POST" });
  },
  rejectTask(taskId: number) {
    return request(`/approvals/tasks/${taskId}/reject`, { method: "POST" });
  },
  releaseQueue() {
    return request("/releases/pending");
  },
  publish(versionId: number) {
    return request(`/versions/${versionId}/publish`, { method: "POST" });
  },
  auditLogs() {
    return request("/audit-logs");
  },
};
