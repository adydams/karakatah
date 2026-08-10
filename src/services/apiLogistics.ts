import axiosInstance from "./apiClient";

export async function getCouriers() {
  const response = await axiosInstance.get(`/api/logistics/couriers`);
  return response.data;
}
