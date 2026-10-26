import React from "react";
import { formatPrice } from "../utils/utils";
import type { CheckoutQuote } from "../services/apiOrders";

type OrderSummaryProps = {
  items: any[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  discountLabel: string;
  isDiscountLoading: boolean;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  isSubmitting: boolean;
  gatewayTotal?: number | null;
  serverQuote?: CheckoutQuote | null;
  onSubmit: () => void;
};

export default function OrderSummarySidebar({
  items,
  subtotal,
  shippingFee,
  discountAmount,
  discountLabel,
  isDiscountLoading,
  discountCode,
  setDiscountCode,
  isSubmitting,
  gatewayTotal,
  serverQuote,
  onSubmit,
}: OrderSummaryProps) {
  const totalAmount = subtotal + shippingFee - discountAmount;
  const displayedTotal = gatewayTotal ?? (serverQuote?.totalAmount ?? totalAmount);

  return (
    <div className="h-fit w-full rounded-lg bg-white px-4 py-4 shadow-sm border border-gray-100">
      <h2 className="border-b border-gray-100 pb-3 text-base font-semibold uppercase tracking-wide">
        Order Summary
      </h2>
      <div className="mt-3 flex flex-col gap-3">
        {items.length ? (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm text-gray-600">
              <span className="truncate mr-2">
                {item.product?.name} × {item.quantity}
              </span>
              <div className="flex flex-col items-end">
                {item.product?.isDiscounted && (
                  <span className="text-[10px] text-slate-400 line-through">
                    ₦{formatPrice(Number(item.product?.price || 0) * Number(item.quantity || 0))}
                  </span>
                )}
                <span className="font-semibold text-gray-800 whitespace-nowrap">
                  ₦{formatPrice(Number(item.product?.currentPrice || item.product?.price || 0) * Number(item.quantity || 0))}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Your cart is empty.</p>
        )}
      </div>

      <div className="border-t border-gray-100 mt-4 flex items-center justify-between py-3 text-sm">
        <p className="text-gray-600">Items subtotal</p>
        <p className="font-primary text-base font-semibold">
          ₦{formatPrice(subtotal)}
        </p>
      </div>

      <div className="flex flex-col gap-3 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
            placeholder="Enter promo code"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs focus:ring-orange focus:border-orange outline-none"
          />
          <div className="relative h-8 w-16 flex items-center justify-center">
            {isDiscountLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <div className="h-3 w-3 border-2 border-orange border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <button
              onClick={() => setDiscountCode(discountCode)}
              className="w-full h-full bg-gray-100 text-gray-600 text-[10px] font-bold rounded-lg hover:bg-gray-200 transition"
            >
              Apply
            </button>
          </div>
        </div>
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-green-600 font-medium">{discountLabel}</span>
            <span className="text-green-600 font-bold">- ₦{formatPrice(discountAmount)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-b border-gray-100 py-3 text-sm">
        <p className="text-gray-600">Delivery fees</p>
        <p className="font-primary text-base font-semibold">
          ₦{formatPrice(shippingFee)}
        </p>
      </div>

      {serverQuote && Number(serverQuote.vatAmount) > 0 && (
        <div className="flex items-center justify-between border-b border-gray-100 py-3 text-sm">
          <p className="text-gray-600">VAT ({Number(serverQuote.vatPercentage)}%)</p>
          <p className="font-primary text-base font-semibold">
            ₦{formatPrice(Number(serverQuote.vatAmount))}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between py-3 font-medium">
        <p className="text-gray-800">
          {gatewayTotal === undefined || gatewayTotal === null
            ? serverQuote
              ? "Payment total"
              : "Estimated total"
            : "Payment total"}
        </p>
        <p className="font-primary text-orange text-lg font-bold">
          ₦{formatPrice(displayedTotal)}
        </p>
      </div>
      {gatewayTotal === undefined || gatewayTotal === null ? (
        <p className="text-xs leading-relaxed text-gray-500">
          {serverQuote
            ? "Final amount as calculated by the server, including delivery fees, discounts, and VAT."
            : "Final payment includes server-calculated pickup or delivery fees, applicable discounts, and VAT."}
        </p>
      ) : (
        <p className="text-xs leading-relaxed text-green-700">
          This is the amount sent to the payment gateway.
        </p>
      )}

      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="bg-muted-green hover:bg-orange font-primary mt-4 w-full cursor-pointer rounded-lg py-3 font-semibold text-white transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Processing..." : "Place order"}
      </button>
    </div>
  );
}
