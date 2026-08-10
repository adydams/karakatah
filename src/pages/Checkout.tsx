// import EmptyCart from "../components/EmptyCart";
import { IoMdArrowDropright } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import { formatPrice, normalizeListData } from "../utils/utils";
import type { Cart } from "../contexts/CartContext";
import { getCart } from "../services/apiCarts";
import Spinner from "../components/Spinner";
import { useForm } from "react-hook-form";
import { checkoutSchema, type TCheckoutSchema } from "../types/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { createOrder } from "../services/apiCheckout";
import { Link } from "react-router";
import { getShippingAddress } from "../services/apiShipping";
import { getPickupStations } from "../services/adminDashboard/apiPickupStation";

type PickupStation = {
  id: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
};

// Payment on success page

// https://karakatang.vercel.app/api/payments/verify?gateway=paystack&orderId=885036e9-e4bd-4dce-bd56-4c290d82fb16&trxref=order_885036e9-e4bd-4dce-bd56-4c290d82fb16_1776077522047&reference=order_885036e9-e4bd-4dce-bd56-4c290d82fb16_1776077522047

export default function Checkout() {
  // const { cart } = useCart();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TCheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingMethod: "pickup",
      gateway: "paystack",
      shippingAddressId: "",
      chosenStationId: "",
      phone: "",
      notes: "",
    },
  });

  const shippingMethod = watch("shippingMethod");

  // fetch the cart using the cartId
  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    enabled: !!localStorage.getItem("token"),
  });

  const { data: shippingAddress, isLoading: IsFetchingAddress } = useQuery({
    queryKey: ["shippingAddress"],
    queryFn: getShippingAddress,
  });

  const { data: pickupStationResponse, isLoading: isFetchingPickupStations } =
    useQuery({
      queryKey: ["pickupStations"],
      queryFn: getPickupStations,
    });

  const pickupStations = normalizeListData<PickupStation>(pickupStationResponse);
  const items = cart?.data?.items ?? [];
  const subtotal = Number(cart?.data?.totalAmount ?? 0);
  const shippingFee = shippingMethod === "shipping" ? 2500 : 0;
  const totalAmount = subtotal + shippingFee;

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="big" />
      </div>
    );

  async function onSubmit(data: TCheckoutSchema) {
    if (data.shippingMethod === "shipping") {
      toast.error(
        "Home delivery checkout is not available yet. Please choose pickup and continue.",
      );
      return;
    }

    try {
      const success = await createOrder({
        shippingAddressId: data.shippingAddressId || "",
        notes: data.notes || "",
        gateway: data.gateway,
        phone: data.phone,
        shippingMethod: data.shippingMethod,
        chosenStationId: data.chosenStationId || undefined,
      });

      if (success) {
        toast.success(success.message);
        toast.success("Redirecting to payment...");

        setTimeout(() => {
          window.location.href = success.paymentUrl;
        }, 1500);
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
          <div className="flex h-full w-full flex-col items-start justify-start rounded-lg bg-white px-3 py-5 shadow-sm">
            <div className="flex w-full items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Step 1 • Logistics
                </p>
                <h2 className="font-primary mt-1 text-xl font-semibold">
                  Choose how you want to receive your order
                </h2>
              </div>
              <Link
                className="text-orange font-primary flex w-30 items-center justify-end gap-0 text-xs font-medium underline-offset-2 transition-all duration-700 hover:gap-1 hover:underline"
                to="/checkout/address"
              >
                Add address <IoMdArrowDropright size={18} />
              </Link>
            </div>

            <div className="mt-6 grid w-full gap-3 md:grid-cols-2">
              <label className="rounded-xl border border-gray-200 p-4 transition-all hover:border-orange/40">
                <input
                  type="radio"
                  value="pickup"
                  className="mr-2"
                  {...register("shippingMethod")}
                />
                <span className="font-primary font-semibold">Pickup station</span>
                <p className="mt-1 text-sm text-gray-600">
                  Collect from a nearby picker station at no delivery fee.
                </p>
              </label>
              <label className="rounded-xl border border-gray-200 p-4 transition-all hover:border-orange/40">
                <input
                  type="radio"
                  value="shipping"
                  className="mr-2"
                  {...register("shippingMethod")}
                />
                <span className="font-primary font-semibold">Home delivery</span>
                <p className="mt-1 text-sm text-gray-600">
                  Doorstep delivery is being wired up for live courier quotes.
                </p>
              </label>
            </div>
            {errors.shippingMethod && (
              <p className="mt-2 text-xs text-red-500">
                {errors.shippingMethod.message}
              </p>
            )}

            {shippingMethod === "pickup" ? (
              <div className="mt-6 w-full rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                <label
                  htmlFor="chosenStationId"
                  className="font-primary text-base font-semibold"
                >
                  Pickup station
                </label>
                <p className="mt-1 text-sm text-gray-600">
                  Select the location you want to collect from.
                </p>
                {isFetchingPickupStations ? (
                  <div className="mt-3">
                    <Spinner size="small" />
                  </div>
                ) : pickupStations.length ? (
                  <select
                    id="chosenStationId"
                    {...register("chosenStationId")}
                    className="border-dark-gray/20 text-dark-gray/70 focus:bg-light-gray/20 focus:text-dark-gray/90 mt-3 w-full rounded-lg border-b px-5 py-2.5 text-xs transition-all duration-700 focus:outline-0"
                  >
                    <option value="">-- Select a pickup station --</option>
                    {pickupStations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name} — {station.address || [station.city, station.state].filter(Boolean).join(", ")}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-3 rounded-lg border border-orange/20 bg-orange/10 px-4 py-3 text-sm text-orange">
                    No pickup stations are available right now. Please come back later.
                  </div>
                )}
                {errors.chosenStationId && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.chosenStationId.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-6 w-full rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex w-full items-center justify-between">
                  <label
                    htmlFor="shippingAddressId"
                    className="font-primary text-base font-semibold"
                  >
                    Delivery address
                  </label>
                  <Link
                    className="text-orange font-primary flex items-center gap-0 text-xs font-medium underline-offset-2 transition-all duration-700 hover:gap-1 hover:underline"
                    to="/checkout/address"
                  >
                    Add address <IoMdArrowDropright size={18} />
                  </Link>
                </div>
                {IsFetchingAddress ? (
                  <div className="mt-3">
                    <Spinner size="small" />
                  </div>
                ) : !shippingAddress?.addresses?.length ? (
                  <Link
                    to="/checkout/address"
                    className="border-orange/40 mt-4 block w-full border-2 border-dashed bg-white px-10 py-5 text-center text-xs font-medium tracking-widest text-gray-500"
                  >
                    Add an address
                  </Link>
                ) : (
                  <select
                    id="shippingAddressId"
                    {...register("shippingAddressId")}
                    className="border-dark-gray/20 text-dark-gray/70 focus:bg-light-gray/20 focus:text-dark-gray/90 mt-3 w-full rounded-lg border-b px-5 py-2.5 text-xs transition-all duration-700 focus:outline-0"
                  >
                    <option value="">-- Select delivery address --</option>
                    {shippingAddress.addresses.map(
                      (address: {
                        id: string;
                        line1?: string;
                        line2?: string;
                        city?: string;
                        state?: string;
                        country?: string;
                      }) => (
                        <option key={address.id} value={address.id}>
                          {[
                            address.line1,
                            address.line2,
                            address.city,
                            address.state,
                            address.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </option>
                      ),
                    )}
                  </select>
                )}
                {errors.shippingAddressId && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.shippingAddressId.message}
                  </p>
                )}
              </div>
            )}

            <label
              htmlFor="phone"
              className="font-primary mt-6 w-full text-lg font-semibold"
            >
              Customer phone
            </label>
            <input
              className="border-dark-gray/20 text-dark-gray/70 focus:bg-light-gray/20 focus:text-dark-gray/90 w-full rounded-lg border-b px-5 py-2.5 text-xs transition-all duration-700 focus:outline-0"
              type="text"
              placeholder="Enter your phone number"
              id="phone"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="mt-2 text-xs text-red-500">{errors.phone.message}</p>
            )}

            <label
              htmlFor="notes"
              className="font-primary mt-5 w-full text-lg font-semibold"
            >
              Customer note
            </label>
            <input
              className="border-dark-gray/20 text-dark-gray/70 focus:bg-light-gray/20 focus:text-dark-gray/90 w-full rounded-lg border-b px-5 py-2.5 text-xs transition-all duration-700 focus:outline-0"
              type="text"
              placeholder="Any delivery instructions?"
              id="notes"
              {...register("notes")}
            />
            {errors.notes && (
              <p className="mt-2 text-xs text-red-500">{errors.notes.message}</p>
            )}

            <h2 className="font-primary mt-6 w-full text-lg font-semibold">
              Payment gateway
            </h2>
            <div className="mt-4 flex w-full flex-wrap items-center gap-5">
              <label className="relative">
                <input
                  type="radio"
                  value="paystack"
                  className="peer hidden"
                  {...register("gateway")}
                />
                <div className="flex h-[80px] w-[130px] cursor-pointer items-center justify-center border border-gray-500/50 transition-all duration-200 peer-checked:border-transparent peer-checked:bg-gray-200">
                  <img className="w-[100px]" src="paystack-2.svg" alt="Paystack" />
                </div>
              </label>
              <label className="relative">
                <input
                  type="radio"
                  value="flutterwave"
                  className="peer hidden"
                  {...register("gateway")}
                />
                <div className="flex h-[80px] w-[130px] cursor-pointer items-center justify-center border border-gray-500/50 transition-all duration-200 peer-checked:border-transparent peer-checked:bg-gray-200">
                  <img className="w-[100px]" src="flutterwave-1.svg" alt="Flutterwave" />
                </div>
              </label>
              <label className="relative">
                <input
                  type="radio"
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
              <p className="mt-2 text-xs text-red-500">{errors.gateway.message}</p>
            )}
          </div>
          <div className="h-fit w-full rounded-lg bg-white px-3 py-3 shadow-sm">
            <h1 className="border-dark-gray/10 w-full border-b py-3 text-base font-medium uppercase tracking-wide">
              Order Summary
            </h1>
            <div className="mt-3 flex flex-col gap-3">
              {items.length ? (
                items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {item.product?.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-800">
                      ₦{formatPrice(Number(item.product?.price || 0) * Number(item.quantity || 0))}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Your cart is empty.</p>
              )}
            </div>
            <div className="border-dark-gray/10 mt-4 flex items-center justify-between border-b py-3 text-sm">
              <p>Items total</p>
              <p className="font-primary text-base font-semibold">
                ₦{formatPrice(subtotal)}
              </p>
            </div>
            <div className="border-dark-gray/10 flex items-center justify-between border-b py-3 text-sm">
              <p>Delivery fees</p>
              <p className="font-primary text-base font-semibold">
                ₦{formatPrice(shippingFee)}
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
              className="bg-muted-green hover:bg-orange font-primary mt-4 w-full cursor-pointer rounded-lg py-3 font-semibold text-white transition-colors"
            >
              {isSubmitting ? <Spinner size="small" /> : "Place order"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
