import axiosInstance from "./apiClient";

const ADMIN_BASE = "/api/admin";

export const getAdmins = async (params: Record<string, unknown> = {}) => {
  const response = await axiosInstance.get(`${ADMIN_BASE}/list`, { params });
  return response.data;
};

export const onboardAdmin = async (adminData: Record<string, unknown>) => {
  const response = await axiosInstance.post(`${ADMIN_BASE}/onboard-admin`, adminData);
  return response.data;
};

export const updateAdmin = async (id: string, updates: Record<string, unknown>) => {
  const response = await axiosInstance.put(`${ADMIN_BASE}/${id}`, updates);
  return response.data;
};

export const deleteAdmin = async (id: string) => {
  const response = await axiosInstance.delete(`${ADMIN_BASE}/${id}`);
  return response.data;
};

export const updateAdminRole = async (id: string, role: string) => {
  const response = await axiosInstance.patch(`${ADMIN_BASE}/${id}/role`, { role });
  return response.data;
};

export const updateAdminStatus = async (id: string, isActive: boolean) => {
  const response = await axiosInstance.patch(`${ADMIN_BASE}/${id}/status`, { isActive });
  return response.data;
};

// --- Discount Management ---
export const getDiscounts = async (params: Record<string, unknown> = {}) => {
  const response = await axiosInstance.get(`${ADMIN_BASE}/discounts`, { params });
  return response.data;
};

export const createDiscount = async (discountData: Record<string, unknown>) => {
  const response = await axiosInstance.post(`${ADMIN_BASE}/discounts`, discountData);
  return response.data;
};

export const updateDiscount = async (id: string, updates: Record<string, unknown>) => {
  const response = await axiosInstance.put(`${ADMIN_BASE}/discounts/${id}`, updates);
  return response.data;
};

export const toggleDiscountStatus = async (id: string) => {
  const response = await axiosInstance.patch(`${ADMIN_BASE}/discounts/${id}/status`);
  return response.data;
};

export const deleteDiscount = async (id: string) => {
  const response = await axiosInstance.delete(`${ADMIN_BASE}/discounts/${id}`);
  return response.data;
};

// --- Driver Reports ---
export const getCaptains = async (params: Record<string, unknown> = {}) => {
  const response = await axiosInstance.get(`${ADMIN_BASE}/drivers/captains`, { params });
  return response.data;
};

export const getDriversSummary = async () => {
  const response = await axiosInstance.get(`${ADMIN_BASE}/drivers/summary`);
  return response.data;
};

export const getShipments = async (params: Record<string, unknown> = {}) => {
  const response = await axiosInstance.get(`${ADMIN_BASE}/drivers/shipments`, { params });
  return response.data;
};

export const cancelShipment = async (id: string) => {
  const response = await axiosInstance.post(`${ADMIN_BASE}/shipments/${id}/cancel`);
  return response.data;
};

export const reassignProvider = async (id: string, provider: string) => {
  const response = await axiosInstance.patch(`${ADMIN_BASE}/shipment/${id}/provider`, { provider });
  return response.data;
};

export const getDriverReport = async (driverId: string) => {
  const response = await axiosInstance.get(`${ADMIN_BASE}/drivers/report/${driverId}`);
  return response.data;
};

export const assignDriver = async (data: { shipmentId: string; driverId: string }) => {
  const response = await axiosInstance.post(`${ADMIN_BASE}/drivers/assign`, data);
  return response.data;
};

export const recoverShipments = async () => {
  const response = await axiosInstance.post(`${ADMIN_BASE}/shipments/recover`);
  return response.data;
};

export const updateShipmentStatus = async ({ id, status }: { id: string; status: string }) => {
  const response = await axiosInstance.patch(`${ADMIN_BASE}/shipment/${id}/status`, { status });
  return response.data;
};

export const trackShipment = async (id: string) => {
  const response = await axiosInstance.post(`${ADMIN_BASE}/shipments/${id}/track`);
  return response.data;
};

export const updateFulfillmentStatus = async (fulfillmentId: string, status: string, note?: string) => {
  const response = await axiosInstance.patch(`/api/admin/fulfillment/${fulfillmentId}/status`, { status, note });
  return response.data;
};

export const markShipmentDelivered = async (id: string) => {
  const response = await axiosInstance.post(`${ADMIN_BASE}/shipments/${id}/mark-delivered`);
  return response.data;
};

export const getStoreOrderApprovals = async () => {
  const response = await axiosInstance.get("/api/order-approvals");
  return response.data;
};

export const decideStoreOrderApproval = async (orderItemId: string, decision: "approved" | "declined", reason?: string) => {
  const response = await axiosInstance.patch(`/api/order-approvals/${orderItemId}`, {
    decision: decision === "approved" ? "APPROVED" : "DECLINED",
    reason,
  });
  return response.data;
};

export const getPendingProductApprovals = async () => {
  const response = await axiosInstance.get("/api/products/admin/pending-approvals");
  return response.data;
};

export const decideProductApproval = async (id: string, decision: "approved" | "rejected", rejectionReason?: string) => {
  const response = await axiosInstance.patch(`/api/products/${id}/approval`, {
    decision: decision === "approved" ? "APPROVE" : "REJECT",
    reason: rejectionReason,
  });
  return response.data;
};

export type Hub = {
  id: string;
  code: string;
  name: string;
  address: string;
  state: string;
  country: string;
  lga?: string | null;
  phone: string;
  email: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  isActive: boolean;
};

export const getHubs = async () => {
  const response = await axiosInstance.get("/api/hubs");
  return response.data;
};

export const getAdminHubs = async () => {
  const response = await axiosInstance.get("/api/hubs/admin");
  return response.data;
};

export const createHub = async (data: Omit<Hub, "id">) => {
  const response = await axiosInstance.post("/api/hubs", data);
  return response.data;
};

export const updateHub = async (id: string, data: Partial<Omit<Hub, "id">>) => {
  const response = await axiosInstance.put(`/api/hubs/${id}`, data);
  return response.data;
};

export const deleteHub = async (id: string) => {
  const response = await axiosInstance.delete(`/api/hubs/${id}`);
  return response.data;
};

// --- Pricing Settings ---



export const getTopProducts = async () => {

  const response = await axiosInstance.get(`${ADMIN_BASE}/overview/top-products`);
  return response.data;

  
};

export const getCustomerStats = async () => {
  const response = await axiosInstance.get(`${ADMIN_BASE}/overview/customer-stats`);
  return response.data;
};

export const getShippingSettings = async () => {
  const response = await axiosInstance.get(`${ADMIN_BASE}/settings`);
  return response.data;
};

export const updateShippingSettings = async (settings: Record<string, number | string | boolean>) => {
  const response = await axiosInstance.patch(`${ADMIN_BASE}/settings`, settings);
  return response.data;
};
