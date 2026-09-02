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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

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

  const filteredProducts = selectedCategoryId
    ? products.filter((product) => {
        const categoryMatch = product.categoryId === selectedCategoryId;
        const nestedCategoryMatch = product.category?.id === selectedCategoryId;
        return categoryMatch || nestedCategoryMatch;
      })
    : products;

  function handleShowFilter() {
    setShowFilter((prev) => !prev);
  }

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const safePage = Math.min(currentPage, totalPages || 1);
  const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

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
        <div className="w-[92%] lg:w-[85%]">
          <div className="mb-5 flex items-center justify-between gap-3 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryId(null);
                setCurrentPage(1);
              }}
              className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
                selectedCategoryId === null
                  ? "border-orange bg-orange text-white shadow-sm"
                  : "border-orange/40 bg-white text-orange hover:bg-orange/5"
              }`}
            >
              All
            </button>

            {isGettingCategories ? (
              <div className="flex items-center justify-center px-4 py-2">
                <Spinner size="small" />
              </div>
            ) : (
              categories.map((category) => {
                const isActive = selectedCategoryId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId((prev) => (prev === category.id ? null : category.id));
                      setCurrentPage(1);
                    }}
                    className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
                      isActive
                        ? "border-orange bg-orange text-white shadow-sm"
                        : "border-orange/40 bg-white text-orange hover:bg-orange/5"
                    }`}
                  >
                    {shortenText(category.name, 24)}
                  </button>
                );
              })
            )}
          </div>
        </div>

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
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-[250px] w-full flex-col items-center justify-center rounded-xl bg-gray-50 md:col-span-2 lg:col-span-6">
              <p className="text-dark-gray text-sm font-medium">No products found in this category.</p>
              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  refetch();
                }}
                className="bg-orange mt-3 rounded-lg px-6 py-2 text-xs font-semibold text-white"
              >
                View all
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

        {filteredProducts.length > PRODUCTS_PER_PAGE && (
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </section>
    </>
  );
}
