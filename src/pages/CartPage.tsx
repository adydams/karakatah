import { useNavigate } from "react-router";
import CartItem from "../components/CartItem";
import EmptyCart from "../components/EmptyCart";
// import { useCart } from "../contexts/hooks/useCart";
import { formatPrice } from "../utils/utils";
import { useQuery } from "@tanstack/react-query";
import type { Cart } from "../contexts/CartContext";
import { getCart } from "../services/apiCarts";
import Spinner from "../components/Spinner";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function CartPage() {
  // const { cart } = useCart();

  // fetch the cart using the cartId
  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    enabled: !!localStorage.getItem("token"),
  });
  const navigate = useNavigate();

  console.log(cart);

  function handleMovetoCheckout() {
    navigate("/checkout");
  }

  const items = cart?.data?.items ?? [];
  const totalAmount = cart?.data?.totalAmount;

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="big" />
      </div>
    );

  return (
    <>
      <section className="flex w-full items-center justify-center pt-14 pb-5 lg:py-7">
        {items.length >= 1 ? (
          <div className="grid h-full w-[92%] grid-cols-1 gap-5 lg:w-[85%] lg:grid-cols-[2fr_1fr]">
            <div className="flex h-full w-full flex-col items-start justify-start space-y-3 rounded-lg bg-white px-3">
              <h1 className="font-primary border-dark-gray/10 flex w-full items-center justify-start gap-2 border-b py-3 text-lg font-semibold">
                <span onClick={() => navigate(-1)} className="cursor-pointer">
                  <FaArrowLeftLong size={16} />{" "}
                </span>{" "}
                Cart ({items.length})
              </h1>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  name={item.product?.name}
                  price={item.product?.price || 0}
                  image={item.product?.images?.[0]?.url}
                  quantity={item.quantity}
                  id={item.id}
                />
              ))}
            </div>
            <div className="h-[180px] w-full space-y-2 rounded-lg bg-white px-3 pb-3">
              <h1 className="border-dark-gray/10 w-full border-b py-3 text-base font-medium">
                CART SUMMARY
              </h1>
              <div className="border-dark-gray/10 flex items-center justify-between border-b py-3">
                <p>SubTotal</p>
                <p className="font-primary text-lg font-semibold">
                  ₦{formatPrice(totalAmount)}
                </p>
              </div>
              <button
                onClick={handleMovetoCheckout}
                className="bg-orange/90 hover:bg-orange font-primary w-full cursor-pointer rounded-lg py-3 font-semibold text-white"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </section>
    </>
  );
}
