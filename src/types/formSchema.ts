import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"), // supports intl format
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type TSignUpSchema = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type TLoginSchema = z.infer<typeof loginSchema>;



export const checkoutSchema = z.object({
  shippingAddressId: z.string().min(1, "Shipping address is required"),

  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"), // supports intl format

  notes: z.string().optional(),

  gateway: z
    .string()
    .refine((value) => ["paystack", "flutterwave", "paypal"].includes(value), {
      message: "Invalid payment gateway",
    }),
});

export type TCheckoutSchema = z.infer<typeof checkoutSchema>;
