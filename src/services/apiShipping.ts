import axiosInstance from "./apiClient";

type AddressProp = {
  line1: string;
  line2?: string | undefined;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export async function createShippingAddress(address: AddressProp) {
  const response = await axiosInstance.post(`/api/addresses`, address);
  return response.data;
}

export async function getShippingAddress() {
  const response = await axiosInstance.get(`/api/addresses`);
  return response.data;
}
