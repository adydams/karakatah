import axiosInstance from "../apiClient";

export const getCustomers = async (params: { name?: string; phone?: string; email?: string; page?: number; limit?: number }) => {
  const response = await axiosInstance.get("/api/admin/list", {
    params: {
      ...params,
      roleName: "Customer",
    },
  });
  return response.data;
};

export const getCustomerById = async (id: string) => {
  const response = await axiosInstance.get(`/api/admin/${id}`);
  return response.data;
};

export const updateCustomer = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/api/admin/${id}`, data);
  return response.data;
};

export const deleteCustomer = async (id: string) => {
  const response = await axiosInstance.delete(`/api/admin/${id}`);
  return response.data;
};
