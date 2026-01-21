import { jwtDecode } from "jwt-decode";

type MyJwtPayload = {
  id: string;
  role: string;
  cartId: string;
  iat: number;
  exp: number;
};

export function getCartIdFromToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<MyJwtPayload>(token);
    return decoded.cartId ?? null;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

// export function getCartIdFromToken(): string | null {
//   const token = localStorage.getItem("token");
//   if (!token) return null;

//   try {
//     const decoded = jwtDecode<MyJwtPayload>(token);

//     if (decoded) {
//       console.log("this is the cartId", decoded);

//       return decoded.cartId;
//     }

//     return decoded.cartId ?? null;
//     // return decoded.cartId ?? null;
//   } catch (err) {
//     console.error("Invalid token", err);
//     return null;
//   }
// }

export function formatPrice(
  price?: string | number, // allow undefined
  locale = "en-NG",
  currency?: string,
): string {
  // handle undefined or invalid price
  if (price == null || price === "") return "0.00";

  const number = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(number)) return "0.00";

  // Without currency → just formatted number (e.g., 35,000.00)
  if (!currency) {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  }

  // With currency → formatted with currency symbol (e.g., ₦35,000.00)
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(number);
}

export function shortenText(text: string, maxLength = 12): string {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
}
