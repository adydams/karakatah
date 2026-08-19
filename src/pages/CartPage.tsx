import { useNavigate } from "react-router";
import CartItem from "../components/CartItem";
import EmptyCart from "../components/EmptyCart";
// import { useCart } from "../contexts/hooks/useCart";
import { formatPrice } from "../utils/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Cart } from "../contexts/CartContext";
import { getCart, deleteItemCart } from "../services/apiCarts";
import Spinner from "../components/Spinner";
import { FaArrowLeftLong } from "react-icons/fa6";
import toast from "react-hot-toast";

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
    // go to the unified checkout page
    navigate("/checkout");
  }

  const items = cart?.data?.items ?? [];
  const totalAmount = cart?.data?.totalAmount ?? 0;

  const queryClient = useQueryClient();
  const { mutate: deleteItemMutate } = useMutation({
    mutationFn: (id: string) => deleteItemCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to remove item");
    },
  });

  function handleDeleteItem(id: string) {
    if (!confirm("Remove this item from cart?")) return;
    deleteItemMutate(id);
  }

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
            <div className="flex h-full w-full flex-col items-start justify-start rounded-lg bg-white px-3 py-3 shadow-sm">
              <div className="font-primary border-dark-gray/10 flex w-full items-center justify-between gap-2 border-b py-3 text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <span onClick={() => navigate(-1)} className="cursor-pointer">
                    <FaArrowLeftLong size={16} />
                  </span>
                  <span>Cart ({items.length})</span>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Ready for checkout
                </span>
              </div>
              <div className="mt-3 flex w-full flex-col gap-3">
                {items.map((item) => (
                  item.product ? (
                    <CartItem
                      key={item.id}
                      name={item.product?.name}
                      price={item.product?.price || 0}
                      image={item.product?.images?.[0]?.url}
                      quantity={item.quantity}
                      id={item.id}
                    />
                  ) : (
                    <div key={item.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <div className="font-semibold">Item unavailable</div>
                        <div className="text-xs text-gray-600">This item was removed from the catalog.</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => handleDeleteItem(item.id)} className="text-sm text-orange">Remove</button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
            <div className="h-fit w-full rounded-lg bg-white px-3 py-3 shadow-sm">
              <h1 className="border-dark-gray/10 w-full border-b py-3 text-base font-medium uppercase tracking-wide">
                Order Summary
              </h1>
              <div className="border-dark-gray/10 flex items-center justify-between border-b py-3">
                <p className="text-sm text-gray-600">Sub total</p>
                <p className="font-primary text-lg font-semibold">
                  ₦{formatPrice(totalAmount)}
                </p>
              </div>
              <div className="border-dark-gray/10 flex items-center justify-between border-b py-3">
                <p className="text-sm text-gray-600">Pickup / delivery</p>
                <p className="font-primary text-sm font-semibold text-gray-700">
                  Flexible logistics
                </p>
              </div>
              <button
                onClick={handleMovetoCheckout}
                className="bg-orange/90 hover:bg-orange font-primary mt-3 w-full cursor-pointer rounded-lg py-3 font-semibold text-white transition-colors"
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
