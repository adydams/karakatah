import type {
  BrandItem,
  categoryItem,
  ProductPayload,
  SubCategoryItem,
} from "../../libs/types";
import axiosInstance from "../apiClient";

export async function createCategory({ name, description, image }: categoryItem) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("image", image);

  const response = await axiosInstance.post(`/api/categories`, formData);
  return response.data;
}

export async function getCategories() {
  const response = await axiosInstance.get(`/api/categories`);
  return response.data;
}

export async function deleteCategories({ id }: { id: string }) {
  const response = await axiosInstance.delete(`/api/categories/${id}`);
  return response.data;
}

export async function createSubCategory({ categoryId, name, description }: SubCategoryItem) {
  const response = await axiosInstance.post(`/api/subcategories`, { categoryId, name, description });
  return response.data;
}

export async function getSubCategories() {
  const response = await axiosInstance.get(`/api/subcategories`);
  return response.data;
}

export async function createBrand({ name, description, logo }: BrandItem) {
  const response = await axiosInstance.post(`/api/brands`, { logo, name, description });
  return response.data;
}

export async function getBrands() {
  const response = await axiosInstance.get(`/api/brands`);
  return response.data;
}

export async function getProducts() {
  const response = await axiosInstance.get(`/api/products`);
  return response.data;
}

export async function getProductById(id: string) {
  const response = await axiosInstance.get(`/api/products/${id}`);
  return response.data;
}

export async function createProduct(
  {
    name,
    description,
    price,
    stockQuantity,
    categoryId,
    subCategoryId,
    brandId,
    weightKg,
    lengthCm,
    widthCm,
    heightCm,
    images,
    isPublished,
    draft,
  }: ProductPayload & { isPublished?: boolean; draft?: boolean },
) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", String(price));
  formData.append("stockQuantity", String(stockQuantity));
  formData.append("categoryId", categoryId);
  formData.append("subCategoryId", subCategoryId);
  formData.append("brandId", brandId);
  if (weightKg !== undefined) formData.append("weightKg", String(weightKg));
  if (lengthCm !== undefined) formData.append("lengthCm", String(lengthCm));
  if (widthCm !== undefined) formData.append("widthCm", String(widthCm));
  if (heightCm !== undefined) formData.append("heightCm", String(heightCm));
  if (isPublished !== undefined) formData.append("isPublished", String(isPublished));
  if (draft !== undefined) formData.append("draft", String(draft));
  images.forEach((file: File) => formData.append("images", file));

  const response = await axiosInstance.post(`/api/products`, formData);
  return response.data;
}

export async function updateProduct(
  id: string,
  payload: Partial<ProductPayload> & { images?: File[]; removedImageIds?: string[] }
) {
  const formData = new FormData();
  if (payload.name) formData.append("name", payload.name);
  if (payload.description) formData.append("description", payload.description);
  if (payload.price !== undefined) formData.append("price", String(payload.price));
  if (payload.stockQuantity !== undefined) formData.append("stockQuantity", String(payload.stockQuantity));
  if (payload.categoryId) formData.append("categoryId", payload.categoryId);
  if (payload.subCategoryId) formData.append("subCategoryId", payload.subCategoryId);
  if (payload.brandId) formData.append("brandId", payload.brandId);
  if (payload.weightKg !== undefined) formData.append("weightKg", String(payload.weightKg));
  if (payload.lengthCm !== undefined) formData.append("lengthCm", String(payload.lengthCm));
  if (payload.widthCm !== undefined) formData.append("widthCm", String(payload.widthCm));
  if (payload.heightCm !== undefined) formData.append("heightCm", String(payload.heightCm));
  if (payload.removedImageIds && payload.removedImageIds.length > 0) {
    for (const idToRemove of payload.removedImageIds) {
      formData.append("removedImageIds[]", idToRemove);
    }
  }
  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((file: File) => formData.append("images", file));
  }

  const response = await axiosInstance.put(`/api/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteProduct(id: string) {
  const response = await axiosInstance.delete(`/api/products/${id}`);
  return response.data;
}
