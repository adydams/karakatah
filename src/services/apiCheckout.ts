import { ROOT_URL } from "./apiAuth";

type OrderProp = {
  shippindAddressId: string;
  phone: string;
  notes: string;
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

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  const data = await response.json();

  return data;
}
