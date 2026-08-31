import React from "react";
import { FaEye, FaFileDownload } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";

type OrderCardProps = {
  order: {
    id: string;
    createdAt: string;
    totalAmount: number;
    status: string;
    logisticsStatus: string;
    customer: {
      name: string;
    };
    items: {
      product: {
        name: string;
        images: { url: string }[];
      };
      quantity: number;
      variants: string; // e.g., "Color: Space Grey"
    }[];
    storeName?: string; // Only for SuperAdmin
  };
  onAction: (id: string, action: "details" | "tracking" | "invoice") => void;
};

export default function OrderCard({ order, onAction }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-600";
      case "PAID":
        return "bg-blue-100 text-blue-600";
      case "PENDING":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow mb-4">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-12">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Order Number</p>
            <p className="font-bold text-gray-800">#{order.id.slice(0, 10)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Date Placed</p>
            <p className="font-medium text-gray-700">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Amount</p>
            <p className="font-bold text-gray-800">₦{order.totalAmount?.toLocaleString()}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyles(order.status)}`}>
          {order.status}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col sm:flex-row gap-6">
        <div className="h-24 w-24 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
          {order.items[0]?.product?.images?.[0]?.url ? (
            <img
              src={order.items[0].product.images[0].url}
              alt={order.items[0].product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-300">
              No Image
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{order.items[0]?.product?.name}</h3>
              <p className="text-sm text-gray-500">
                Qty: {order.items[0]?.quantity} • {order.items[0]?.variants || "No variants"}
              </p>
              {order.storeName && (
                <p className="text-xs text-orange-600 font-medium mt-1">Store: {order.storeName}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onAction(order.id, "details")}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <FaEye size={12} /> View Details
              </button>
              <button
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                onClick={() => onAction(order.id, "invoice")}
              >
                <FaFileDownload size={12} /> Invoice
              </button>
            </div>
          </div>

          {order.status === "PAID" && order.logisticsStatus === "PROCESSING" && (
            <button
              onClick={() => onAction(order.id, "tracking")}
              className="mt-4 px-6 py-2 bg-[#f57c00] text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm"
            >
              Track Shipment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
