import axiosInstance from "./apiClient";

export const getProfile = async () => {
  const response = await axiosInstance.get("/api/users/me");
  return response.data;
};

export const updateProfile = async (data: Record<string, unknown>) => {
  const response = await axiosInstance.put("/api/users/me", data);
  return response.data;
};

export const getActivity = async () => {
  const response = await axiosInstance.get("/api/users/me/activity");
  return response.data;
};
