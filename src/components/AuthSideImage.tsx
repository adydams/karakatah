import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/apiProducts";

export default function AuthSideImage({ className }: { className?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["authSideProducts"],
    queryFn: getProducts,
  });

  const products = data?.data || [];
  const randomProduct = products.length > 0
    ? products[Math.floor(Math.random() * products.length)]
    : null;

  if (isLoading || !randomProduct) {
    return (
      <div className={`bg-dark-gray flex items-center justify-center ${className}`}>
        <div className="animate-pulse h-full w-full bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <img
        src={randomProduct.images?.[0]?.url || "/placeholder.png"}
        alt={randomProduct.name}
        className="h-full w-full object-cover"
      />

      {/* Bottom Text Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
        <h2 className="text-3xl font-bold mb-2">Elevate Your Lifestyle.</h2>
        <p className="text-sm opacity-90 max-w-md">
          The ultimate multi-vendor marketplace for curated luxury and premium essentials.
        </p>
      </div>
    </div>
  );
}
