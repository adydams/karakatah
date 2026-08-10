import axiosInstance from "../apiClient";

export async function getStores() {
  const response = await axiosInstance.get(`/api/stores`);
  return response.data;
}

export async function getStoreDetail(storeId: string | undefined) {
  if (!storeId) return;
  const response = await axiosInstance.get(`/api/stores/${storeId}`);
  return response.data;
}

export async function createStore(storeData: any) {
  const response = await axiosInstance.post(`/api/stores`, storeData);
  return response.data;
}

export async function updateStore(storeId: string, storeData: any) {
  const response = await axiosInstance.put(`/api/stores/${storeId}`, storeData);
  return response.data;
}

export async function deleteStore(storeId: string) {
  const response = await axiosInstance.delete(`/api/stores/${storeId}`);
  return response.data;
}
