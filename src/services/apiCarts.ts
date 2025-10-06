import { getCartIdFromToken } from "../utils/utils";
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

export async function getCart() {
  const cartId = getCartIdFromToken();
  if (!cartId) throw new Error("No cartId in token");

  const response = await fetch(`${ROOT_URL}/api/carts/${cartId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch cart");

  return response.json();
}

export async function addItemToCart(
  name: string | undefined,
  productId: string | undefined,
  quantity: number = 1,
) {
  // Get the cartId
  const cartId = getCartIdFromToken();
  if (!cartId) throw new Error("No cartId in token");

  const response = await fetch(`${ROOT_URL}/api/cart-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      cartId: cartId,
      items: [
        {
          productId: productId,
          quantity: quantity,
          name: name,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to add items to cart");
  }

  const data = await response.json();

  return data;
}
