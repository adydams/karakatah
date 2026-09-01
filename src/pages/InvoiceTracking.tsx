import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getOrderInvoice } from "../services/apiOrders";
import Spinner from "../components/Spinner";
import { FaWhatsapp, FaEnvelope, FaShareAlt, FaDownload } from "react-icons/fa";

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  note?: string;
}

interface ShippingDetails {
  totalFee: number;
  baseFee: number;
  sourcingFee: number;
  status: string;
  trackingUrl: string | null;
  events: TrackingEvent[];
}

interface InvoiceData {
  id: string;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
  };
  shippingFee: number;
  shippingDetails: ShippingDetails;
}

export default function InvoiceTracking() {
  const { orderId } = useParams();
  const [data, setData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await getOrderInvoice(orderId!);
        setData(res.data?.order);
      } catch (err) {
        console.error("Error fetching invoice:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [orderId]);

  const handleDownloadPdf = async () => {
    try {
      const envValue = import.meta.env.VITE_API_URL?.trim();
      const apiBaseUrl = envValue ? envValue.replace(/\/$/, "") : (window.location.hostname === "localhost" ? "http://localhost:5000" : "https://karakatanodebe.onrender.com");
      const response = await fetch(`${apiBaseUrl}/api/orders/invoice/${orderId}/pdf`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!response.ok) throw new Error("PDF download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${orderId?.slice(0, 8)}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download PDF");
    }
  };

  const shareInvoice = (platform: 'whatsapp' | 'email' | 'link') => {
    const shareUrl = `${window.location.href}`;
    const text = `Check out my order invoice #${orderId?.slice(0, 8)} from Karakata Commerce: ${shareUrl}`;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=My Order Invoice #${orderId?.slice(0, 8)}&body=${encodeURIComponent(text)}`;
    } else if (platform === 'link') {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
    setShowShareMenu(false);
  };

  if (loading) return <Spinner type="big" />;
  if (!data) return <div className="p-10 text-center text-red-500">Invoice not found.</div>;

  return (
    <div className="font-primary w-full p-4 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-10 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-600 rounded-xl text-white shadow-sm">
               <FaDownload size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">Invoice & Tracking</h1>
              <p className="text-gray-500">Order #{data.id.slice(0, 8)} • {new Date(data.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex gap-3 relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <FaShareAlt size={14} />
              Share
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 text-sm font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition shadow-md flex items-center gap-2"
            >
              <FaDownload size={14} />
              Download PDF
            </button>

            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2">
                <button
                  onClick={() => shareInvoice('whatsapp')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                >
                  <FaWhatsapp className="text-green-500" size={16} /> WhatsApp
                </button>
                <button
                  onClick={() => shareInvoice('email')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                >
                  <FaEnvelope className="text-blue-500" size={16} /> Email
                </button>
                <button
                  onClick={() => shareInvoice('link')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                >
                  <FaShareAlt className="text-gray-500" size={16} /> Copy Link
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Customer and Fee Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Customer Details */}
            <section>
              <h3 className="text-sm uppercase font-bold text-gray-400 mb-4 tracking-wider">Customer Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <p className="text-xs text-gray-400 mb-1">Full Name</p>
                  <p className="font-semibold text-gray-800 break-words">{data.customer?.fullName || "N/A"}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <p className="font-medium text-gray-800 break-all">{data.customer?.email || "N/A"}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-gray-400 mb-1">Phone</p>
                  <p className="font-medium text-gray-800 break-all">{data.customer?.phone || "N/A"}</p>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h3 className="text-sm uppercase font-bold text-gray-400 mb-4 tracking-wider">Shipping Address</h3>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-800 font-medium">{data.shippingAddress?.address || "No address provided"}</p>
              </div>
            </section>

            {/* Fee Breakdown */}
            <section>
              <h3 className="text-sm uppercase font-bold text-gray-400 mb-4 tracking-wider">Fee Breakdown</h3>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Base Courier Fee</td>
                      <td className="px-4 py-3 text-sm font-medium text-right text-gray-800">₦{data.shippingDetails?.baseFee?.toLocaleString() || 0}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Sourcing / Fetch Fee</td>
                      <td className="px-4 py-3 text-sm font-medium text-right text-gray-800">₦{data.shippingDetails?.sourcingFee?.toLocaleString() || 0}</td>
                    </tr>
                    <tr className="bg-orange-50">
                      <td className="px-4 py-3 text-sm font-bold text-gray-800">Total Shipping</td>
                      <td className="px-4 py-3 text-sm font-bold text-right text-orange-600">₦{data.shippingFee?.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Tracking Timeline */}
          <div className="lg:col-span-1">
            <h3 className="text-sm uppercase font-bold text-gray-400 mb-6 tracking-wider">Shipment Progress</h3>
            <div className="relative space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {data.shippingDetails?.events?.length > 0 ? data.shippingDetails.events.map((event, index) => (
                <div key={index} className="relative pl-10">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm ${
                    index === 0 ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-gray-800">{event.status}</p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(event.timestamp).toLocaleString()}</p>
                    {event.note && <p className="text-xs text-gray-600 italic mt-1">{event.note}</p>}
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-gray-400 text-sm italic">
                  No tracking events available yet.
                </div>
              )}
            </div>
            <div className="mt-10 p-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
              <p className="text-xs text-orange-600 font-medium mb-2">Current Status</p>
              <p className="text-lg font-black text-orange-800 uppercase">{data.shippingDetails?.status || 'Processing'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
