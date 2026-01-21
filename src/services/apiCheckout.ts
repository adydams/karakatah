import { ROOT_URL } from "./apiAuth";

type OrderProp = {
  shippingAddressId: string;
  phone: string;
  notes: string | undefined;
  gateway: string;
};

export async function createOrder(order: OrderProp) {
  const response = await fetch(`${ROOT_URL}/api/orders/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(order),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.detail || data?.error || "Failed to create order",
    );
  }

  return data;
}
