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
  raw?: any;
};

type CourierSelectorProps = {
  couriers: Courier[];
  selectedCourierId: string | null;
  onSelect: (courier: Courier, key: string) => void;
  isLoading?: boolean;
};

export function getCourierKey(c: any, idx?: number) {
  return String(c.id ?? c.serviceCode ?? c.service_code ?? c.request_token ?? idx ?? "");
}

export default function CourierSelector({
  couriers,
  selectedCourierId,
  onSelect,
  isLoading = false,
}: CourierSelectorProps) {
  if (isLoading && (!couriers || couriers.length === 0)) {
    return (
      <div className="flex items-center gap-3 rounded-lg border p-4">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange border-t-transparent" />
        <div className="text-sm text-gray-600">Fetching courier rates...</div>
      </div>
    );
  }

  if (!couriers || couriers.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-orange/10 p-4 text-orange text-sm">
        No couriers available right now
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {couriers.map((c, idx) => {
        const courierKey = getCourierKey(c, idx);
        const isSelected = courierKey === String(selectedCourierId);
        return (
          <button
            key={courierKey}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onSelect(c, courierKey);
            }}
            className={`flex w-full cursor-pointer items-center justify-between rounded-lg border p-4 text-left transition ${
              isSelected ? "border-orange bg-orange/10 shadow-sm ring-1 ring-orange" : "border-gray-200 bg-white hover:bg-slate-50"
            } ${isLoading ? "opacity-60 pointer-events-none" : ""}`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`mt-1 h-5 w-5 rounded-full border-2 flex-shrink-0 ${
                  isSelected ? "border-orange bg-orange" : "border-gray-300"
                }`}
              />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{c.name || c.courierName || "Courier"}</h3>
                  {c.recommended && (
                    <span className="rounded bg-orange/80 px-2 py-0.5 text-[10px] text-white">Recommended</span>
                  )}
                  {c.cheapest && (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] text-green-800">Cheapest</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-600 line-clamp-1">{c.description || c.serviceCode || "Standard delivery"}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Shipping Fee</span>
                    {isLoading ? (
                      <div className="flex items-center gap-2 text-lg font-black text-orange">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange border-t-transparent" />
                        <span></span>
                      </div>
                    ) : (
                      <span className="text-lg font-black text-orange">
                        ₦{(Number(c.fee ?? c.price) || c.raw?.total || 0).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500 border-l pl-3 sm:pl-4 flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Delivery ETA</span>
                    <span className="text-xs font-medium text-gray-700">
                      {(() => {
                        const eta = c.estimated_days ?? c.estimatedDays ?? c.raw?.delivery_eta ?? "2-5";
                        const text = String(eta);
                        // Only append "days" for plain numeric ETAs; provider
                        // strings like "Within 2 - 3 working days" already have it.
                        return /^\d+(\.\d+)?$/.test(text.trim()) ? `${text} days` : text;
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-gray-500">{c.type || "Courier"}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
