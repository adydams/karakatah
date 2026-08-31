import axiosInstance from "./apiClient";

export const apiNotifications = {
  getNotifications: async () => {
    const response = await axiosInstance.get("/api/notifications");
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await axiosInstance.patch(`/api/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await axiosInstance.patch("/api/notifications/read-all");
    return response.data;
  },
};
