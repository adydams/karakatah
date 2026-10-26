import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import ImageSlider from "../components/ImageSlider";
import { getProduct } from "../services/apiProducts";
import { formatPrice } from "../utils/utils";
import ProductDetailsSkeleton from "../components/ProductDetailsSkeleton";
import ProductImagePulse from "../components/ProductImagePulse";
import { addItemToCart } from "../services/apiCarts";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { useUser } from "../contexts/hooks/useUser";
// import { addItemToCart } from "../services/apiCarts";
// import toast from "react-hot-toast";
// import Spinner from "../components/Spinner";
// import { formatPrice } from "../utils/utils";

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();
  const { user } = useUser();

  const navigate = useNavigate();

  // Remove the direct state update from render to prevent "Too many re-renders" error
  const { id } = useParams<{ id: string }>();
  const productId = id;
  // console.log(id);

  const { isLoading: isGettingProduct, data: productData } = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => getProduct(id as string),
  });

  const product = productData?.data;
  const name = product?.name;

  // Live sellable stock from inventory (quantityOnHand - quantityReserved).
  // stockQuantity is a stale create-time snapshot and must not drive availability.
  const availableStock = Number(product?.availableStock ?? product?.stockQuantity ?? 0);
  const outOfStock = availableStock <= 0;

  // Add item to cart
  type AddItemVariables = {
    productId: string | undefined;
    quantity: number;
    name: string | undefined;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name, productId, quantity }: AddItemVariables) =>
      addItemToCart(name, productId, quantity),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Product added to cart");
    },

    onError: (err: Error) => {
      if (err.message.toLocaleLowerCase().includes("no cartid")) {
        navigate("/login");
        toast.error("Create an account or Log In to start your shopping cart.");
      }
    },
  });

  function handleAddToCart() {
    if (!user) {
      navigate("/login");
      toast.error("Please log in to add items to your cart");
      return;
    }
    mutate({ name, productId, quantity });
  }

  // console.log(product, isGettingProduct);
  // const formattedname = name?.replaceAll("-", " ");

  return (
    <>
      <section className="mb-10 flex h-auto w-full items-center justify-center lg:mb-0 lg:h-screen">
        <div className="block h-4/5 w-[92%] items-start justify-between gap-14 lg:flex lg:w-4/5">
          {isGettingProduct ? (
            <ProductImagePulse />
          ) : (
            <ImageSlider images={product?.images} />
          )}
          {isGettingProduct ? (
            <ProductDetailsSkeleton />
          ) : (
            <div className="mt-3 flex flex-col items-start justify-start lg:mt-0 lg:h-auto lg:w-1/2 lg:p-3">
              <h1 className="font-primary text-2xl font-bold lg:text-4xl">
                {product?.name}
              </h1>
              <p className="text-darkshade mt-2 text-sm leading-relaxed font-light">
                {product?.description}
              </p>
              <p className="text-darkshade mt-2 text-sm leading-relaxed font-light">
                Availability:{" "}
                <span className={`${availableStock > 0 ? "text-muted-green" : "text-red-600"} font-medium`}>
                  {availableStock > 0 ? `In stock (${availableStock} available)` : "Out of Stock"}
                </span>
              </p>
              <p className="text-dark-gray mt-2 text-sm leading-relaxed font-light">
                Color:{" "}
                <span className="text-muted-green font-medium">Orange</span>
              </p>
              <p className="text-dark-gray mt-2 text-sm leading-relaxed font-light">
                Size:{" "}
                <span className="text-muted-green font-medium">Medium</span>
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-2">
                {product?.isDiscounted ? (
                  <>
                    <h2 className="text-slate-400 text-xl line-through">
                      ₦{formatPrice(product?.price)}
                    </h2>
                    <h2 className="border-muted-green text-muted-green w-auto rounded-lg border-[1px] px-4 py-1 text-center font-bold lg:text-2xl">
                      ₦{formatPrice(product?.currentPrice)}
                    </h2>
                  </>
                ) : (
                  <h2 className="border-muted-green text-muted-green mt-10 w-auto rounded-lg border-[1px] px-4 py-1 text-center font-bold lg:text-2xl">
                    ₦{formatPrice(product?.price)}
                  </h2>
                )}
              </div>

              <div className="mt-5">
                <div className="flex w-full items-center justify-between gap-2">
                  <FaArrowAltCircleLeft
                    onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                    size={20}
                    className="cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => {
                      const val = +e.target.value;
                      setQuantity(val > 0 ? val : 1);
                    }}
                    className="w-[50px] text-center focus:outline-none"
                  />
                  <FaArrowAltCircleRight
                    onClick={() => setQuantity((prev) => prev + 1)}
                    size={20}
                    className="text-secondary cursor-pointer"
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className={`mt-3 w-[150px] rounded-md px-5 py-2 text-xs font-medium text-white transition ${
                    outOfStock
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange cursor-pointer hover:bg-orange/90"
                  }`}
                >
                  {outOfStock
                    ? "OUT OF STOCK"
                    : isPending ? <Spinner size="medium" /> : "ADD TO CART"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
