// import EmptyCart from "../components/EmptyCart";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "../utils/utils";
import type { Cart } from "../contexts/CartContext";
import { getCart } from "../services/apiCarts";
import Spinner from "../components/Spinner";
import { useForm } from "react-hook-form";
import { checkoutSchema, type TCheckoutSchema } from "../types/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { createOrder } from "../services/apiCheckout";

export default function Checkout() {
  // const { cart } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TCheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
  });

  // fetch the cart using the cartId
  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    enabled: !!localStorage.getItem("token"),
  });

  //   const items = cart?.data?.items ?? [];
  const totalAmount = cart?.data?.totalAmount;

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="big" />
      </div>
    );

  async function onSubmit(data: TCheckoutSchema) {
    console.log(data);
    const { shippingAddressId, notes, gateway, phone } = data;

    try {
      const success = await createOrder({
        shippingAddressId,
        notes,
        gateway,
        phone,
      });

      if (success) {
        toast.success(`Account creation is successful`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast("An unexpected error occurred");
      }
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-deep-blue flex w-full items-center justify-center pt-14 pb-5 lg:py-16"
      >
        <div className="grid h-full w-[92%] grid-cols-1 gap-5 lg:w-[85%] lg:grid-cols-[2fr_1fr]">
          <div className="flex h-full w-full flex-col items-start justify-start rounded-lg bg-white px-3 py-5">
            {/* Shipping Address */}
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
              id="shippingAddressId"
              {...register("shippingAddressId")}
            />
            {errors.shippingAddressId && (
              <p className="text-xs text-red-500">{`${errors.shippingAddressId.message}`}</p>
            )}

            {/* Phone Number */}
            <label
              htmlFor="phone"
              className="font-primary mt-5 w-full text-lg font-semibold"
            >
              Customer Phone No
            </label>
            <input
              className="border-dark-gray/20 text-dark-gray/70 focus:bg-light-gray/20 focus:text-dark-gray/90 w-full rounded-lg border-b px-5 py-2.5 text-xs transition-all duration-700 focus:outline-0"
              type="text"
              placeholder="Enter your Phone Numer"
              id="phone"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{`${errors.phone.message}`}</p>
            )}

            {/* Delivery Options => not needed for now */}
            {/* <h1 className="font-primary mt-5 w-full py-3 text-lg font-semibold">
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
            </div> */}

            {/* <div className="radio-container mt-3 flex w-full items-center justify-start gap-3">
              <input type="radio" id="door" name="delivery" value="door" />
              <label className="text-sm" htmlFor="door">
                Door Delivery (from ₦ 3, 500)
              </label>
            </div> */}

            {/* Notes */}
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
              id="notes"
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-xs text-red-500">{`${errors.notes.message}`}</p>
            )}

            {/* Payment gateway */}
            <h2 className="font-primary mt-5 w-full text-lg font-semibold">
              Payment Gateway
            </h2>

            {/* Payment Options */}
            <div className="mt-5 flex w-full flex-wrap items-center gap-5">
              {/* Paystack */}
              <label className="relative">
                <input
                  type="radio"
                  // name="gateway"
                  value="paystack"
                  className="peer hidden"
                  {...register("gateway")}
                />

                <div className="flex h-[80px] w-[130px] cursor-pointer items-center justify-center border border-gray-500/50 transition-all duration-200 peer-checked:border-transparent peer-checked:bg-gray-200">
                  <img
                    className="w-[100px]"
                    src="paystack-2.svg"
                    alt="Paystack"
                  />
                </div>
              </label>

              {/* Flutterwave */}
              <label className="relative">
                <input
                  type="radio"
                  // name="gateway"
                  value="flutterwave"
                  className="peer hidden"
                  {...register("gateway")}
                />

                <div className="flex h-[80px] w-[130px] cursor-pointer items-center justify-center border border-gray-500/50 transition-all duration-200 peer-checked:border-transparent peer-checked:bg-gray-200">
                  <img
                    className="w-[100px]"
                    src="flutterwave-1.svg"
                    alt="Flutterwave"
                  />
                </div>
              </label>

              {/* PayPal */}
              <label className="relative">
                <input
                  type="radio"
                  // name="gateway"
                  value="paypal"
                  className="peer hidden"
                  {...register("gateway")}
                />

                <div className="flex h-[80px] w-[130px] cursor-pointer items-center justify-center border border-gray-500/50 transition-all duration-200 peer-checked:border-transparent peer-checked:bg-gray-200">
                  <img className="w-[100px]" src="paypal-3.svg" alt="PayPal" />
                </div>
              </label>
            </div>
            {errors.gateway && (
              <p className="text-xs text-red-500">{`${errors.gateway.message}`}</p>
            )}

            {/* <div className="bg-muted-green font-primary mt-5 self-end rounded-lg px-4 py-3 text-xs font-semibold text-white">
              Confirm Delivery Details
            </div> */}
          </div>
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
            <button
              disabled={isSubmitting}
              className="bg-muted-green hover:bg-orange font-primary mt-3 w-full cursor-pointer rounded-lg py-3 font-semibold text-white"
            >
              {isSubmitting ? <Spinner size="small" /> : "Checkout"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
