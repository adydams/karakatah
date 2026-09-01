import { MdDensitySmall } from "react-icons/md";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Filter from "../components/Filter";
import { useState } from "react";
import SliderHero from "../components/SliderHero";

import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "../services/apiProducts";
import Spinner from "../components/Spinner";
import { formatPrice, shortenText } from "../utils/utils";

export default function Homepage() {
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = showFilter ? 12 : 16;
  const {
    isLoading: isGettingProducts,
    data: productData,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products = (productData?.data ?? []) as any[];

  const { isLoading: isGettingCategories, data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = categoryData?.data ?? [];

  function handleShowFilter() {
    setShowFilter((prev) => !prev);
  }

  console.log(products);

  // Pagination Logic
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const paginatedProducts = products.slice(startIndex, endIndex);

  return (
    <>
      <main className="flex w-full items-center justify-center py-8 lg:h-[25vh] lg:py-5">
        <div className="w-[92%] items-center justify-between lg:flex lg:h-full lg:w-[85%]">
          <SliderHero />

          <div className="mt-3 flex w-full items-center justify-between gap-2 lg:mt-0 lg:h-full lg:w-[30%] lg:flex-col">
            <div className="bg-beige flex h-[200px] w-[50%] items-center justify-center lg:h-[50%] lg:w-full">
              Advert
            </div>

            <div className="bg-beige flex h-[200px] w-[50%] items-center justify-center lg:h-[50%] lg:w-full">
              Advert
            </div>
          </div>
        </div>
      </main>

      <section className="relative mt-2 mb-10 flex w-full flex-col items-center justify-center font-bold">
        {/* Categories */}
        <div className="bg-orange font-primary flex h-full w-[92%] items-center justify-start gap-10 text-xs text-white lg:w-[85%]">
          <h2
            onClick={handleShowFilter}
            className="hover:bg-deep-blue/50 flex cursor-pointer items-center gap-1 px-3 py-1"
          >
            <MdDensitySmall size={20} />
            <span>All Categories</span>
          </h2>

          <div className="dash hidden w-[85%] gap-5 overflow-scroll lg:flex">
            {isGettingCategories ? (
              <Spinner size="small" />
            ) : (
              categories.map((category) => (
                <p
                  key={category.id}
                  className="hover:bg-deep-blue/50 flex w-25 cursor-pointer items-center justify-center px-4 py-2 text-center text-[10px]"
                >
                  {shortenText(category.name)}
                </p>
              ))
            )}
          </div>
        </div>

        {/* Products */}
        <div
          className={`mt-4 ${
            isGettingProducts
              ? "flex h-[400px] items-center justify-center"
              : "grid"
          } w-[92%] grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 lg:w-[85%] lg:grid-cols-6`}
        >
          <Filter showFilter={showFilter} setShowFilter={setShowFilter} />

          {isGettingProducts ? (
            <Spinner size="big" />
          ) : products.length === 0 ? (
            <div className="flex h-[250px] w-full flex-col items-center justify-center rounded-xl bg-gray-50">
              <p className="text-dark-gray text-sm font-medium">
                Failed to load products
              </p>

              <button
                onClick={() => refetch()}
                className="bg-orange mt-3 rounded-lg px-6 py-2 text-xs font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          ) : (
            paginatedProducts.map((product, index) => {
              if (!product || !product.id) return null;
              return (
                <ProductCard
                  key={`${product.id}-${index}`}
                  name={product.name || "Unnamed Product"}
                  id={product.id}
                  image={product.images?.[0]?.url}
                  price={formatPrice(product.price)}
                  isDiscounted={product.isDiscounted}
                  currentPrice={formatPrice(product.currentPrice || product.price)}
                  discounts={product.discounts}
                />
              );
            })
          )}
        </div>

        {/* Pagination */}
        {products.length > PRODUCTS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </section>
    </>
  );
}
