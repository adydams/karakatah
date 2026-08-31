// import EmptyCart from "../components/EmptyCart";
import { IoMdArrowDropright } from "react-icons/io";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatPrice, normalizeListData } from "../utils/utils";
import type { Cart } from "../contexts/CartContext";
import { getCart } from "../services/apiCarts";
import Spinner from "../components/Spinner";
import { useForm } from "react-hook-form";
import { checkoutSchema, type TCheckoutSchema } from "../types/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { createOrder } from "../services/apiCheckout";
import { Link, useLocation } from "react-router";
import { getShippingAddress, createShippingAddress } from "../services/apiShipping";
import Modal from "../components/Modal";
import { getPickupStations } from "../services/adminDashboard/apiPickupStation";
import { shippingAddressSchema, type ShippingAddressFormValues } from "../types/formSchema";
import { useState, useEffect } from "react";
import { getCouriers, fetchRates } from "../services/apiLogistics";
import AddAddressModal from "../components/AddAddressModal";
import OrderSummarySidebar from "../components/OrderSummarySidebar";
import CourierSelector, { getCourierKey } from "../components/CourierSelector";
import PaymentGatewaySelector from "../components/PaymentGatewaySelector";

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

  const location = useLocation();
  type SelectedCourier = {
    id?: string | number;
    courierId?: string | number;
    courier_id?: string | number;
    fee?: number;
    price?: number;
    requestToken?: string;
    request_token?: string;
    request_token_value?: string;
    requestTokenValue?: string;
    serviceCode?: string;
    service_code?: string;
    serviceCodeValue?: string;
    name?: string;
    courierName?: string;
    estimated_days?: string | number;
    estimatedDays?: string | number;
  };

  type CheckoutNavState = {
    courier?: SelectedCourier;
    shippingMethod?: "pickup" | "shipping";
    chosenStationId?: string;
  };

  const navState = (location.state as CheckoutNavState | null) || null;
  const storedShippingMethod = sessionStorage.getItem("selectedShippingMethod") as "pickup" | "shipping" | null;
  const storedChosenStationId = sessionStorage.getItem("selectedPickupStationId") || "";
  const defaultShippingMethod = navState?.shippingMethod ?? storedShippingMethod ?? "pickup";
  const defaultChosenStationId = navState?.chosenStationId ?? storedChosenStationId ?? "";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<TCheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingMethod: defaultShippingMethod,
      gateway: "paystack",
      shippingAddressId: "",
      chosenStationId: defaultChosenStationId,
      phone: "",
      notes: "",
    },
  });

  const shippingMethod = watch("shippingMethod");
  const shippingAddressId = watch("shippingAddressId");

  // Logistics State
  const [liveCouriers, setLiveCouriers] = useState<SelectedCourier[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<SelectedCourier | null>(null);
  const [isLiveRatesLoading, setIsLiveRatesLoading] = useState(false);
  const [requestToken, setRequestToken] = useState<string | null>(null);

  // Fetch general couriers on mount to show the list even before address selection
  useEffect(() => {
    async function loadInitialCouriers() {
      try {
        const res = await getCouriers();
        if (res && res.success && res.data) {
          setLiveCouriers(res.data);
        }
      } catch (err) {
        console.error("Failed to load initial couriers:", err);
      }
    }
    loadInitialCouriers();
  }, []);

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

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const openAddAddress = () => setIsAddingAddress(true);
  const closeAddAddress = () => setIsAddingAddress(false);

  const shippingAddresses = normalizeListData<any>(shippingAddress);

  const queryClient = useQueryClient();

  // Logistics Live Rate Fetching
  useEffect(() => {
    const fetchLiveRates = async () => {
      if (shippingMethod !== "shipping") return;
      if (!shippingAddressId || !cart?.data?.items || cart.data.items.length === 0) return;

      setIsLiveRatesLoading(true);
      try {
        const packageItems = cart.data.items.map((it: any) => ({
          name: it.product?.name || 'Item',
          description: it.product?.name || 'Item',
          unit_weight: it.product?.weightKg ? String(it.product.weightKg) : "0",
          unit_amount: it.product?.price ? String(it.product.price) : "0",
          quantity: String(it.quantity || 1),
        }));

        const products = cart.data.items.map((it: any) => it.product).filter(Boolean);
        if (products.length === 0) return;

        const packageDimension = {
          length: Math.max(...products.map((p: any) => Number(p.lengthCm || 0))),
          width: Math.max(...products.map((p: any) => Number(p.widthCm || 0))),
          height: Math.max(...products.map((p: any) => Number(p.heightCm || 0))),
        };

        const firstProduct = products[0];
        const logisticsCategoryId = firstProduct?.logisticsCategoryId;

        const payload = {
          shippingAddressId,
          packageItems,
          packageDimension,
          categoryId: logisticsCategoryId,
        };

        const res = await fetchRates(payload);
        if (res && res.success !== false && res.data) {
          const data = res.data;
          setRequestToken(data.request_token || null);
          setLiveCouriers(Array.isArray(data.couriers) ? data.couriers : []);

          // Auto-select first courier
          if (data.couriers && data.couriers.length > 0) {
            setSelectedCourier(data.couriers[0]);
          }
        } else {
          setLiveCouriers([]);
          const errorMsg = res?.message || 'No couriers available for this address';
          toast.error(errorMsg);
        }
      } catch (err) {
        console.error('Failed to fetch live rates:', err);
        toast.error('Unable to fetch shipping rates at the moment');
      } finally {
        setIsLiveRatesLoading(false);
      }
    };

    fetchLiveRates();
  }, [shippingAddressId, cart, shippingMethod]);

  const handleCourierSelect = (courier: SelectedCourier, key: string) => {
    setSelectedCourier(courier);
    try {
      sessionStorage.setItem("selectedCourier", JSON.stringify(courier));
    } catch (err) {
      console.warn("Failed to persist selectedCourier.", err);
    }
  };

  const { data: pickupStationResponse, isLoading: isFetchingPickupStations } =
    useQuery({
      queryKey: ["pickupStations"],
      queryFn: getPickupStations,
    });

  const pickupStations = normalizeListData<PickupStation>(pickupStationResponse);
  const items = cart?.data?.items ?? [];
  const subtotal = Number(cart?.data?.totalAmount ?? 0);

  const shippingFee = shippingMethod === "shipping" ? Number(selectedCourier?.fee ?? selectedCourier?.price ?? 0) : 0;
  const totalAmount = subtotal + shippingFee;

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="big" />
      </div>
    );

  async function onSubmit(data: TCheckoutSchema) {
    let selectedCourierFinal = selectedCourier;

    if (data.shippingMethod === "shipping") {
      if (!selectedCourierFinal) {
        toast.error("Please select a shipping option before proceeding.");
        return;
      }
    }

    try {
      const payload = {
        shippingAddressId: data.shippingAddressId || "",
        notes: data.notes || "",
        gateway: data.gateway,
        phone: data.phone,
        shippingMethod: data.shippingMethod as "pickup" | "shipping",
        chosenStationId: data.chosenStationId || undefined,
        ...(selectedCourierFinal && data.shippingMethod === "shipping"
          ? {
              courierId: String(
                selectedCourierFinal.id || selectedCourierFinal.courierId || selectedCourierFinal.courier_id
              ),
              requestToken:
                requestToken ||
                selectedCourierFinal.requestToken ||
                selectedCourierFinal.request_token ||
                selectedCourierFinal.request_token_value ||
                selectedCourierFinal.requestTokenValue ||
                undefined,
              serviceCode:
                selectedCourierFinal.serviceCode ||
                selectedCourierFinal.service_code ||
                selectedCourierFinal.serviceCodeValue ||
                undefined,
              shippingFee: Number(selectedCourierFinal.fee ?? selectedCourierFinal.price ?? 0),
              courierName: selectedCourierFinal.name || selectedCourierFinal.courierName || "",
              deliveryEta:
                typeof selectedCourierFinal.estimated_days === "number" || typeof selectedCourierFinal.estimated_days === "string"
                  ? String(selectedCourierFinal.estimated_days)
                  : typeof selectedCourierFinal.estimatedDays === "number" || typeof selectedCourierFinal.estimatedDays === "string"
                    ? String(selectedCourierFinal.estimatedDays)
                    : undefined,
            }
          : {}),
      };

      const success = await createOrder(payload);

      if (success) {
        toast.success(success.message);
        toast.success("Redirecting to payment...");

        setTimeout(() => {
          window.location.href = success.paymentUrl;
        }, 1500);
      }
    } catch (err: unknown) {
      // Error is already handled by axiosInstance interceptor (toast.error)
      console.error("Checkout error:", err);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-start justify-center bg-[#fbf8ff] px-4 py-10">
      <div className="grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Left Column: Checkout Form */}
        <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-xs font-medium text-green-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">✓</span>
              Shipping Address
            </div>
            <div className="h-px w-8 bg-gray-300" />
            <div className="flex items-center gap-2 text-xs font-medium text-orange-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-white">2</span>
              Shipping & Payment
            </div>
            <div className="h-px w-8 bg-gray-300" />
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-white">3</span>
              Confirmation
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Shipping Method */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-primary text-lg font-semibold text-gray-800">Shipping Method</h2>
                <span className="text-xs text-gray-400">Step 2 of 3</span>
              </div>
              <p className="text-sm text-gray-600">Choose how you'd like your items to be delivered.</p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${shippingMethod === "shipping" ? "border-orange bg-orange/5" : "border-gray-200 hover:bg-gray-50"}`}>
                  <input
                    type="radio"
                    value="shipping"
                    className="h-4 w-4 text-orange focus:ring-orange"
                    {...register("shippingMethod")}
                  />
                  <div>
                    <span className="block font-semibold text-gray-800">Home Delivery</span>
                    <span className="block text-xs text-gray-500">Shipping with a courier.</span>
                  </div>
                </label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${shippingMethod === "pickup" ? "border-orange bg-orange/5" : "border-gray-200 hover:bg-gray-50"}`}>
                  <input
                    type="radio"
                    value="pickup"
                    className="h-4 w-4 text-orange focus:ring-orange"
                    {...register("shippingMethod")}
                  />
                  <div>
                    <span className="block font-semibold text-gray-800">Pickup Station</span>
                    <span className="block text-xs text-gray-500">Collect from a nearby station.</span>
                  </div>
                </label>
              </div>
              {errors.shippingMethod && <p className="text-xs text-red-500">{errors.shippingMethod.message}</p>}
            </div>

            {/* Section 2: Address/Station Selection */}
            <div className="space-y-4">
              {shippingMethod === "shipping" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">Delivery Address</h3>
                    <div className="flex items-center gap-3">
                      <Link to="/checkout/address" className="text-xs text-gray-500 hover:text-orange hover:underline">Manage Addresses</Link>
                      <button type="button" onClick={openAddAddress} className="text-xs text-orange hover:underline">+ Add Address</button>
                    </div>
                  </div>

                  {IsFetchingAddress ? (
                    <div className="flex justify-center py-4"><Spinner size="small" /></div>
                  ) : shippingAddresses.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center text-xs text-gray-500">
                      No addresses found. Please add one.
                    </div>
                  ) : (
                    <div className="max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="grid gap-3">
                        {shippingAddresses.map((addr: any) => (
                          <label key={addr.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${shippingAddressId === String(addr.id) ? "border-orange bg-orange/5" : "border-gray-200 hover:bg-gray-50"}`}>
                            <input
                              type="radio"
                              value={addr.id}
                              {...register("shippingAddressId")}
                              className="mt-1 text-orange focus:ring-orange"
                            />
                            <div className="text-sm">
                              <span className="font-semibold block">{addr.addressLine1 || addr.line1 || addr.name || "Unnamed Address"}</span>
                              <span className="text-xs text-gray-500 block">{[addr.line1, addr.city, addr.state].filter(Boolean).join(', ')}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.shippingAddressId && <p className="text-xs text-red-500">{errors.shippingAddressId.message}</p>}

                  {/* Courier Selector - Always visible now */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-700">Select Courier</h3>
                      {!shippingAddressId && (
                        <span className="text-[10px] text-orange italic">Select address to see actual rates</span>
                      )}
                    </div>
                    <CourierSelector
                      couriers={liveCouriers}
                      selectedCourierId={selectedCourier ? getCourierKey(selectedCourier) : null}
                      onSelect={handleCourierSelect}
                      isLoading={isLiveRatesLoading}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Select Pickup Station</h3>
                  {isFetchingPickupStations ? (
                    <div className="flex justify-center py-4"><Spinner size="small" /></div>
                  ) : (
                    <select
                      {...register("chosenStationId")}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-orange focus:border-orange outline-none"
                    >
                      <option value="">-- Choose a station --</option>
                      {pickupStations.map(s => <option key={s.id} value={s.id}>{s.name} — {s.address}</option>)}
                    </select>
                  )}
                  {errors.chosenStationId && <p className="text-xs text-red-500">{errors.chosenStationId.message}</p>}
                </div>
              )}
            </div>

            {/* Section 3: Customer Details */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Phone Number</label>
                <input
                  {...register("phone")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-orange focus:border-orange outline-none"
                  placeholder="+234 ..."
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Notes (Optional)</label>
                <input
                  {...register("notes")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-orange focus:border-orange outline-none"
                  placeholder="Delivery instructions..."
                />
              </div>
            </div>

            {/* Section 4: Payment Gateway */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Payment Gateway</h3>
              <PaymentGatewaySelector
                selectedGateway={watch("gateway")}
                onSelect={(val) => setValue("gateway", val)}
              />
              {errors.gateway && <p className="text-xs text-red-500">{errors.gateway.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-orange py-4 font-bold text-white transition hover:bg-orange/90 disabled:opacity-50 shadow-lg shadow-orange/20"
            >
              {isSubmitting ? <Spinner size="small" /> : "Complete Payment"}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <OrderSummarySidebar
          items={items}
          subtotal={subtotal}
          shippingFee={shippingFee}
          isSubmitting={isSubmitting}
          onSubmit={() => handleSubmit(onSubmit)()}
        />
      </div>

      <AddAddressModal
        isOpen={isAddingAddress}
        onClose={closeAddAddress}
        onSuccess={() => {}}
      />
    </main>
  );
}
