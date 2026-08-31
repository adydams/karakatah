import { Link } from "react-router";
// import { useCart } from "../contexts/hooks/useCart";
import { formatPrice } from "../utils/utils";
import Spinner from "./Spinner";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "../services/apiCarts";
import type { Cart } from "../contexts/CartContext";

// import { MdOutlineRemoveShoppingCart } from "react-icons/md";

export default function CartItemCardNav() {
  // const {user} =
  // const { cart } = useCart();

  // fetch the cart using the cartId
  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    enabled: !!localStorage.getItem("token"),
  });

  const items = cart?.data?.items ?? [];
  const totalAmount = cart?.data?.totalAmount;

  if (isLoading) return <Spinner size="small" />;

  if (!cart) {
    return (
      <>
        <div className="fixed top-0 left-0 hidden h-screen w-full bg-gray-900/40"></div>
        <div className="absolute top-full left-[-130%] mt-10 hidden w-[300px] flex-col items-center justify-center bg-white px-3 py-2 shadow-md/10 md:flex">
          <div className="w-full">
            <img src="images/cart_toon.svg" alt="" />
          </div>
          <Link
            to={"/"}
            className="bg-muted-green/90 hover:bg-muted-green font-primary flex w-full items-center justify-center py-3 text-sm font-bold text-white"
          >
            Start shopping
          </Link>
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <div className="fixed top-0 left-0 h-screen w-full bg-gray-900/40 md:hidden"></div>
        <div className="absolute top-full left-[-130%] mt-8 hidden w-[300px] flex-col items-center justify-center bg-white px-3 py-2 shadow-md/10 md:flex">
          <div className="w-full">
            <img src="images/cart_toon.svg" alt="" />
          </div>
          <Link
            to={"/"}
            className="bg-muted-green/90 hover:bg-muted-green font-primary flex w-full items-center justify-center py-3 text-sm font-bold text-white"
          >
            Empty Cart
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 hidden h-screen w-full bg-gray-900/40"></div>
      <div className="fixed top-full right-0 left-0 m-auto mt-0 hidden w-[92%] flex-col items-center justify-center bg-white px-3 py-2 shadow-md/10 md:absolute md:top-[57px] md:left-[-130%] md:flex md:w-[300px]">
        {!items ? (
          <Spinner size="big" />
        ) : (
          items?.map((product) => (
            <div
              key={product.id}
              className="border-dark-gray/20 flex h-[80px] w-full items-center justify-start gap-2 border-b py-1.5"
            >
              <div className="h-full w-[65px] overflow-hidden rounded-lg">
                <img
                  src={product.product?.images?.[0]?.url}
                  className="h-full w-full object-cover"
                  alt=""
                />
              </div>
              <div className="flex h-full flex-col items-start justify-center text-xs">
                <h2 className="font-primary text-xs font-medium lg:text-sm">
                  {product.product?.name}
                </h2>
                <p className="font-light">
                  Price:{" "}
                  <span className="font-primary text-muted-green font-bold">
                    ₦{formatPrice(product.product?.price || 0)}
                  </span>
                </p>
                <p className="font-light">
                  Qty:{" "}
                  <span className="font-primary font-medium">
                    {product.quantity}
                  </span>
                </p>
              </div>
            </div>
          ))
        )}

        <h3 className="my-3 flex w-full items-center justify-start gap-2 text-sm font-medium">
          Total{" "}
          <span className="text-orange font-bold">
            ₦{formatPrice(totalAmount)}
          </span>
        </h3>
        <Link
          to={"/checkout"}
          className="bg-muted-green/90 hover:bg-muted-green font-primary flex w-full items-center justify-center py-3 text-sm font-bold text-white"
        >
          View Cart
        </Link>
      </div>
    </>
  );
}
