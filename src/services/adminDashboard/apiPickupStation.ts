import axiosInstance from "../apiClient";

export async function getPickupStations() {
  const response = await axiosInstance.get(`/api/pickup-stations`);
  return response.data;
}

export async function getPickupStationsByStore(storeId: string) {
  const response = await axiosInstance.get(`/api/pickup-stations/store/${storeId}`);
  return response.data;
}

export async function createPickupStation(stationData: any) {
  const response = await axiosInstance.post(`/api/pickup-stations`, stationData);
  return response.data;
}

export async function getPickupStationById(id: string) {
  const response = await axiosInstance.get(`/api/pickup-stations/${id}`);
  return response.data;
}

export async function updatePickupStation(id: string, stationData: any) {
  const response = await axiosInstance.put(`/api/pickup-stations/${id}`, stationData);
  return response.data;
}

export async function deletePickupStation(id: string) {
  const response = await axiosInstance.delete(`/api/pickup-stations/${id}`);
  return response.data;
}

export async function assignProductToStation(productId: string, stationId: string, initialStock = 0) {
  const response = await axiosInstance.post(`/api/pickup-stations/assign-product`, { productId, stationId, initialStock });
  return response.data;
}

export async function updateStationStock(productPickupStationId: string, newQuantity: number) {
  const response = await axiosInstance.put(`/api/pickup-stations/update-stock`, { productPickupStationId, newQuantity });
  return response.data;
}
