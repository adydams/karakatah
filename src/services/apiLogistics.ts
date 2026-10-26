import axiosInstance from "./apiClient";

export async function getCouriers(_params?: unknown) {
  const response = await axiosInstance.get(`/api/logistics/couriers`);
  return response.data;
}

export async function getBoxSizes(_params?: unknown) {
  const response = await axiosInstance.get(`/api/logistics/boxes`);
  return response.data;
}

export async function fetchRates(payload: Record<string, unknown>) {
  // payload should follow backend expectations for /api/logistics/rates
  const response = await axiosInstance.post(`/api/logistics/rates`, payload);
  return response.data;
}
