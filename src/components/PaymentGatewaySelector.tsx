import React from "react";

type PaymentGatewaySelectorProps = {
  selectedGateway: string;
  onSelect: (gateway: string) => void;
};

export default function PaymentGatewaySelector({
  selectedGateway,
  onSelect,
}: PaymentGatewaySelectorProps) {
  const gateways = [
    { id: "paystack", name: "paystack", img: "paystack-2.svg" },
    { id: "flutterwave", name: "flutterwave", img: "flutterwave-1.svg" },
    { id: "paypal", name: "PayPal", img: "paypal-3.svg" },
  ];

  return (
    <div className="mt-4 flex w-full flex-wrap items-center gap-5">
      {gateways.map((gw) => (
        <label key={gw.id} className="relative cursor-pointer">
          <input
            type="radio"
            name="gateway"
            value={gw.id}
            checked={selectedGateway === gw.id}
            onChange={() => onSelect(gw.id)}
            className="peer hidden"
          />
          <div
            className={`flex h-[80px] w-[130px] items-center justify-center border transition-all duration-200 ${
              selectedGateway === gw.id
                ? "border-transparent bg-gray-200"
                : "border-gray-500/50 hover:border-gray-400"
            }`}
          >
            <img className="w-[100px]" src={gw.img} alt={gw.name} />
          </div>
        </label>
      ))}
    </div>
  );
}
