// import EmptyCart from "../components/EmptyCart";
import { useCart } from "../contexts/hooks/useCart";
import { formatPrice } from "../utils/utils";

export default function Checkout() {
  const { cart } = useCart();

  //   const items = cart?.data?.items ?? [];
  const totalAmount = cart?.data?.totalAmount;

  return (
    <>
      <section className="text-deep-blue flex w-full items-center justify-center pt-14 pb-5 lg:py-16">
        <div className="grid h-full w-[92%] grid-cols-1 gap-5 lg:w-[85%] lg:grid-cols-[2fr_1fr]">
          <form className="flex h-full w-full flex-col items-start justify-start rounded-lg bg-white px-3 py-5">
            <label
              htmlFor="address"
              className="font-primary w-full text-lg font-semibold"
            >
              Customer Address
            </label>
            <input
              className="border-dark-gray/20 text-dark-gray/70 focus:bg-light-gray/20 focus:text-dark-gray/90 w-full rounded-lg border-b px-5 py-2.5 text-xs transition-all duration-700 focus:outline-0"
              type="text"
              placeholder="Enter your Address"
              id="address"
            />

            <h1 className="font-primary mt-5 w-full py-3 text-lg font-semibold">
              Delivery Details
            </h1>

            <div className="radio-container flex w-full items-center justify-start gap-3">
              <input
                type="radio"
                id="pick-up"
                name="delivery"
                value="pick-up"
              />
              <label className="text-sm" htmlFor="pick-up">
                Pick-up Station (from ₦ 1, 500)
              </label>
            </div>
            <div className="radio-container mt-3 flex w-full items-center justify-start gap-3">
              <input type="radio" id="door" name="delivery" value="door" />
              <label className="text-sm" htmlFor="door">
                Door Delivery (from ₦ 3, 500)
              </label>
            </div>

            <label
              htmlFor="note"
              className="font-primary mt-5 w-full text-lg font-semibold"
            >
              Customer Note
            </label>
            <input
              className="border-dark-gray/20 text-dark-gray/70 focus:bg-light-gray/20 focus:text-dark-gray/90 w-full rounded-lg border-b px-5 py-2.5 text-xs transition-all duration-700 focus:outline-0"
              type="text"
              placeholder="Specify any kind of request while your order is delivered"
              id="note"
            />

            <button className="bg-muted-green font-primary mt-5 self-end rounded-lg px-4 py-3 text-xs font-semibold text-white">
              Confirm Delivery Details
            </button>
          </form>
          <div className="h-[300px] w-full space-y-2 rounded-lg bg-white px-3 pb-3">
            <h1 className="border-dark-gray/10 w-full border-b py-3 text-base font-medium">
              CART SUMMARY
            </h1>
            <div className="border-dark-gray/10 flex items-center justify-between border-b py-3 text-sm">
              <p>Item's total</p>
              <p className="font-primary text-base font-semibold">
                ₦{formatPrice(totalAmount)}
              </p>
            </div>
            <div className="border-dark-gray/10 flex items-center justify-between border-b py-3 text-sm">
              <p>Delivery fees</p>
              <p className="font-primary text-base font-semibold">
                ₦{formatPrice(totalAmount)}
              </p>
            </div>
            <div className="border-dark-gray/10 flex items-center justify-between border-b py-3 font-medium">
              <p>Total</p>
              <p className="font-primary text-orange text-lg font-bold">
                ₦{formatPrice(totalAmount)}
              </p>
            </div>
            <button className="bg-muted-green hover:bg-orange font-primary mt-3 w-full cursor-pointer rounded-lg py-3 font-semibold text-white">
              Checkout{" "}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
