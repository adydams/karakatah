import axiosInstance from "../apiClient";

export interface Permission {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionsResponse {
  success: boolean;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  data: Permission[];
}

export async function getPermissions(params?: { name?: string; page?: number; limit?: number }): Promise<PermissionsResponse> {
  const response = await axiosInstance.get("/api/permission", { params });
  return response.data;
}

export async function createPermission(payload: { name: string; description: string }) {
  const response = await axiosInstance.post("/api/permission", payload);
  return response.data;
}

export async function createPermissionsBulk(payload: Array<{ name: string; description: string }>) {
  const response = await axiosInstance.post("/api/permission/bulk", payload);
  return response.data;
}

export async function updatePermission(id: string, payload: { name?: string; description?: string }) {
  const response = await axiosInstance.put(`/api/permission/${id}`, payload);
  return response.data;
}

export async function deletePermission(id: string) {
  const response = await axiosInstance.delete(`/api/permission/${id}`);
  return response.data;
}

export async function assignPermissionsToRole(payload: { roleId: string; permissionIds: string[] }) {
  const response = await axiosInstance.post("/api/permission/assign-permissions-to-role", payload);
  return response.data;
}
