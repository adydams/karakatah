import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { GoHeartFill } from "react-icons/go";
import type { ProductProp } from "../types/type";
import { Link, useNavigate } from "react-router";
import { addItemToCart } from "../services/apiCarts";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AddItemVariables = {
  productId: string;
  name: string;
};

export default function ProductCard({ id, image, name, price }: ProductProp) {
  const [addWish, setAddWish] = useState(false);
  const [showAddtoCart, setShowAddtoCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
    mutate({ name, productId: id });
  }

  function handleWish() {
    setAddWish((prev) => !prev);
  }

  return (
    <div
      onMouseEnter={() => setShowAddtoCart(true)}
      onMouseLeave={() => setShowAddtoCart(false)}
      className="relative h-[460px] w-full overflow-hidden"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative h-[70%] w-full overflow-hidden">
        {/* Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}

        {/* Actual image */}
        <img
          src={image}
          alt={name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full transition-all duration-1000 ${
            showAddtoCart ? "object-contain" : "object-cover"
          } ${imageLoaded ? "opacity-100" : "opacity-0"} `}
        />
      </div>

      {/* DETAILS */}
      <div className="flex w-full items-center justify-between">
        <div className="h-[20%] w-[80%] cursor-pointer">
          <h2 className="font-primary mt-1.5 font-light">{name}</h2>

          <h2 className="font-primary text-xl">₦{price}</h2>
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

            <Link
              to={`products/${name.replaceAll(" ", "-")}/${id}`}
              className="border-dark-gray absolute inset-0 m-auto flex h-[30px] w-1/2 items-center justify-center border-2 bg-white/80 text-xs"
            >
              VIEW MORE
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
