import React from "react";
import { formatPrice } from "../utils/utils";

type OrderSummaryProps = {
  items: any[];
  subtotal: number;
  shippingFee: number;
  isSubmitting: boolean;
  onSubmit: () => void;
};

export default function OrderSummarySidebar({
  items,
  subtotal,
  shippingFee,
  isSubmitting,
  onSubmit,
}: OrderSummaryProps) {
  const totalAmount = subtotal + shippingFee;

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
              <span className="font-semibold text-gray-800 whitespace-nowrap">
                ₦{formatPrice(Number(item.product?.price || 0) * Number(item.quantity || 0))}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Your cart is empty.</p>
        )}
      </div>

      <div className="border-t border-gray-100 mt-4 flex items-center justify-between py-3 text-sm">
        <p className="text-gray-600">Items total</p>
        <p className="font-primary text-base font-semibold">
          ₦{formatPrice(subtotal)}
        </p>
      </div>

      <div className="flex items-center justify-between border-b border-gray-100 py-3 text-sm">
        <p className="text-gray-600">Delivery fees</p>
        <p className="font-primary text-base font-semibold">
          ₦{formatPrice(shippingFee)}
        </p>
      </div>

      <div className="flex items-center justify-between py-3 font-medium">
        <p className="text-gray-800">Total</p>
        <p className="font-primary text-orange text-lg font-bold">
          ₦{formatPrice(totalAmount)}
        </p>
      </div>

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
