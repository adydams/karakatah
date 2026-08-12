import { getCartIdFromToken } from "../utils/utils";
import axiosInstance from "./apiClient";

export async function createCart() {
  const response = await axiosInstance.post(`/api/carts`);
  return response.data;
}

export async function deleteCart(id: string) {
  const response = await axiosInstance.delete(`/api/carts/${id}`);
  return response.data;
}

export async function getCart() {
  const cartId = getCartIdFromToken();
  if (!cartId) throw new Error("No cartId in token");

  let response = await axiosInstance.get(`/api/carts/${cartId}`);

  // If there are items referencing deleted products, remove them client-side and refetch
  const cart = response.data; // { success, data: { items: [...] } }
  const items = cart?.data?.items || [];
  const missing = items.filter((it: any) => !it.product).map((i: any) => i.id);

  if (missing.length > 0) {
    // delete each invalid cart item
    await Promise.all(missing.map((id: string) => axiosInstance.delete(`/api/cart-items/${id}`)));
    // refetch the cart
    response = await axiosInstance.get(`/api/carts/${cartId}`);
  }

  return response.data;
}

export async function addItemToCart(
  name: string | undefined,
  productId: string | undefined,
  quantity: number = 1,
) {
  const cartId = getCartIdFromToken();
  if (!cartId) throw new Error("No cartId in token");

  const response = await axiosInstance.post(`/api/cart-items`, {
    cartId,
    items: [
      {
        productId,
        quantity,
        name,
      },
    ],
  });

  return response.data;
}

export async function updateItemQuantity(id: string, quantity: string | number) {
  const cartId = getCartIdFromToken();
  if (!cartId) throw new Error("No cartId in token");

  const response = await axiosInstance.patch(`/api/cart-items/${id}`, {
    cartId,
    quantity,
  });

  return response.data;
}

export async function deleteItemCart(id: string) {
  const cartId = getCartIdFromToken();
  if (!cartId) throw new Error("No cartId in token");

  const response = await axiosInstance.delete(`/api/cart-items/${id}`);
  return response.data;
}
