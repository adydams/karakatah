export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  public_id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type SubCategory = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: string; // comes as string ("350000.00")
  currentPrice?: string;
  isDiscounted?: boolean;
  stockQuantity: number;
  categoryId: string;
  storeId: string | null;
  subCategoryId: string;
  brandId: string;
  qrCode: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  brand: string | null;
  subcategory: SubCategory;
  store: string | null;
  images: ProductImage[];
};

export type ProductsResponse = {
  success: boolean;
  data: Product[];
};
export type ProductResponse = {
  success: boolean;
  data: Product;
};

// export type SubCategory = {
//   id: string;
//   categoryId: string;
//   name: string;
//   description: string;
//   isDeleted: boolean;
//   createdAt: string;   // ISO date string
//   updatedAt: string;   // ISO date string
// };

export type Category = {
  id: string;
  name: string;
  description: string;
  dateAdded: string; // ISO date string
  dateModified: string; // ISO date string
  isDeleted: boolean;
  subCategories: SubCategory[];
};

export type CategoriesResponse = {
  success: boolean;
  data: Category[];
};
