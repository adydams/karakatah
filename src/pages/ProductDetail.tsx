import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { useParams } from "react-router";
import ImageSlider from "../components/ImageSlider";
import { getProduct } from "../services/apiProducts";
import { formatPrice } from "../utils/utils";
import ProductDetailsSkeleton from "../components/ProductDetailsSkeleton";
import ProductImagePulse from "../components/ProductImagePulse";
// import Spinner from "../components/Spinner";
// import { formatPrice } from "../utils/utils";

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);

  if (quantity < 0) {
    setQuantity(0);
  }

  const { id } = useParams<{ id: string }>();
  // console.log(id);

  const { isLoading: isGettingProduct, data: productData } = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => getProduct(id as string),
  });

  const product = productData?.data;

  console.log(product, isGettingProduct);
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
                <span className="text-muted-green font-medium">In stock</span>
              </p>
              <p className="text-dark-gray mt-2 text-sm leading-relaxed font-light">
                Color:{" "}
                <span className="text-muted-green font-medium">Orange</span>
              </p>
              <p className="text-dark-gray mt-2 text-sm leading-relaxed font-light">
                Size:{" "}
                <span className="text-muted-green font-medium">Medium</span>
              </p>

              <h2 className="border-muted-green text-muted-green mt-10 w-auto rounded-lg border-[1px] px-4 py-1 text-center font-bold lg:text-2xl">
                ₦{formatPrice(product?.price)}
              </h2>

              <div className="mt-5">
                <div className="flex w-full items-center justify-between gap-2">
                  <FaArrowAltCircleLeft
                    onClick={() => setQuantity((prev) => prev - 1)}
                    size={20}
                    className="cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(+e.target.value)}
                    className="w-[50px] text-center focus:outline-none"
                  />
                  <FaArrowAltCircleRight
                    onClick={() => setQuantity((prev) => prev + 1)}
                    size={20}
                    className="text-secondary cursor-pointer"
                  />
                </div>
                <button className="bg-orange mt-3 rounded-md px-5 py-2 text-xs font-medium text-white">
                  ADD TO CART
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
