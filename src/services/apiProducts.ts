import { ROOT_URL } from "./apiAuth";
import type { ProductsResponse } from "./serviceTypes";
// import type { Product } from "./serviceTypes";

export async function getProducts(): Promise<ProductsResponse> {
  const response = await fetch(`${ROOT_URL}/api/products`);

  if (!response.ok) {
    throw new Error("Failed to get the products");
  }

  const data = await response.json();

  return data;
  //   console.log("This is the data", data);
}

export async function getProduct(id: string): Promise<ProductsResponse> {
  const response = await fetch(`${ROOT_URL}/api/products/${id}`);

  if (!response.ok) {
    throw new Error("Failed to get the product");
  }

  const data = await response.json();

  return data;
  //   console.log("This is the data", data);
}
