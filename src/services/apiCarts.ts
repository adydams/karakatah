import { ROOT_URL } from "./apiAuth";

export async function createCart() {
  const response = await fetch(`${ROOT_URL}/api/carts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create a cart");
  }

  const data = await response.json();

  return data;
}

export async function deleteCart(id: string) {
  const response = await fetch(`${ROOT_URL}/api/carts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create a cart");
  }

  const data = await response.json();

  return data;
}

export async function getCart(id: string) {
  const response = await fetch(`${ROOT_URL}/api/carts/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch cart");
  }

  const data = await response.json();

  return data;
}
