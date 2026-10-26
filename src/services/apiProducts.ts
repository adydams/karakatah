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

export async function getFeaturedDiscounts(): Promise<ProductsResponse> {
  const response = await axiosInstance.get(`/api/products/featured-discounts`);
  return response.data;
}

export async function getAdvertisedDiscounts() {
  const response = await axiosInstance.get("/api/products/advertised-discounts");
  return response.data;
}

export async function getProduct(id: string): Promise<ProductResponse> {
  const response = await axiosInstance.get(`/api/products/${id}`);
  return response.data;
}

export async function getProductsByCategory(categoryId: string, limit = 10): Promise<ProductsResponse> {
  const response = await axiosInstance.get(`/api/products?categoryId=${categoryId}&limit=${limit}`);
  return response.data;
}

// Categories
export async function getCategories(): Promise<CategoriesResponse> {
  const response = await axiosInstance.get(`/api/categories`);
  return response.data;
}
