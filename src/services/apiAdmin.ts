import axiosInstance from "./apiClient";

const ADMIN_BASE = "/api/admin";

export const getAdmins = async (params = {}) => {
  const response = await axiosInstance.get(`${ADMIN_BASE}/list`, { params });
  return response.data;
};

export const onboardAdmin = async (adminData) => {
  const response = await axiosInstance.post(`${ADMIN_BASE}/onboard-admin`, adminData);
  return response.data;
};

export const updateAdmin = async (id, updates) => {
  const response = await axiosInstance.put(`${ADMIN_BASE}/${id}`, updates);
  return response.data;
};

export const deleteAdmin = async (id) => {
  const response = await axiosInstance.delete(`${ADMIN_BASE}/${id}`);
  return response.data;
};

export const updateAdminRole = async (id, role) => {
  const response = await axiosInstance.patch(`${ADMIN_BASE}/${id}/role`, { role });
  return response.data;
};

export const updateAdminStatus = async (id, isActive) => {
  const response = await axiosInstance.patch(`${ADMIN_BASE}/${id}/status`, { isActive });
  return response.data;
};
