import React from "react";
import { useModal } from "../../contexts/hooks/useModal";
import InvoiceTracking from "../../pages/InvoiceTracking";

type Props = {
  orderId: string;
};

export default function InvoiceModal({ orderId }: Props) {
  const { closeModal } = useModal();

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full shadow-lg border border-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
      >
        <span className="text-2xl font-bold">&times;</span>
      </button>
      <div className="invoice-modal-background rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <InvoiceTracking orderId={orderId} />
      </div>
    </div>
  );
}
