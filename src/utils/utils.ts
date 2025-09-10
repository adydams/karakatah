export function formatPrice(
  price: string | number,
  locale = "en-NG",
  currency?: string,
): string {
  const number = typeof price === "string" ? parseFloat(price) : price;

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
