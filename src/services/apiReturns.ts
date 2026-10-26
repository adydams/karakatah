import axiosInstance from "./apiClient";

export const apiReturn = {
  createReturnRequest: async (data: any) => {
    const response = await axiosInstance.post("/api/returns", data);
    return response.data;
  },
  getReturnStatus: async (returnId: string) => {
    const response = await axiosInstance.get(`/api/returns/${returnId}`);
    return response.data;
  },
  getMyReturns: async () => {
    const response = await axiosInstance.get("/api/returns");
    return response.data;
  },
  getReturns: async (params: any) => {
    const response = await axiosInstance.get("/api/returns", { params });
    return response.data;
  },
  approveReturn: async ({ id, faultParty }: { id: string; faultParty: string }) => {
    const response = await axiosInstance.patch(`/api/returns/${id}/approve`, { faultParty });
    return response.data;
  },
  rejectReturn: async ({ id, reason }: { id: string; reason: string }) => {
    const response = await axiosInstance.patch(`/api/returns/${id}/reject`, { reason });
    return response.data;
  },
  getReturnShippingRates: async ({ id, pickupDate }: { id: string; pickupDate?: string }) => {
    const response = await axiosInstance.post(`/api/returns/${id}/shipping-rates`, { pickupDate });
    return response.data;
  },
  confirmRestock: async (id: string) => {
    const response = await axiosInstance.patch(`/api/returns/${id}/confirm-restock`);
    return response.data;
  },
  markPickedUp: async (id: string, hubId: string) => {
    const response = await axiosInstance.patch(`/api/returns/${id}/mark-picked-up`, { hubId });
    return response.data;
  },
};

// Named exports for easier access in some components
export const createReturnRequest = apiReturn.createReturnRequest;
export const getReturnStatus = apiReturn.getReturnStatus;
export const getMyReturns = apiReturn.getMyReturns;
export const getReturns = apiReturn.getReturns;
export const approveReturn = apiReturn.approveReturn;
export const rejectReturn = apiReturn.rejectReturn;
export const getReturnShippingRates = apiReturn.getReturnShippingRates;
export const confirmRestock = apiReturn.confirmRestock;
export const markPickedUp = apiReturn.markPickedUp;
