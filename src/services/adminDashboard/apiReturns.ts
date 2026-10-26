import axiosInstance from "../apiClient";

export const apiReturns = {
  getReturnRequests: async (params: Record<string, unknown> = {}) => {
    const response = await axiosInstance.get("/api/admin/returns", { params });
    return response.data;
  },
  approveReturn: async (returnId: string, data: { restock: boolean }) => {
    const response = await axiosInstance.post(`/api/admin/returns/${returnId}/approve`, data);
    return response.data;
  },
  rejectReturn: async (returnId: string, reason: string) => {
    const response = await axiosInstance.post(`/api/admin/returns/${returnId}/reject`, { reason });
    return response.data;
  },
  confirmRestock: async (returnId: string) => {
    const response = await axiosInstance.post(`/api/admin/returns/${returnId}/confirm-restock`, {});
    return response.data;
  },
};
