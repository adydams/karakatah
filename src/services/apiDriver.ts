import axiosInstance from "./apiClient";

const DRIVER_BASE = "/api/driver";

export const getDriverTasks = async () => {
  const response = await axiosInstance.get(`${DRIVER_BASE}/tasks`);
  return response.data;
};

export const updateShipmentStatus = async (shipmentId, statusData) => {
  const response = await axiosInstance.patch(`${DRIVER_BASE}/shipment/${shipmentId}/status`, statusData);
  return response.data;
};
