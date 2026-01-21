import { ROOT_URL } from "./apiAuth";
import type {
  CategoriesResponse,
  ProductResponse,
  ProductsResponse,
} from "./serviceTypes";
// import type { Product } from "./serviceTypes";

export async function getProducts(): Promise<ProductsResponse> {
  const response = await fetch(`${ROOT_URL}/api/products`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.detail || data?.error || "Failed to get products",
    );
  }

  return data;
}

export async function getProduct(id: string): Promise<ProductResponse> {
  const response = await fetch(`${ROOT_URL}/api/products/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.detail ||
        data?.error ||
        "Failed to get the product, You sure it exist?",
    );
  }

  return data;
}

// Categories
export async function getCategories(): Promise<CategoriesResponse> {
  const response = await fetch(`${ROOT_URL}/api/categories`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.detail ||
        data?.error ||
        "Failed to get categories",
    );
  }

  return data;
}
