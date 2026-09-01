import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { GoHeartFill } from "react-icons/go";
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
  const [showAddtoCart, setShowAddtoCart] = useState(false);
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
    <div
      onMouseEnter={() => setShowAddtoCart(true)}
      onMouseLeave={() => setShowAddtoCart(false)}
      className="relative h-[460px] w-full overflow-hidden"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative h-[70%] w-full overflow-hidden">
        {discountTeaser && (
          <div className="absolute top-2 left-2 z-10 rounded-full bg-orange px-3 py-1.5 text-[12px] font-bold text-white shadow-md">
            {discountTeaser}
          </div>
        )}
        {/* Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}

        {/* Actual image */}
        <img
          src={optimizeImage(image || "", 400, 400)}
          alt={name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full transition-all duration-1000 ${
            showAddtoCart ? "scale-105 object-cover" : "scale-100 object-cover"
          } ${imageLoaded ? "opacity-100" : "opacity-0"} `}
        />
      </div>

      {/* DETAILS */}
      <div className="flex w-full items-center justify-between">
        <div className="h-[20%] w-[80%] cursor-pointer">
          <h2 className="font-primary mt-1.5 font-light">{name}</h2>

          <div className="flex items-center gap-2">
            {isDiscounted ? (
              <>
                <h2 className="font-primary text-xl text-slate-400 line-through">₦{price}</h2>
                <h2 className="font-primary text-xl text-orange">₦{currentPrice}</h2>
              </>
            ) : (
              <h2 className="font-primary text-xl">₦{price}</h2>
            )}
          </div>
          {bestPrice && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] font-bold uppercase text-gray-400">Best Price:</span>
              <span className="text-xs font-bold text-green-600">₦{bestPrice.toLocaleString()}</span>
            </div>
          )}
        </div>

        <button onClick={handleWish}>
          {addWish ? (
            <GoHeartFill className="text-muted-green" size={25} />
          ) : (
            <CiHeart size={25} />
          )}
        </button>
      </div>

      {/* HOVER OVERLAY */}
      {showAddtoCart && (
        <div className="bg-light-gray/40 absolute inset-0 shadow-sm/10">
          <div className="relative flex h-full items-end justify-between gap-2">
            <button
              className="bg-orange hover:bg-orange/90 h-9 w-1/2 text-[10px] text-white hover:cursor-pointer"
              disabled={isAddingToCart}
              onClick={handleAddToCart}
            >
              {isAddingToCart ? <Spinner size="small" /> : "ADD TO CART"}
            </button>

            <button
              onClick={handleWish}
              className="bg-muted-green hover:bg-muted-green/90 h-9 w-1/2 text-[10px] text-white hover:cursor-pointer"
            >
              ADD TO WISHLIST
            </button>

            <button
              onClick={handleViewMore}
              className="border-dark-gray absolute inset-0 m-auto flex h-[30px] w-1/2 items-center justify-center border-2 bg-white/80 text-xs"
            >
              VIEW MORE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
