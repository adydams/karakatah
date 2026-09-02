import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { GoHeartFill } from "react-icons/go";
import { FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import type { ProductProp } from "../types/type";
import { useNavigate } from "react-router";
import { addItemToCart } from "../services/apiCarts";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { optimizeImage } from "../utils/imageUtils";
import { useModal } from "../contexts/hooks/useModal";
import ProductDetailModal from "./ProductDetailModal";
import { useUser } from "../contexts/hooks/useUser";

type AddItemVariables = {
  productId: string;
  name: string;
};

export default function ProductCard({ id, image, name, price, isDiscounted, currentPrice, discounts }: ProductProp & { discounts?: any[] }) {
  const [addWish, setAddWish] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate the absolute best price available across all tiers
  const getBestPrice = () => {
    if (!discounts || discounts.length === 0) return null;

    const basePrice = Number(price ?? 0);
    let minPrice = basePrice;

    discounts.forEach((rule: any) => {
      let rulePrice = basePrice;
      if (rule.discountType === "PERCENTAGE") {
        rulePrice = basePrice - basePrice * (Number(rule.value ?? 0) / 100);
      } else if (rule.discountType === "FIXED") {
        rulePrice = basePrice - Number(rule.value ?? 0);
      }
      if (rulePrice < minPrice) minPrice = rulePrice;
    });

    return minPrice < basePrice ? minPrice : null;
  };

  const getBestRuleTeaser = () => {
    if (!discounts || discounts.length === 0) return null;

    const basePrice = Number(price ?? 0);
    let bestRule: { discountType?: string; value?: number | string; minQuantity?: number } | null = null;
    let minPrice = basePrice;

    discounts.forEach((rule: any) => {
      let rulePrice = basePrice;
      if (rule.discountType === "PERCENTAGE") {
        rulePrice = basePrice - basePrice * (Number(rule.value ?? 0) / 100);
      } else if (rule.discountType === "FIXED") {
        rulePrice = basePrice - Number(rule.value ?? 0);
      }
      if (rulePrice < minPrice) {
        minPrice = rulePrice;
        bestRule = rule;
      }
    });

    if (!bestRule) return null;

    const bestRuleAny = bestRule as any;
    const valueStr = bestRuleAny.discountType === "PERCENTAGE"
      ? `${bestRuleAny.value}% off`
      : `₦${bestRuleAny.value} off`;

    return `Buy ${bestRuleAny.minQuantity ?? 1}+ get ${valueStr}`;
  };

  const bestPrice = getBestPrice();
  const discountTeaser = getBestRuleTeaser();

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { openModal } = useModal();

  const { user } = useUser(); // Assuming useUser hook provides the user object

  const { mutate, isPending: isAddingToCart } = useMutation({
    mutationFn: ({ name, productId }: AddItemVariables) =>
      addItemToCart(name, productId),

    onSuccess: () => {
      toast.success("Product added to cart");
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },

    onError: (err: Error) => {
      if (err.message.toLocaleLowerCase().includes("no cartid")) {
        navigate("/login");
        toast.error("Create an account or Log In to start your shopping cart.");
      }
    },
  });

  function handleAddToCart() {
    if (user && ["SuperAdmin", "SystemAdmin", "Admin"].includes(user.role)) {
      return; // Do nothing for admins
    }
    mutate({ name, productId: id });
  }

  function handleWish() {
    setAddWish((prev) => !prev);
  }

  function handleViewMore() {
    openModal(<ProductDetailModal productId={id} />);
  }

  return (
    <div className="group relative h-[480px] w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-orange-200, justify-betweeen ">
      {/* Image Section */}
      <div className="relative h-[350px] w-full overflow-hidden">
        {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-gray-100" />}

        <button
          type="button"
          onClick={handleViewMore}
          className="block h-full w-full overflow-hidden transition-transform duration-500 group-hover:scale-105"
          aria-label={`View details for ${name}`}
        >
          <img
            src={optimizeImage(image || "", 500, 500)}
            alt={name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        <div className="absolute left-2 top-2 flex flex gap-1 z-10">
          {discountTeaser && (
            <div className="rounded-md bg-orange-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
              {discountTeaser}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex h-[170px] w-full flex-col  ">
        <div className="flex justify-between">
          <div className="ml-2 mt-2 mb-2">
          <h2
            title={name}
            className="h-10 font-primary text-xl font-semibold text-gray-800 line-clamp-2 leading-tight"
          >
            {name}
          </h2>

          <div className="flex items-center gap-1.5  ">
            <div className="flex items-center text-amber-400 ">
              <FaStar size={14} /><FaStar size={14} /> <FaStar size={14} />  <FaStar size={14} /> <FaStar size={14}  />
              <span className="ml-1 text-[18px] font-bold text-gray-600 ">4.8</span>
            </div>
            <span className="text-[15px] text-gray-500 ml-2">• 1.2k+ sold</span>
          </div>

          <div className="mt-2 flex items-baseline gap-2 ">
            {isDiscounted ? (
              <>
                <span className="font-primary text-2xl font-extrabold text-orange-600">₦{currentPrice}</span>
                <span className="text-sm font-medium text-gray-400 line-through">₦{price}</span>
              </>
            ) : (
              <span className="font-primary text-2xl font-extrabold text-gray-900">₦{price}</span>
            )}
          </div>

          {bestPrice && (
            <div className="mt-0.5 flex items-center gap-1">
              <span className="text-[9px] font-bold uppercase text-gray-400">Best Offer:</span>
              <span className="text-[12px] font-bold text-green-600">₦{bestPrice.toLocaleString()}</span>
            </div>
          )}
        </div>
          <div className="flex flex-col mr-4 items-center justify-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleAddToCart();
            }}
            disabled={isAddingToCart}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 disabled:opacity-70"
            aria-label="Add to cart"
          >
            {isAddingToCart ? (
              <Spinner size="small" />
            ) : (
              <FiShoppingCart size={25} />
            )}
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleWish();
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:bg-gray-50 ${
              addWish ? "text-red-500" : "text-gray-700"
            }`}
            aria-label={addWish ? "Remove from wishlist" : "Add to wishlist"}
          >
            {addWish ? <GoHeartFill size={30} /> : <CiHeart size={35} />}
          </button>
        </div>

        </div>
      </div>
    </div>
  );
}
