import { MdDensitySmall } from "react-icons/md";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Filter from "../components/Filter";
import { useEffect, useState } from "react";
import SliderHero from "../components/SliderHero";
import { useUser } from "../contexts/hooks/useUser";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "../services/apiProducts";
import Spinner from "../components/Spinner";
import { formatPrice } from "../utils/utils";
// import { useCart } from "../contexts/hooks/useCart";




export default function Homepage() {
  const [showFilter, setShowFilter] = useState(false);
  const { getCurrentUser, user } = useUser();
  // const { cartCreation } = useCart();
  console.log(user);  

  const {
    isLoading: isGettingProducts,
    data: productData,
    // error: productError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products = productData?.data;

  // console.log(isGettingProducts, productError, products);

  const { isLoading: isGettingCategories, data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const categories = categoryData?.data;
  // console.log(isGettingCategories, categoryData);

  function handleShowFilter() {
    setShowFilter((filter) => !filter);
    console.log("show filter ");
  }
  // const categoriesLength = categories?.length;

  // ✅ Effect 1: Fetch current user
  useEffect(() => {
    async function fetchCurrentUser() {
      if (!user) {
        const success = await getCurrentUser();

        if (success) {
          toast.success(`Welcome back, ${success.user.name}`);
        }
      }
    }
    fetchCurrentUser();
  }, [getCurrentUser, user]);

  // ✅ Effect 2: Ensure cart exists when user logs in
  // useEffect(() => {
  //   async function ensureCart() {
  //     if (user) {
  //       const cartId = localStorage.getItem("cartId");
  //       if (!cartId) {
  //         try {
  //           await cartCreation();
  //           toast.success("Cart created successfully");
  //         } catch {
  //           toast.error("Failed to create cart");
  //         }
  //       }
  //     }
  //   }
  //   ensureCart();
  // }, [user, cartCreation]);

  return (
    <>
      <main className="flex w-full items-center justify-center py-8 lg:h-[70vh] lg:py-5">
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
        <div className="bg-orange font-primary flex h-full w-[92%] items-center justify-start gap-10 text-xs text-white lg:w-[85%]">
          <h2
            onClick={handleShowFilter}
            className="hover:bg-deep-blue/50 flex cursor-pointer items-center justify-start gap-1 px-3 py-1 font-medium"
          >
            <MdDensitySmall size={20} /> <span>All Categories</span>
          </h2>
          <div className="hidden h-full w-[80%] items-center justify-start gap-5 lg:flex">
            {isGettingCategories ? (
              <Spinner size="small" />
            ) : (
              categories?.map((category, index) => (
                <p
                  className="hover:bg-deep-blue/50 h-full cursor-pointer px-4 py-2 text-center transition-all duration-700 hover:font-medium"
                  key={index}
                >
                  {category?.name}
                </p>
              ))
            )}
          </div>
        </div>
        <div
          className={`mt-4 ${isGettingProducts ? "flex h-[400px] items-center justify-center" : "grid"} w-[92%] grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2 lg:w-[85%] lg:grid-cols-4`}
        >
          {isGettingProducts ? (
            <Spinner size="big" />
          ) : (
            products?.map((product) => (
              <ProductCard
                name={product.name}
                id={product.id}
                key={product.id}
                image={product.images[0].url}
                price={formatPrice(product.price)}
              />
            ))
          )}
        </div>
        <Pagination />

        <Filter showFilter={showFilter} setShowFilter={setShowFilter} />
      </section>
    </>
  );
}
