import axiosInstance from "./apiClient";

const ORDERS_BASE = "/api/orders";

export const getOrderSummary = async () => {
  const response = await axiosInstance.get(`${ORDERS_BASE}/summary`);
  return response.data;
};

export const getOrderInvoice = async (orderId: string) => {
  const response = await axiosInstance.get(`${ORDERS_BASE}/invoice/${orderId}`);
  return response.data;
};

export const downloadOrderInvoice = async (orderId: string) => {
  const response = await axiosInstance.get(`${ORDERS_BASE}/invoice/${orderId}/pdf`, {
    responseType: "blob",
  });
  return response.data as Blob;
};

export const getAdminOrders = async ({ limit = 10, offset = 0, search = "", status = "ALL", startDate = null, endDate = null }) => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    search: search,
    status: status,
  });

  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await axiosInstance.get(`${ORDERS_BASE}?${params.toString()}`);
  return response.data;
};
