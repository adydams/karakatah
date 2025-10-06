import CartItem from "../components/CartItem";
import EmptyCart from "../components/EmptyCart";
import { useCart } from "../contexts/hooks/useCart";
import { formatPrice } from "../utils/utils";

export default function CartPage() {
  const { cart } = useCart();

  const items = cart?.data?.items ?? [];
  const totalAmount = cart?.data?.totalAmount;

  return (
    <>
      <section className="flex w-full items-center justify-center pt-14 pb-5 lg:py-5">
        {items.length >= 1 ? (
          <div className="grid h-full w-[92%] grid-cols-1 gap-5 lg:w-[85%] lg:grid-cols-[2fr_1fr]">
            <div className="flex h-full w-full flex-col items-start justify-start space-y-3 rounded-lg bg-white px-3">
              <h1 className="font-primary border-dark-gray/10 w-full border-b py-3 text-lg font-semibold">
                Cart ({items.length})
              </h1>
              {items.map((item, index) => (
                <CartItem
                  key={index}
                  name={item.product.name}
                  price={item.product.price}
                  image={item.product.image}
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
              <button className="bg-orange/90 hover:bg-orange font-primary w-full cursor-pointer rounded-lg py-3 font-semibold text-white">
                Checkout{" "}
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
