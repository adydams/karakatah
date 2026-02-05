import { ROOT_URL } from "./apiAuth";

type AddressProp = {
  line1: string;
  line2?: string | undefined;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export async function createShippingAddress(address: AddressProp) {
  const response = await fetch(`${ROOT_URL}/api/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(address),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.detail || data?.error || "Failed to create order",
    );
  }

  return data;
}

export async function getShippingAddress() {
  const response = await fetch(`${ROOT_URL}/api/addresses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.detail || data?.error || "Failed to create order",
    );
  }

  return data;
}
