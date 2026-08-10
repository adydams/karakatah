import axiosInstance from "./apiClient";
import type {
  CategoriesResponse,
  ProductResponse,
  ProductsResponse,
} from "./serviceTypes";
// import type { Product } from "./serviceTypes";

export async function getProducts(): Promise<ProductsResponse> {
  const response = await axiosInstance.get(`/api/products`);
  return response.data;
}

export async function getProduct(id: string): Promise<ProductResponse> {
  const response = await axiosInstance.get(`/api/products/${id}`);
  return response.data;
}

// Categories
export async function getCategories(): Promise<CategoriesResponse> {
  const response = await axiosInstance.get(`/api/categories`);
  return response.data;
}
