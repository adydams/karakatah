import type {
  BrandItem,
  categoryItem,
  ProductPayload,
  SubCategoryItem,
} from "../../libs/types";
import { ROOT_URL } from "./apiAuth";

export async function createCategory(
  { name, description, image }: categoryItem,
  token: string | null,
) {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("description", description);
  formData.append("image", image); // ✅ real file

  const response = await fetch(`${ROOT_URL}/api/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ DO NOT set Content-Type
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.detail || data?.error || "Something went wrong",
    );
  }

  return data;
}

export async function getCategories() {
  const response = await fetch(`${ROOT_URL}/api/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // Extract backend-designed error message
    throw new Error(
      data?.message || data?.detail || data?.error || "Something went wrong",
    );
  }

  return data;
}

export async function deleteCategories({
  id,
  token,
}: {
  id: string;
  token: string;
}) {
  const response = await fetch(`${ROOT_URL}/api/categories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorisation: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // Extract backend-designed error message
    throw new Error(
      data?.message || data?.detail || data?.error || "Something went wrong",
    );
  }

  return data;
}

export async function createSubCategory(
  { categoryId, name, description }: SubCategoryItem,
  token: string,
) {
  const response = await fetch(`${ROOT_URL}/api/subcategories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ categoryId, name, description }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Extract backend-designed error message
    throw new Error(
      data?.message || data?.detail || data?.error || "Something went wrong",
    );
  }

  return data;
}

export async function getSubCategories() {
  const response = await fetch(`${ROOT_URL}/api/subcategories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // Extract backend-designed error message
    throw new Error(
      data?.message || data?.detail || data?.error || "Something went wrong",
    );
  }

  return data;
}

export async function createBrand(
  { name, description, logo }: BrandItem,
  token: string,
) {
  const response = await fetch(`${ROOT_URL}/api/brands`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ logo, name, description }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Extract backend-designed error message
    throw new Error(
      data?.message || data?.detail || data?.error || "Something went wrong",
    );
  }

  return data;
}

export async function getBrands() {
  const response = await fetch(`${ROOT_URL}/api/brands`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // Extract backend-designed error message
    throw new Error(
      data?.message || data?.detail || data?.error || "Something went wrong",
    );
  }

  return data;
}

export async function getProducts() {
  const response = await fetch(`${ROOT_URL}/api/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // Extract backend-designed error message
    throw new Error(
      data?.message || data?.detail || data?.error || "Something went wrong",
    );
  }

  return data;
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
    images,
  }: ProductPayload,
  token: string | null,
) {
  const formData = new FormData();

  // Text fields
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("stockQuantity", stockQuantity);
  formData.append("categoryId", categoryId);
  formData.append("subCategoryId", subCategoryId);
  formData.append("brandId", brandId);

  // Multiple images
  images.forEach((file: File) => {
    formData.append("images", file);
  });

  const response = await fetch(`${ROOT_URL}/api/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ DO NOT set Content-Type when sending FormData
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.detail ||
        data?.error ||
        "Failed to create product",
    );
  }

  return data;
}
