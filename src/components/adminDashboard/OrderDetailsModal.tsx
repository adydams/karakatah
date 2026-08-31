import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrderInvoice } from "../../services/apiOrders";
import Spinner from "../Spinner";
import { useModal } from "../../contexts/hooks/useModal";
import {
  FaBox, FaTruck, FaFileInvoice, FaUser,
  FaCalendarAlt, FaCreditCard, FaTimes, FaDownload
} from "react-icons/fa";

type OrderDetailsModalProps = {
  orderId: string;
  initialTab?: "details" | "tracking" | "invoice";
};

export default function OrderDetailsModal({ orderId, initialTab = "details" }: OrderDetailsModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { closeModal } = useModal();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["orderDetail", orderId],
    queryFn: () => getOrderInvoice(orderId),
  });

  if (isLoading) return <div className="p-10 flex justify-center"><Spinner /></div>;
  if (isError || !response || !response.data) return <div className="p-10 text-center text-red-500">Error loading order details.</div>;

  const { order, items, payment } = response.data;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200"
    >
      {/* Modal Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
            <FaBox size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
            <p className="text-xs text-gray-500">Order #{order.id.slice(0, 12)}</p>
          </div>
        </div>
        <button
          onClick={closeModal}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 bg-white border-b border-gray-100">
        <div className="flex gap-8">
          {[
            { id: "details", label: "Details", icon: <FaBox size={16} /> },
            { id: "tracking", label: "Tracking", icon: <FaTruck size={16} /> },
            { id: "invoice", label: "Invoice", icon: <FaFileInvoice size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 text-sm font-semibold transition-all relative ${
                activeTab === tab.id ? "text-orange-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-t-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 overflow-y-auto bg-gray-50/30 flex-1">
        {activeTab === "details" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <FaUser size={14} className="text-orange-500" /> Customer Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-800">{order.customer.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-800">{order.customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-800">{order.customer.phone}</span>
                </div>
                <div className="flex flex-col gap-1 pt-2 border-t border-gray-50">
                  <span className="text-gray-500 text-xs">Shipping Address</span>
                  <span className="font-medium text-gray-800 text-xs">{order.shippingAddress?.address}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <FaCreditCard size={14} className="text-orange-500" /> Payment Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="font-bold text-gray-800">₦{order.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping Fee</span>
                  <span className="font-medium text-gray-800">₦{order.shippingFee?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    payment?.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {payment?.status || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-bold text-gray-800">Ordered Items</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3 text-center">Qty</th>
                    <th className="px-5 py-3 text-right">Price</th>
                    <th className="px-5 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-800">{item.product.name}</td>
                      <td className="px-5 py-4 text-center text-gray-600">{item.quantity}</td>
                      <td className="px-5 py-4 text-right text-gray-600">₦{item.price}</td>
                      <td className="px-5 py-4 text-right font-bold text-gray-800">₦{item.subtotal?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "tracking" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-gray-800">Shipment Progress</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                order.logisticsStatus === 'DELIVERED' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {order.logisticsStatus}
              </span>
            </div>

            <div className="relative space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {order.shippingDetails?.events?.length > 0 ? (
                order.shippingDetails.events.map((event: any, idx: number) => (
                  <div key={idx} className="relative pl-10">
                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm ${
                      idx === 0 ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-gray-800">{event.status}</p>
                      <p className="text-xs text-gray-500">{event.location}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(event.timestamp).toLocaleString()}</p>
                      {event.note && <p className="text-xs text-gray-600 italic mt-1">{event.note}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400 text-sm italic">
                  No tracking events available yet.
                </div>
              )}
            </div>
            <div className="mt-10 p-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
              <p className="text-xs text-orange-600 font-medium mb-2">Current Status</p>
              <p className="text-lg font-black text-orange-800 uppercase">{order.shippingDetails?.status || 'Processing'}</p>
            </div>
          </div>
        )}

        {activeTab === "invoice" && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm font-sans max-w-3xl mx-auto">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">K</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Karakata Marketplace</h2>
                  <p className="text-xs text-gray-500">Lagos, Nigeria</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-black text-gray-200 uppercase tracking-tighter">Invoice</h2>
                <p className="text-sm font-medium text-gray-500">#{order.id.slice(0, 8)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-10">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-wider">Bill To</p>
                <div className="text-sm space-y-1">
                  <p className="font-bold text-gray-800">{order.customer.fullName}</p>
                  <p className="text-gray-600">{order.customer.email}</p>
                  <p className="text-gray-600">{order.customer.phone}</p>
                  <p className="text-gray-600 max-w-[200px]">{order.shippingAddress?.address}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-wider">Order Date</p>
                <p className="text-sm font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}</p>
              </div>
            </div>

            <div className="mb-10">
              <div className="grid grid-cols-12 gap-4 py-3 border-b-2 border-gray-100 text-[10px] uppercase font-bold text-gray-400 mb-4">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              <div className="space-y-4">
                {items.map((item: any) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 py-2 items-center text-sm">
                    <div className="col-span-6 font-medium text-gray-800">{item.product.name}</div>
                    <div className="col-span-2 text-center text-gray-600">{item.quantity}</div>
                    <div className="col-span-2 text-right text-gray-600">₦{item.price}</div>
                    <div className="col-span-2 text-right font-bold text-gray-800">₦{item.subtotal?.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full max-w-[280px] space-y-3 bg-gray-50 p-5 rounded-2xl">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sub Total</span>
                  <span className="font-medium text-gray-800">₦{(order.totalAmount - order.shippingFee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping Fee</span>
                  <span className="font-medium text-gray-800">₦{order.shippingFee?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 mt-3 text-orange-600">
                  <span>Grand Total</span>
                  <span>₦{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center gap-4">
              <button
                onClick={() => window.open(`/api/orders/invoice/${order.id}/pdf`, "_blank")}
                className="px-8 py-3 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-black transition-all shadow-lg flex items-center gap-2"
              >
                <FaDownload size={16} />
                Download Official PDF
              </button>
              <p className="text-[10px] text-gray-400 italic">Thank you for choosing Karakata Marketplace!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
