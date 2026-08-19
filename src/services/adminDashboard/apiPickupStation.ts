import axiosInstance from "../apiClient";

export async function getPickupStations() {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const response = await axiosInstance.get(`/api/pickup-stations`, { headers });
  return response.data;
}

export async function getPickupStationsByStore(storeId: string) {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const response = await axiosInstance.get(`/api/pickup-stations/store/${storeId}`, { headers });
  return response.data;
}

export async function createPickupStation(stationData: any) {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const response = await axiosInstance.post(`/api/pickup-stations`, stationData, { headers });
  return response.data;
}

export async function getPickupStationById(id: string) {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const response = await axiosInstance.get(`/api/pickup-stations/${id}`, { headers });
  return response.data;
}

export async function updatePickupStation(id: string, stationData: any) {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const response = await axiosInstance.put(`/api/pickup-stations/${id}`, stationData, { headers });
  return response.data;
}

export async function deletePickupStation(id: string) {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const response = await axiosInstance.delete(`/api/pickup-stations/${id}`, { headers });
  return response.data;
}

export async function assignProductToStation(productId: string, stationId: string, initialStock = 0) {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const response = await axiosInstance.post(`/api/pickup-stations/assign-product`, { productId, stationId, initialStock }, { headers });
  return response.data;
}

export async function updateStationStock(productPickupStationId: string, newQuantity: number) {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const response = await axiosInstance.put(`/api/pickup-stations/update-stock`, { productPickupStationId, newQuantity }, { headers });
  return response.data;
}
