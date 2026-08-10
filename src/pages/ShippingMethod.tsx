import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import { getCouriers } from "../services/apiLogistics";
import { getCart } from "../services/apiCarts";
import { formatPrice, normalizeListData } from "../utils/utils";

export default function ShippingMethod() {
  const navigate = useNavigate();
  const { data: cart, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!localStorage.getItem("token"),
  });

  const { data: courierResponse, isLoading: isCouriersLoading } = useQuery({
    queryKey: ["couriers"],
    queryFn: getCouriers,
  });

  type Courier = {
    id: string | number;
    name?: string;
    fee?: number;
    price?: number;
    estimated_days?: string | number;
    estimatedDays?: string | number;
    description?: string;
    serviceCode?: string;
    recommended?: boolean;
    cheapest?: boolean;
    type?: string;
    courierName?: string;
  };

  type CartItemType = {
    id: string;
    quantity: number;
    product?: { name?: string; price?: number };
  };

  const couriers = normalizeListData<Courier>(courierResponse);
  const items = (cart?.data?.items ?? []) as CartItemType[];
  const subtotal = Number(cart?.data?.totalAmount ?? 0);

  const [selectedCourierId, setSelectedCourierId] = useState<string | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);

  useEffect(() => {
    if (!selectedCourierId) return;
    const found = couriers.find((c) => String(c.id) === String(selectedCourierId));
    setSelectedCourier(found || null);
  }, [selectedCourierId, couriers]);


  if (isCartLoading || isCouriersLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="big" />
      </div>
    );

  function handleContinueToPayment() {
    if (!selectedCourier) return alert("Please select a shipping option.");

    // navigate to checkout/pass selected courier in state so checkout can complete order
    navigate("/checkout", { state: { courier: selectedCourier } });
  }

  return (
    <section className="flex w-full items-start justify-center pt-14 pb-10 lg:py-7">
      <div className="grid h-full w-[92%] grid-cols-1 gap-5 lg:w-[85%] lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg bg-white px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Select Shipping Method</h1>
            <div className="text-sm text-gray-500">Step 2 of 3</div>
          </div>

          <p className="mt-3 text-sm text-gray-600">Choose how you'd like your items to be delivered. Estimates shown below are sample estimates from couriers.</p>

          <div className="mt-6 grid gap-4">
            {couriers.length ? (
              couriers.map((c) => (
                <label key={String(c.id)} className={`flex items-center justify-between rounded-lg border p-4 ${String(c.id) === String(selectedCourierId) ? "border-orange/80 bg-orange/10" : "border-gray-200"}`}>
                  <div className="flex items-start gap-4">
                    <input type="radio" name="courier" value={String(c.id)} checked={String(c.id) === String(selectedCourierId)} onChange={() => setSelectedCourierId(String(c.id))} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{c.name || c.courierName || "Courier"}</h3>
                        {c.recommended && <span className="text-xs bg-orange/80 text-white rounded px-2 py-0.5">Recommended</span>}
                        {c.cheapest && <span className="text-xs bg-green-100 text-green-800 rounded px-2 py-0.5">Cheapest</span>}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{c.description || c.serviceCode || "Standard delivery"}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-700">
                        <div className="font-semibold">₦{formatPrice(c.fee ?? c.price ?? 0)}</div>
                        <div className="text-xs text-gray-500">Est. {c.estimated_days ?? c.estimatedDays ?? "2-5"} business days</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{c.type || "Courier"}</div>
                  </div>
                </label>
              ))
            ) : (
              <div className="rounded-lg border border-gray-200 bg-orange/10 p-4 text-orange">No couriers available right now</div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="text-sm text-gray-600">&larr; Back to Cart</button>
            <button onClick={handleContinueToPayment} className="bg-orange/90 hover:bg-orange text-white rounded px-6 py-2">Continue to Payment</button>
          </div>
        </div>

        <aside className="rounded-lg bg-white px-4 py-4">
          <h2 className="text-base font-semibold">Order Summary</h2>
          <div className="mt-3 space-y-3">
            {items.map((it: CartItemType) => (
              <div key={it.id} className="flex items-center justify-between text-sm text-gray-700">
                <div>
                  <div className="font-medium">{it.product?.name}</div>
                  <div className="text-xs text-gray-500">Qty: {it.quantity}</div>
                </div>
                <div className="font-semibold">₦{formatPrice(Number(it.product?.price || 0) * Number(it.quantity || 0))}</div>
              </div>
            ))}
          </div>

          <div className="border-dark-gray/10 mt-4 flex items-center justify-between border-t pt-3 text-sm">
            <p>Items total</p>
            <p className="font-primary text-base font-semibold">₦{formatPrice(subtotal)}</p>
          </div>

          <div className="mt-3 text-sm">
            <p className="text-gray-500">Choose a shipping option to see final total.</p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-600">Shipping</p>
                <p className="font-semibold">{selectedCourier ? `₦${formatPrice(selectedCourier.fee ?? 0)}` : "—"}</p>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <p className="text-gray-600">Total</p>
                <p className="font-bold text-orange">₦{formatPrice(subtotal + (selectedCourier?.fee || 0))}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
