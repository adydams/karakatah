import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaArrowRight } from "react-icons/fa";

type Product = {
  id: string;
  name: string;
  image?: string;
  price: string | number;
  category?: {
    name: string;
  };
  images?: Array<{ url: string }>;
};

type Props = {
  products: Product[];
  title: string;
};

export default function RecommendationBanner({ products, title }: Props) {
  const navigate = useNavigate();
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length]);

  if (!products || products.length === 0) return null;

  return (
    <div className="flex h-[280px] w-full max-w-none flex-col sm:h-[320px] lg:h-[calc(100vh-120px)] lg:max-w-[280px] lg:sticky lg:top-24">
      <div className="mb-4">
        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1 h-4 bg-orange-600 rounded-full" />
          {title}
        </h3>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div
          className="transition-transform duration-700 ease-in-out"
          style={{ transform: `translateY(-${scrollIndex * 96}px)` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="p-4 border-b border-gray-100 hover:bg-orange-50 transition-colors group cursor-pointer"
              onClick={() => navigate(`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}/${product.id}`)}
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                <img
                  src={product.image || product.images?.[0]?.url || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="w-64 h-64 max-w-[64px] rounded-lg object-cover border border-gray-100 shadow-sm group-hover:scale-105 transition-transform"
                />
                  <span className="absolute bottom-1 left-1 rounded bg-orange-600 px-1.5 py-0.5 text-[10px] font-black text-white shadow">
                    ₦{typeof product.price === "number" ? product.price.toLocaleString() : product.price}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{product.category?.name || "Product"}</p>
                </div>
                <FaArrowRight size={10} className="text-gray-300 group-hover:text-orange-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
