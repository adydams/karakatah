import { useQuery } from "@tanstack/react-query";
import Navbar from "../Navbar";
import { getAdvertisedDiscounts } from "../../services/apiProducts";

export default function CustomerChrome() {
  const { data } = useQuery({
    queryKey: ["customerAdvertisedDiscounts"],
    queryFn: getAdvertisedDiscounts,
    staleTime: 60000,
  });

  const discounts = data?.data || [];
  if (!discounts.length) return <Navbar />;

  return (
    <>
      <Navbar />
      <div className="flex w-full items-center gap-3 overflow-x-auto bg-orange-600 px-4 py-2 text-white no-scrollbar">
        <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.18em] text-orange-100">
          Live offers
        </span>
        {discounts.map((discount: { id: string; title: string; type: string; value: string | number }) => (
          <span key={discount.id} className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
            {discount.title} · {discount.type === "PERCENTAGE" ? `${discount.value}% OFF` : `₦${Number(discount.value).toLocaleString()} OFF`}
          </span>
        ))}
      </div>
    </>
  );
}
