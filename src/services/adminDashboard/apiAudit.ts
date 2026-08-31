import axiosInstance from "../apiClient";

export interface AuditLog {
  id: string;
  userId: string;
  user?: {
    name: string;
    email: string;
  };
  action: string;
  entityType: string;
  entityId: string;
  oldValue: any;
  newValue: any;
  createdAt: string;
}

export interface AuditLogsResponse {
  success: boolean;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  data: AuditLog[];
}

export async function getAuditLogs(params?: {
  action?: string;
  entityType?: string;
  userId?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<AuditLogsResponse> {
  const response = await axiosInstance.get("/api/audit", { params });
  return response.data;
}

export async function getAuditLogDetail(id: string): Promise<{ success: boolean; data: AuditLog }> {
  const response = await axiosInstance.get(`/api/audit/${id}`);
  return response.data;
}
