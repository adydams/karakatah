import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type Discount = {
  id: string;
  title: string;
  code: string;
  type: "PERCENTAGE" | "FLAT";
  value: string | number;
  advertStartDate?: string | null;
  advertEndDate?: string | null;
};

type Product = {
  id: string;
  name: string;
  images?: Array<{ url: string }>;
  price?: number | string;
  currentPrice?: number | string;
  originalPrice?: number | string;
  discountPercent?: number;
};

type Props = {
  discounts: Discount[];
  products: Product[];
};

export default function LandingAdvertCarousel({ discounts, products }: Props) {
  const navigate = useNavigate();
  const [discountIndex, setDiscountIndex] = useState(0);
  const [productIndex, setProductIndex] = useState(0);

  useEffect(() => {
    if (discounts.length < 2) return;
    const timer = window.setInterval(() => {
      setDiscountIndex((index) => (index + 1) % discounts.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [discounts.length]);

  useEffect(() => {
    if (products.length < 2) return;
    const timer = window.setInterval(() => {
      setProductIndex((index) => (index + 1) % products.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [products.length]);

  const discount = discounts[discountIndex];
  const product = products[productIndex];
  const money = (value?: number | string) => `₦${Number(value || 0).toLocaleString()}`;

  return (
    <>
      <div className="relative h-[200px] w-[50%] overflow-hidden rounded-xl bg-gradient-to-br from-orange-600 to-amber-400 p-5 text-white shadow-md lg:h-[50%] lg:w-full">
        {discount ? (
          <>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-100">Flash sale</p>
            <h3 className="mt-2 line-clamp-2 text-xl font-black">{discount.title}</h3>
            <p className="mt-2 text-2xl font-black">
              {discount.type === "PERCENTAGE" ? `${discount.value}% OFF` : `${money(discount.value)} OFF`}
            </p>
            <p className="mt-2 text-[10px] font-semibold text-orange-50">
              {discount.advertStartDate && new Date(discount.advertStartDate) > new Date()
                ? `Starts ${new Date(discount.advertStartDate).toLocaleDateString()}`
                : "Available now"}
            </p>
          </>
        ) : product ? (
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => navigate(`/products/${product.name.toLowerCase().replace(/\s+/g, "-")}/${product.id}`)}
          >
            <img
              src={product.images?.[0]?.url || "/placeholder-product.jpg"}
              alt={product.name}
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-200">Top products</p>
              <p className="mt-1 truncate text-lg font-black">{product.name}</p>
              <p className="text-xl font-black text-orange-200">
                {money(product.currentPrice || product.originalPrice || product.price)}
              </p>
            </div>
          </div>
        ) : null}
        {discounts.length > 1 && <span className="absolute bottom-3 right-4 text-xs font-bold">{discountIndex + 1}/{discounts.length}</span>}
      </div>

      <div
        className="relative h-[200px] w-[50%] cursor-pointer overflow-hidden rounded-xl bg-slate-900 lg:h-[50%] lg:w-full"
        onClick={() => product && navigate(`/products/${product.name.toLowerCase().replace(/\s+/g, "-")}/${product.id}`)}
      >
        {product ? (
          <>
            <img src={product.images?.[0]?.url || "/placeholder-product.jpg"} alt={product.name} className="h-full w-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-300">Explore more</p>
              <p className="truncate text-sm font-black">{product.name}</p>
              <p className="text-lg font-black text-orange-300">
                {money(product.currentPrice || product.originalPrice || product.price)}
              </p>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-bold text-white">Explore more</div>
        )}
      </div>
    </>
  );
}
