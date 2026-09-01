import axiosInstance from "../apiClient";
import type { CategoriesResponse } from "../serviceTypes";
import type { categoryItem } from "../../libs/types";

export async function getCategories(): Promise<CategoriesResponse> {
  const response = await axiosInstance.get(`/api/categories`);
  return response.data;
}

export async function createCategory({ name, description, image }: categoryItem) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("image", image);

  const response = await axiosInstance.post(`/api/categories`, formData);
  return response.data;
}

export async function deleteCategory({ id }: { id: string }) {
  const response = await axiosInstance.delete(`/api/categories/${id}`);
  return response.data;
}

export async function updateCategoryStatus(id: string, status: string) {
  const response = await axiosInstance.patch(`/api/categories/${id}/status`, { status });
  return response.data;
}
