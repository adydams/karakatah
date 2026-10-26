import { z } from "zod";

export const sellarSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number").optional()
  ),
  // password: z.string().min(8, "Password must be at least 8 characters"),
});

export type TsellarSchema = z.infer<typeof sellarSchema>;

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

export const checkoutSchema = z
  .object({
    shippingAddressId: z.string().optional().or(z.literal("")),
    shippingMethod: z
      .string()
      .refine((value) => ["pickup", "shipping"].includes(value), {
        message: "Select a delivery method",
      }),
    chosenHubId: z.string().optional().or(z.literal("")),
    phone: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((value) => !value || /^\+?[0-9]{7,15}$/.test(value), "Enter a valid phone number"),
    notes: z.string().optional().or(z.literal("")),
    gateway: z
      .string()
      .refine((value) => ["paystack", "flutterwave", "paypal"].includes(value), {
        message: "Invalid payment gateway",
      }),
  })
  .superRefine((values, ctx) => {
    if (values.shippingMethod === "shipping" && !values.shippingAddressId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["shippingAddressId"],
        message: "Shipping address is required",
      });
    }

    if (values.shippingMethod === "pickup" && !values.chosenHubId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["chosenHubId"],
        message: "Pickup hub is required",
      });
    }
  });

export type TCheckoutSchema = z.infer<typeof checkoutSchema>;

// Shipping Address form

export const shippingAddressSchema = z.object({
  line1: z
    .string()
    .min(3, "Street address is required")
    .max(200, "Street address is too long"),

  line2: z
    .string()
    .max(200, "Bus-Stop is too long")
    .optional()
    .or(z.literal("")), // allows empty string

  city: z.string().min(2, "City is required").max(50, "City name is too long"),

  state: z
    .string()
    .min(2, "State is required")
    .max(50, "State name is too long"),

  country: z
    .string()
    .min(2, "Country is required")
    .max(50, "Country name is too long"),

  postalCode: z
    .string()
    .min(3, "Postal code is required")
    .max(12, "Postal code is too long")
    .regex(/^[a-zA-Z0-9\- ]+$/, "Invalid postal code format"),

  // Optional coordinates captured by a map picker or device geolocation
  latitude: z.union([z.number(), z.string()]).optional(),
  longitude: z.union([z.number(), z.string()]).optional(),
});

export type ShippingAddressFormValues = z.infer<typeof shippingAddressSchema>;
