import type { GetAdminByIdResponse, LoginResponse } from "../../contexts/LoginContext";
import type { ApiLoginType } from "../../libs/types";
import axiosInstance from "../apiClient";

export async function AdminLogin({ email, password }: ApiLoginType): Promise<LoginResponse> {
  const response = await axiosInstance.post(`/api/admin/login`, { email, password });
  return response.data;
}

export async function getAdminById(
  id: string,
  token: string | null,
): Promise<GetAdminByIdResponse> {
  if (token) {
    const response = await axiosInstance.get(`/api/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  const response = await axiosInstance.get(`/api/admin/${id}`);
  return response.data;
}
