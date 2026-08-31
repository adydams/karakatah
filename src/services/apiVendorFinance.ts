import axiosInstance from "./apiClient";

export const apiVendorFinance = {
  getBalance: async () => {
    const response = await axiosInstance.get("/wallet/balance");
    return response.data;
  },
  getTransactions: async () => {
    const response = await axiosInstance.get("/wallet/transactions");
    return response.data;
  },
  requestPayout: async (payoutData: any) => {
    const response = await axiosInstance.post("/wallet/payout", payoutData);
    return response.data;
  },
};
