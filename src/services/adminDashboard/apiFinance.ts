import axiosInstance from "../apiClient";

export const apiFinance = {
  getOverview: async () => {
    const response = await axiosInstance.get("/api/admin/finance/overview");
    return response.data;
  },
  getRevenueChart: async () => {
    const response = await axiosInstance.get("/api/admin/finance/revenue-chart");
    return response.data;
  },
  getWallets: async (page = 1, limit = 10, search = "") => {
    const response = await axiosInstance.get(`/api/admin/finance/wallets?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  },
  getWalletDetails: async (walletId: string) => {
    const response = await axiosInstance.get(`/api/admin/finance/wallet/${walletId}`);
    return response.data;
  },
  getGlobalTransactions: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/api/admin/finance/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },
  getPayouts: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/api/admin/finance/payouts?page=${page}&limit=${limit}`);
    return response.data;
  },
  triggerPayout: async (payoutData: any) => {
    const response = await axiosInstance.post("/api/admin/finance/payouts/trigger", payoutData);
    return response.data;
  },
  adjustBalance: async (adjustmentData: any) => {
    const response = await axiosInstance.post("/api/admin/finance/wallets/adjust", adjustmentData);
    return response.data;
  },
  triggerGlobalPayout: async () => {
    const response = await axiosInstance.post("/api/admin/finance/payouts/global");
    return response.data;
  },
  exportFinancialReport: async () => {
    const response = await axiosInstance.get("/api/admin/finance/export-report", {
      responseType: "blob",
    });
    return response.data;
  },
};
