import React from "react";

type Discount = {
  id: string;
  title: string;
  type: "PERCENTAGE" | "FLAT";
  value: string | number;
  advertStartDate?: string | null;
  advertEndDate?: string | null;
};

type Props = {
  discounts: Discount[];
};

export default function FlashSaleBanner({ discounts }: Props) {
  if (!discounts.length) return null;

  const now = Date.now();
  const formatValue = (discount: Discount) =>
    discount.type === "PERCENTAGE" ? `${discount.value}% OFF` : `₦${Number(discount.value).toLocaleString()} OFF`;

  return (
    <section className="mb-4 overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 p-4 text-white shadow-lg">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-100">Flash sale</p>
          <h3 className="text-sm font-black">Deals happening now & soon</h3>
        </div>
        <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold">LIMITED TIME</span>
      </div>
      <div className="flex max-h-[calc(100vh-260px)] flex-col gap-2 overflow-y-auto pr-1">
        {discounts.map((discount) => {
          const upcoming = discount.advertStartDate && new Date(discount.advertStartDate).getTime() > now;
          return (
            <div key={discount.id} className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
              <p className="truncate text-xs font-black">{discount.title}</p>
              <p className="mt-1 text-lg font-black">{formatValue(discount)}</p>
              <p className="text-[10px] text-orange-50">
                {upcoming ? `Starts ${new Date(discount.advertStartDate as string).toLocaleDateString()}` : "Available now"}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
