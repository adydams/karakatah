import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),

  image: z
    .instanceof(File, {
      message: "Display picture is required",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
          file.type,
        ),
      {
        message: "Only JPG, PNG or GIF images are allowed",
      },
    )
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "Image size must be less than 2MB",
    }),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must not exceed 100 characters"),

  description: z.string().min(10, "Description must be at least 10 characters"),

  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),

  stockQuantity: z
    .string()
    .regex(/^\d+$/, "Stock quantity must be a valid integer"),

  categoryId: z.string().uuid("Invalid category ID"),

  subCategoryId: z.string().uuid("Invalid sub-category ID"),

  brandId: z.string().uuid("Invalid brand ID").optional().or(z.literal("")),

  storeId: z.string().uuid("Invalid store ID").optional(),

  logisticsCategoryId: z.string().optional(),
  boxSizeId: z.string().optional(),

  images: z
    .array(z.instanceof(File))
    .min(1, "At least one product image is required"),
});

export const productEditSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must not exceed 100 characters"),

  description: z.string().min(10, "Description must be at least 10 characters"),

  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),

  stockQuantity: z
    .string()
    .regex(/^\d+$/, "Stock quantity must be a valid integer"),

  categoryId: z.string().uuid("Invalid category ID"),

  subCategoryId: z.string().uuid("Invalid sub-category ID"),

  brandId: z.string().uuid("Invalid brand ID").optional().or(z.literal("")),

  storeId: z.string().uuid("Invalid store ID").optional(),

  logisticsCategoryId: z.string().optional(),
  boxSizeId: z.string().optional(),

  images: z.array(z.instanceof(File)).optional().default([]),
});

export type TProductSchema = z.infer<typeof productSchema>;
export type TProductEditSchema = z.infer<typeof productEditSchema>;

// export const productSchema = z.object({
//   name: z
//     .string()
//     .min(2, "Product name must be at least 2 characters")
//     .max(100, "Product name must not exceed 100 characters"),

//   description: z
//     .string()
//     .min(10, "Description must be at least 10 characters"),

//   price: z
//     .number()
//     .positive("Price must be greater than 0"),

//   stockQuantity: z
//     .number()
//     .int("Stock quantity must be an integer")
//     .nonnegative("Stock quantity cannot be negative"),

//   categoryId: z
//     .string()
//     .uuid("Invalid category ID"),

//   subCategoryId: z
//     .string()
//     .uuid("Invalid sub-category ID"),

//   brandId: z
//     .string()
//     .uuid("Invalid brand ID"),

//   images: z
//     .array(z.string().url("Each image must be a valid URL"))
//     .min(1, "At least one product image is required"),
// });

// export type TProductSchema = z.infer<typeof productSchema>;

export type TCategorySchema = z.infer<typeof categorySchema>;
