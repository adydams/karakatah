import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaTimes } from "react-icons/fa";
import ImageSlider from "../components/ImageSlider";
import { getProduct } from "../services/apiProducts";
import { formatPrice } from "../utils/utils";
import ProductDetailsSkeleton from "../components/ProductDetailsSkeleton";
import ProductImagePulse from "../components/ProductImagePulse";
import { addItemToCart } from "../services/apiCarts";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { useModal } from "../contexts/hooks/useModal";

export default function ProductDetailModal({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  if (quantity < 0) {
    setQuantity(0);
  }

  const { isLoading: isGettingProduct, data: productData } = useQuery({
    queryKey: ["productDetail", productId],
    queryFn: () => getProduct(productId),
  });

  const product = productData?.data as any;
  const name = product?.name;

  // Frontend price calculation for tiered discounts
  const calculatePriceForQty = (qty: number) => {
    if (!product) return { price: 0, isDiscounted: false };
    const basePrice = parseFloat(product.price || 0);
    const discounts = product.discounts || [];
    const now = new Date();

    const matchingRules = discounts.filter((rule: any) => {
      const startDate = rule.startDate ? new Date(rule.startDate) : null;
      const endDate = rule.endDate ? new Date(rule.endDate) : null;
      const dateValid = (!startDate || now >= startDate) && (!endDate || now <= endDate);
      const qtyValid = qty >= rule.minQuantity && (!rule.maxQuantity || qty <= rule.maxQuantity);
      const active = rule.isActive !== false;
      return dateValid && qtyValid && active;
    });

    if (matchingRules.length === 0) {
      return { price: basePrice, isDiscounted: false };
    }

    let bestPrice = basePrice;
    for (const rule of matchingRules) {
      let currentPrice = basePrice;
      if (rule.discountType === 'PERCENTAGE') {
        currentPrice = basePrice - (basePrice * (parseFloat(rule.value) / 100));
      } else if (rule.discountType === 'FIXED') {
        currentPrice = basePrice - parseFloat(rule.value);
      }
      if (currentPrice < bestPrice) bestPrice = currentPrice;
    }

    return { price: Math.max(0, bestPrice), isDiscounted: true };
  };

  const { price: currentPrice, isDiscounted: hasDiscount } = calculatePriceForQty(quantity);

  type AddItemVariables = {
    productId: string | undefined;
    quantity: number;
    name: string | undefined;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name, productId, quantity }: AddItemVariables) =>
      addItemToCart(name, productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Product added to cart");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  function handleAddToCart() {
    mutate({ name, productId, quantity });
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full mx-auto overflow-hidden relative">
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
      >
        <FaTimes size={20} />
      </button>
      <div className="flex w-full flex-col items-center justify-center p-6 lg:flex-row lg:gap-14">
        {isGettingProduct ? (
          <ProductImagePulse />
        ) : (
          <div className="w-full max-w-md">
            <ImageSlider images={product?.images} />
          </div>
        )}
        {isGettingProduct ? (
          <ProductDetailsSkeleton />
        ) : (
          <div className="mt-6 flex flex-col items-start justify-start lg:mt-0 lg:h-auto lg:w-1/2 lg:p-3">
            <h1 className="font-primary text-2xl font-bold text-gray-800 lg:text-4xl">
              {product?.name}
            </h1>
            <p className="text-darkshade mt-4 text-sm leading-relaxed font-light">
              {product?.description}
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-darkshade text-sm leading-relaxed font-light">
                Availability:{" "}
                <span className="text-muted-green font-medium">In stock</span>
              </p>
              <p className="text-dark-gray text-sm leading-relaxed font-light">
                Color:{" "}
                <span className="text-muted-green font-medium">Orange</span>
              </p>
              <p className="text-dark-gray text-sm leading-relaxed font-light">
                Size:{" "}
                <span className="text-muted-green font-medium">Medium</span>
              </p>
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-2">
              {hasDiscount ? (
                <>
                  <h2 className="text-slate-400 text-xl line-through">
                    ₦{formatPrice(product?.price)}
                  </h2>
                  <h2 className="border-muted-green text-muted-green w-auto rounded-lg border-[1px] px-4 py-1 text-center font-bold lg:text-2xl">
                    ₦{formatPrice(currentPrice)}
                  </h2>
                </>
              ) : (
                <h2 className="border-muted-green text-muted-green mt-4 w-auto rounded-lg border-[1px] px-4 py-1 text-center font-bold lg:text-2xl">
                  ₦{formatPrice(product?.price)}
                </h2>
              )}
            </div>

            {product?.discounts && product.discounts.length > 0 && (
              <div className="mt-6 w-full">
                <h3 className="text-sm font-bold text-gray-800 mb-3">Bulk Discount Tiers</h3>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 font-semibold">
                      <tr>
                        <th className="px-3 py-2">Qty</th>
                        <th className="px-3 py-2">Discount</th>
                        <th className="px-3 py-2 text-right">Price/Unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {product.discounts.map((d: any, i: number) => {
                        const tierPrice = d.discountType === 'PERCENTAGE'
                          ? parseFloat(product.price) - (parseFloat(product.price) * (parseFloat(d.value) / 100))
                          : parseFloat(product.price) - parseFloat(d.value);

                        return (
                          <tr key={i} className={quantity >= d.minQuantity && (!d.maxQuantity || quantity <= d.maxQuantity) ? "bg-orange/10" : ""}>
                            <td className="px-3 py-2">{d.minQuantity}{d.maxQuantity ? `-${d.maxQuantity}` : `+`}</td>
                            <td className="px-3 py-2">{d.value}{d.discountType === 'PERCENTAGE' ? '%' : ' ₦'}</td>
                            <td className="px-3 py-2 text-right font-medium">₦{formatPrice(tierPrice)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-8 w-full">
              <div className="flex w-full items-center justify-center gap-4">
                <FaArrowAltCircleLeft
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  size={24}
                  className="cursor-pointer text-gray-600 hover:text-orange transition-colors"
                />
                <input
                  type="text"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(+e.target.value)}
                  className="w-[60px] text-center font-medium focus:outline-none text-lg"
                />
                <FaArrowAltCircleRight
                  onClick={() => setQuantity((prev) => prev + 1)}
                  size={24}
                  className="cursor-pointer text-gray-600 hover:text-orange transition-colors"
                />
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-orange mt-6 w-full max-w-[200px] mx-auto flex items-center justify-center cursor-pointer rounded-md px-5 py-3 text-sm font-bold text-white transition hover:bg-orange/90 shadow-lg shadow-orange/20"
              >
                {isPending ? <Spinner size="small" /> : "ADD TO CART"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
