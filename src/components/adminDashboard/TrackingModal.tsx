import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrderInvoice } from "../../services/apiOrders";
import Spinner from "../../components/Spinner";
import { FiTruck, FiMapPin, FiCheckCircle } from "react-icons/fi";

type TrackingEvent = {
  status: string;
  location: string;
  timestamp: string;
  note?: string;
};

type InvoiceData = {
  order: {
    id: string;
    createdAt: string;
    customer: { fullName: string };
    shippingDetails: {
      status: string;
      trackingUrl: string;
      events: TrackingEvent[];
    };
  };
};

export default function TrackingModal({ orderId, onClose }: { orderId: string; onClose?: () => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ["orderInvoice", orderId],
    queryFn: () => getOrderInvoice(orderId),
  });

  if (isLoading) return <div className="p-10 flex justify-center"><Spinner /></div>;
  if (!data?.data) return <div className="p-10 text-center text-gray-500">Tracking information unavailable.</div>;

  const { order } = data.data;
  const events = order.shippingDetails.events || [];
  const currentStatus = order.shippingDetails.status || "pending";
  const isDelivered = currentStatus.toLowerCase() === "delivered";

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shipment Tracking</h2>
          <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          isDelivered ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
        }`}>
          {currentStatus.replace(/_/g, " ")}
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
            <FiTruck size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Current Status</p>
            <p className="text-sm font-bold text-gray-900">{currentStatus.replace(/_/g, " ")}</p>
          </div>
        </div>
        {order.shippingDetails.trackingUrl && (
          <a
            href={order.shippingDetails.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
          >
            View Official Courier Portal <FiExternalLink size={12} />
          </a>
        )}
      </div>

      <div className="relative pl-8 space-y-12">
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200" />
        {events.length > 0 ? (
          events.map((event, i) => (
            <div key={i} className="relative flex items-start gap-6">
              <div className={`absolute -left-7 top-0 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold transition-all ${
                i === 0 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {i === 0 ? <FiCheckCircle size={12} /> : i + 1}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{event.status.replace('_', ' ')}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{event.timestamp}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FiMapPin size={12} /> {event.location}
                </div>
                {event.note && <p className="text-xs text-gray-400 mt-1">{event.note}</p>}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 italic">
            No tracking events recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}

// Add FiExternalLink to imports for the link
function FiExternalLink({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
