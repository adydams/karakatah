import axiosInstance from "./apiClient";

type OrderProp = {
  shippingAddressId?: string;
  phone: string;
  notes?: string;
  gateway: string;
  shippingMethod: "pickup" | "shipping";
  chosenStationId?: string;
  requestToken?: string;
  serviceCode?: string;
  courierId?: string;
  shippingFee?: number;
  courierName?: string;
  deliveryEta?: string;
};

export async function createOrder(order: OrderProp) {
  const response = await axiosInstance.post(`/api/orders/checkout`, order);
  return response.data;
}

export async function getOrder(orderId: string) {
  const response = await axiosInstance.get(`/api/orders/${orderId}/invoice`);
  return response.data;
}
