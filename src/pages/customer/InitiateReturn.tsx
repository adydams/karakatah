import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { apiReturn } from "../../services/apiReturns";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";
import { FiUpload, FiX, FiCheckCircle, FiAlertCircle, FiShield, FiBox, FiMapPin, FiCalendar, FiChevronRight } from "react-icons/fi";
import CustomerChrome from "../../components/customer/CustomerChrome";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedDiscounts } from "../../services/apiProducts";
import RecommendationBanner from "../../components/customer/RecommendationBanner";

interface ItemData {
  id: string;
  product: {
    name: string;
    price: number;
    images: { url: string }[];
    category: { name: string };
    sku?: string;
  };
  quantity: number;
  order: {
    id: string;
    createdAt: string;
    deliveredDate: string;
    totalAmount: number;
  };
  station: {
    name: string;
    address: string;
  };
}

export default function InitiateReturn() {
  const location = useLocation();
  const navigate = useNavigate();

  const item = location.state?.item as ItemData || null;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reason: "defective",
    description: "",
    evidence: [] as { file: File; preview: string }[],
    method: "drop-off",
    stationId: "hub_001",
  });
  const { data: featuredProducts } = useQuery({
    queryKey: ["returnFeaturedProducts"],
    queryFn: getFeaturedDiscounts,
    staleTime: 60000,
  });

  if (!item) {
    return (
      <>
      <CustomerChrome />
      <div className="flex h-screen w-full items-center justify-center bg-[#f8f9ff] p-4 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
            <FiAlertCircle size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Item Not Found</h1>
          <p className="text-gray-500">We couldn't find the item details for this return request. Please go back to your orders and try again.</p>
          <button
            onClick={() => navigate("/customer/orders")}
            className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:bg-orange-700 transition-all"
          >
            Back to My Orders
          </button>
        </div>
      </div>
      </>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFormData(prev => ({ ...prev, evidence: [...prev.evidence, ...newFiles] }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formDataPayload = new FormData();
      formDataPayload.append("orderItemId", item.id);
      formDataPayload.append("reason", formData.reason);
      formDataPayload.append("description", formData.description);
      formDataPayload.append("method", formData.method);
      formDataPayload.append("pickupStationId", formData.stationId);

      formData.evidence.forEach((item) => {
        formDataPayload.append("evidence", item.file);
      });

      const res = await apiReturn.createReturnRequest(formDataPayload);

      if (res && res.success && res.data && res.data.id) {
        toast.success("Return request submitted successfully!");
        navigate(`/customer/returns/status/${res.data.id}`);
      } else {
        throw new Error("Return request was created but no valid ID was returned by the server.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit return";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <CustomerChrome />
    <div className="min-h-screen bg-[#f8f9ff] px-3 pb-12 pt-20 font-sans text-[#0b1c30] sm:px-5 sm:pt-24 lg:px-20 lg:pb-20">
      <div className="mx-auto max-w-7xl min-w-0 space-y-5 sm:space-y-8">
        {/* Breadcrumbs & Status Bar */}
        <div className="flex flex-col gap-4">
          <nav className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm">
            <a href="/customer/orders" className="hover:text-orange-500 transition-colors">My Orders</a>
            <FiChevronRight size={14} className="text-gray-400" />
            <a href="/customer/orders" className="max-w-[180px] truncate hover:text-orange-500 transition-colors">Order #{item.order?.id || 'N/A'}</a>
            <FiChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-900 font-semibold">Return Item</span>
          </nav>

          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 md:flex-row md:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight sm:text-xl">Request Item Return</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  5-Day Return Window Active
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
                Returns are processed per delivered item. Full refund of <strong className="text-gray-900 font-semibold">₦{Number(item.product.price).toLocaleString()}</strong> will be credited to your original payment method upon technical inspection.
              </p>
            </div>
            <div className="flex w-full shrink-0 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 md:w-auto">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <FiShield size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Inspection SLA</span>
                <span className="text-xs font-bold text-orange-600">Under 24-Hour Review</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-6">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100 sm:h-32 sm:w-32">
            <img src={item.product.images[0]?.url} alt={item.product.name} className="w-full h-full object-cover" />
            <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
              Qty: {item.quantity}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">{item.station.name}</span>
                <h2 className="break-words text-base font-bold leading-tight text-gray-900 sm:text-lg">{item.product.name}</h2>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-base font-bold text-gray-900 sm:text-lg">₦{Number(item.product.price).toLocaleString()}</span>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Paid in full</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">{item.product.sku || 'N/A'}</span>
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <FiCheckCircle size={14} /> Delivered {item.order?.deliveredDate ? new Date(item.order.deliveredDate).toLocaleDateString() : 'N/A'}
              </span>
              <span>• Hub: {item.station.name}</span>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: The Return Initiation Engine */}
          <div className="flex min-w-0 flex-col gap-5 lg:col-span-8 lg:gap-8">

            {/* Return Workflow Steps */}
            <div className="flex flex-col gap-8">
              {/* Step 1: Select Return Reason */}
              <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:gap-6 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">1</span>
                    <h3 className="text-lg font-bold text-gray-900">Select Return Reason</h3>
                  </div>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Mandatory</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: "defective", title: "Defective or not functioning", desc: "Hardware malfunction, sensor issue, or broken components.", badge: "Full Refund & Free Logistics", badgeColor: "bg-green-100 text-green-700" },
                    { id: "wrong_item", title: "Wrong item delivered", desc: "Item received does not match order specifications or SKU.", badge: "Full Refund & Priority Pick", badgeColor: "bg-green-100 text-green-700" },
                    { id: "transit_damage", title: "Physical transit damage", desc: "Product casing or factory seals visibly crushed/damaged.", badge: "Courier Claim Initiated", badgeColor: "bg-gray-100 text-gray-600" },
                    { id: "remorse", title: "Changed mind", desc: "Unopened box required. Buyer bears return shipping deduction.", badge: "Return Fee Applies", badgeColor: "bg-orange-100 text-orange-700" },
                  ].map(r => (
                    <label key={r.id} className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all flex flex-col gap-2 ${formData.reason === r.id ? 'border-orange-500 bg-orange-50/50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">{r.title}</span>
                        <input type="radio" checked={formData.reason === r.id} onChange={() => setFormData({...formData, reason: r.id})} className="accent-orange-500 w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{r.desc}</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${r.badgeColor}`}>
                          {r.badge}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 2: Detailed Explanation */}
              <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">2</span>
                    <h3 className="text-lg font-bold text-gray-900">Detailed Problem Description</h3>
                  </div>
                  <span className="text-xs text-gray-400">Max 500 chars</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-600" htmlFor="explanation">
                    Provide specific details regarding the malfunction or defect
                  </label>
                  <textarea
                    className="w-full bg-gray-50 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all resize-none border border-gray-100"
                    rows={4}
                    placeholder="Example: Lens mount sensor error code E:61:00 upon initial power up..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                  <p className="text-xs text-gray-400 italic">
                    Be explicit to accelerate technical triage at our Ikeja Testing Hub.
                  </p>
                </div>
              </div>

              {/* Step 3: Evidence Upload */}
              <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:gap-6 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">3</span>
                    <h3 className="text-lg font-bold text-gray-900">Evidence Verification (Photos & Video)</h3>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-bold">
                    {formData.evidence.length} Files Attached
                  </span>
                </div>

                <div className="relative rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all bg-gray-50 border-2 border-dashed border-gray-200 hover:bg-gray-100 hover:border-orange-300 group">
                  <input type="file" multiple onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <FiUpload size={24} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-gray-900">Click to upload or drag clear defect proof</p>
                    <p className="text-xs text-gray-500">PNG, JPG, MP4 or MOV up to 45MB each. Serial number photo recommended.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.evidence.map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-center gap-4 border border-gray-100 group">
                      <div className="w-16 h-16 rounded-lg bg-white overflow-hidden shrink-0 relative shadow-sm">
                        <img src={item.preview} className="w-full h-full object-cover" alt="evidence" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-xs font-bold text-gray-900 truncate">{item.file.name}</span>
                        <span className="text-[10px] text-gray-400">Image attached • Verified readable</span>
                      </div>
                      <button
                        onClick={() => setFormData({...formData, evidence: formData.evidence.filter((_, idx) => idx !== i)})}
                        className="w-8 h-8 rounded-full bg-white text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm"
                        type="button"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 4: Return Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">4</span>
                    <h3 className="text-lg font-bold text-gray-900">Return Method & Station</h3>
                  </div>
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, method: 'drop-off'})}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${formData.method === 'drop-off' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Drop-off Station
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, method: 'courier'})}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${formData.method === 'courier' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Home Courier Pickup
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Drop off at our verified inspection hub for instant check-in, or schedule a doorstep courier retrieval.
                </p>

                {formData.method === 'drop-off' && (
                  <div className="flex flex-col gap-4">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                          <FiBox size={20} />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{item.station.name}</span>
                            <span className="px-1.5 py-0.5 rounded bg-orange-500 text-white text-[10px] font-bold uppercase">Original Station</span>
                          </div>
                          <p className="text-xs text-gray-500">{item.station.address}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                            <span className="flex items-center gap-1"><FiCalendar size={12} /> Mon-Sat: 08:00 - 18:00</span>
                            <span className="font-semibold text-orange-600">• Priority Queue Fast-track</span>
                          </div>
                        </div>
                      </div>
                      <button type="button" className="text-xs font-bold text-orange-600 hover:underline shrink-0">Change Hub</button>
                    </div>
                    <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-inner border border-gray-100">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjHUD9PHyKQexM9ZjtVTaj8ilOLvIc4nEwzFTXwn110GIBfCzq9M7x3TTvnuiZDu9guepKympuzyYXvVcw4deBONpj34UG33qhPl1XEx4aqINllDbs8hgRbdQL4JO9TIdAldr9DbDaEwHFD4RvppdWBdwkAVRjiZzpEGOXewEHMVm7s2hY-96gXwCMeX-weQIpX4agXdagB7W6iokWDgRqW1hc-5QzuYQ5pDCijceUnkU-btpEGJB-FA')" }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                          <div className="flex items-center justify-between w-full text-white">
                            <div className="flex items-center gap-2">
                              <FiMapPin className="text-orange-500" />
                              <span className="text-xs font-bold">14.2 km from your current address • Lekki</span>
                            </div>
                            <span onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.station.address)}`, '_blank')} className="text-xs underline font-medium hover:text-orange-300 cursor-pointer">Open in Google Maps</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Refund Breakdown Summary */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-md font-bold text-gray-900">Refund Breakdown Settlement</span>
                    <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-bold uppercase">Zero Deductions</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Item Subtotal Refund</span>
                      <span className="font-mono text-gray-900 font-semibold">₦{Number(item.product.price).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">Return Shipping Fee <FiAlertCircle size={14} className="text-gray-400" /></span>
                      <span className="font-mono text-green-600 font-semibold">₦0.00 (Merchant Fault)</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Packaging & Restock Assessment</span>
                      <span className="font-mono text-gray-900">₦0.00</span>
                    </div>
                    <div className="h-px bg-gray-200 my-2" />
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-md font-bold text-gray-900">Estimated Total Refund</span>
                        <span className="text-xs text-gray-400">Direct credit to original card via Paystack</span>
                      </div>
                      <span className="text-2xl font-bold text-orange-600 font-mono">₦{Number(item.product.price).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-gray-100 bg-white p-3 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="w-8 h-6 rounded bg-gray-100 flex items-center justify-center shadow-sm">
                        <span className="font-bold text-[10px] text-red-600">MC</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="break-words text-xs font-bold text-gray-900">Paystack • Mastercard ending in 4091</span>
                        <span className="break-all text-[10px] text-gray-400">Authorization REF: PSTK_AUTH_891278103</span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase">
                      <FiCheckCircle size={12} /> Instant Webhook
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
              <button
                onClick={() => navigate("/customer/orders")}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancel & Back to Order
              </button>
              <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
                <button type="button" className="w-full rounded-xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200 sm:w-auto">
                  Save Draft
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-orange-700 active:scale-95 sm:w-auto"
                >
                  {loading ? <Spinner size="small" color="#ffffff" /> : "Submit Return Request"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Context & Security */}
          <div className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-28 lg:col-span-4 lg:gap-8">
            <RecommendationBanner
              products={featuredProducts?.data || []}
              title="You may also like this"
            />
            {/* Order Snapshot */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Order Snapshot</span>
                <span className="font-mono text-xs font-bold text-orange-600">#{item.order?.id?.slice(0, 8) || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Order Date:</span>
                  <span className="text-gray-900 font-semibold">{item.order?.createdAt ? new Date(item.order.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Delivered Date:</span>
                  <span className="text-gray-900 font-semibold">{item.order?.deliveredDate ? new Date(item.order.deliveredDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="text-gray-900 font-semibold">Paystack (Direct Debit)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Seller Rating:</span>
                  <span className="text-gray-900 font-semibold flex items-center gap-1">
                    <span className="text-orange-500 font-bold">4.9</span>
                    <span className="text-orange-500">★</span>
                    <span className="text-gray-400 text-xs font-normal">(1.2k sales)</span>
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 flex items-center gap-3 border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <FiShield size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900">Escrow Hold Active</span>
                  <span className="text-[10px] text-gray-500">Funds held until return window closes.</span>
                </div>
              </div>
            </div>

            {/* Return Journey Tracker */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
              <h3 className="text-md font-bold text-gray-900">Return Journey Tracker</h3>
              <div className="relative pl-6 flex flex-col gap-8">
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-100" />
                {[
                  { s: 1, t: "Request Filed", d: "Upload evidence and choose drop hub.", active: true },
                  { s: 2, t: "Fault Review & Approval", d: "Karakata Tech desk confirms within 4h.", active: false },
                  { s: 3, t: "Station Drop-off", d: "Drop package at designated hub.", active: false },
                  { s: 4, t: "Refund Dispatched", d: "Instant reversal to original card.", active: false },
                ].map((step, i) => (
                  <div key={i} className={`relative flex items-start gap-4 ${step.active ? 'opacity-100' : 'opacity-60'}`}>
                    <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white ${step.active ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {step.s}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${step.active ? 'text-gray-900' : 'text-gray-500'}`}>{step.t}</span>
                      <span className="text-xs text-gray-400">{step.d}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Karakata Shield Guarantee */}
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 shadow-sm border border-orange-100 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <FiShield className="text-orange-600" size={20} />
                <span className="text-md font-bold text-gray-900">Karakata Shield Guarantee</span>
              </div>
              <ul className="flex flex-col gap-3 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 shrink-0 mt-0.5" size={14} />
                  <span><strong className="text-gray-900">Hassle-Free Returns:</strong> 5-day unconditional evaluation period.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 shrink-0 mt-0.5" size={14} />
                  <span><strong className="text-gray-900">100% Escrow Security:</strong> Seller cannot access funds until you verify integrity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 shrink-0 mt-0.5" size={14} />
                  <span><strong className="text-gray-900">Direct Dispute Line:</strong> Dedicated arbitration team available daily.</span>
                </li>
              </ul>
              <div className="pt-3 flex flex-col gap-1 border-t border-orange-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Arbitration Hotline</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">+234 800 KARAKATA</span>
                  <span className="text-[10px] font-bold text-orange-600 uppercase">Toll Free</span>
                </div>
              </div>
            </div>

            {/* Packing Reminder */}
            <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                <FiBox size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-gray-900">Packing Reminder</span>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Include the camera battery, original neck strap, factory box, and power adapter to ensure rapid approval.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
