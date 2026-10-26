import React from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { apiReturn } from "../../services/apiReturns";
import Spinner from "../../components/Spinner";
import { FiShield, FiBox, FiMapPin, FiCalendar, FiCheckCircle, FiAlertCircle, FiArrowLeft, FiExternalLink } from "react-icons/fi";
import CustomerChrome from "../../components/customer/CustomerChrome";

export default function ReturnStatus() {
  const { returnId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["returnStatus", returnId],
    queryFn: () => apiReturn.getReturnStatus(returnId!),
  });

  if (isLoading) {
    return (
      <>
      <CustomerChrome />
      <div className="flex h-screen w-full items-center justify-center bg-[#f8f9ff]">
        <div className="flex flex-col items-center gap-4">
          <Spinner type="big" color="#f97316" />
          <p className="text-sm font-medium text-gray-500 animate-pulse">Retrieving return status...</p>
        </div>
      </div>
      </>
    );
  }

  const returnReq = data?.data;

  if (!returnReq) {
    return (
      <>
      <CustomerChrome />
      <div className="flex h-screen w-full items-center justify-center bg-[#f8f9ff] p-4 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
            <FiAlertCircle size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Return Request Not Found</h1>
          <p className="text-gray-500">We couldn't locate a return request with this ID. Please check your order history or contact support.</p>
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

  const steps = [
    { s: "PENDING", t: "Request Filed", d: "Your evidence has been submitted and is currently under review by our technical team.", icon: <FiCalendar size={16} /> },
    { s: "APPROVED", t: "Fault Review Approved", d: "The defect has been verified. You are now cleared to drop off your item at the designated hub.", icon: <FiCheckCircle size={16} /> },
    { s: "COMPLETED", t: "Return Completed", d: "Item received at hub and passed final inspection. Your refund is being processed.", icon: <FiBox size={16} /> },
  ];

  const currentStepIndex = steps.findIndex(step => step.s === returnReq.status);

  return (
    <>
    <CustomerChrome />
    <div className="bg-[#f8f9ff] min-h-screen pt-24 px-4 lg:px-20 pb-20 font-sans text-[#0b1c30]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <a href="/customer/orders" className="hover:text-orange-500 transition-colors">My Orders</a>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-gray-900 font-semibold">Return Status</span>
          </nav>

          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gray-100">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">Return Journey Tracker</h1>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  returnReq.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${returnReq.status === 'COMPLETED' ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
                  Status: {returnReq.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Tracking return request <strong className="text-gray-900 font-semibold">#{returnReq.id.slice(0, 8)}</strong> for your item.
              </p>
            </div>
            <button
              onClick={() => navigate("/customer/orders")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
            >
              <FiArrowLeft size={16} /> Back to Orders
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: The Journey */}
          <div className="lg:col-span-8 flex flex-col gap-8">

            {/* Return Item Snapshot */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                <img src={returnReq.product?.images?.[0]?.url || "/placeholder-product.jpg"} alt={returnReq.product?.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col flex-1 min-w-0 text-center sm:text-left">
                <h2 className="text-lg font-bold text-gray-900 truncate">{returnReq.product?.name || "Item Return"}</h2>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">{returnReq.product?.sku || 'N/A'}</span>
                  <span className="flex items-center gap-1 text-orange-600 font-medium">
                    Refund Amount: ₦{returnReq.refundAmount ? Number(returnReq.refundAmount).toLocaleString() : '0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-8">
              <h3 className="text-lg font-bold text-gray-900">Current Progress</h3>
              <div className="relative pl-8 flex flex-col gap-12">
                {/* Vertical Line */}
                <div className="absolute left-2.5 top-4 bottom-4 w-0.5 bg-gray-100" />

                {steps.map((step, i) => {
                  const isCompleted = i < currentStepIndex;
                  const isActive = i === currentStepIndex;
                  return (
                    <div key={i} className={`relative flex items-start gap-6 transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-60'}`}>
                      {/* Step Node */}
                      <div className={`absolute -left-8 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white transition-all ${
                        isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-orange-500 text-white animate-bounce' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isCompleted ? <FiCheckCircle size={14} /> : i + 1}
                      </div>

                      <div className={`flex-1 p-5 rounded-2xl border transition-all ${
                        isActive ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-gray-50 border-gray-100'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={isActive ? 'text-orange-600' : 'text-gray-400'}>{step.icon}</span>
                            <span className={`text-sm font-bold ${isActive ? 'text-orange-600' : 'text-gray-900'}`}>{step.t}</span>
                          </div>
                          {isCompleted && <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Verified</span>}
                        </div>
                        <p className={`text-xs leading-relaxed ${isActive ? 'text-orange-800' : 'text-gray-500'}`}>{step.d}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conditional Action Card */}
            {returnReq.status === 'APPROVED' && (
              <div className="bg-orange-600 rounded-2xl p-8 shadow-xl text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="flex-1 space-y-4 z-10">
                  <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <FiCheckCircle size={12} /> Action Required
                  </div>
                  <h3 className="text-2xl font-bold">Drop-off your item now!</h3>
                  <p className="text-orange-100 text-sm leading-relaxed">
                    Your return has been approved. Please bring the product to the specified hub. Once the item is checked in, your refund will be triggered instantly.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button className="px-6 py-2 bg-white text-orange-600 rounded-xl text-sm font-bold hover:bg-orange-50 transition-all flex items-center gap-2 shadow-sm">
                      <FiMapPin size={16} /> View Hub Directions
                    </button>
                    <button className="px-6 py-2 bg-orange-700 text-white rounded-xl text-sm font-bold hover:bg-orange-800 transition-all flex items-center gap-2">
                      <FiExternalLink size={16} /> View Return Label
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-48 h-32 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center z-10">
                  <span className="text-[10px] font-bold text-orange-200 uppercase mb-1">Estimated Refund</span>
                  <span className="text-2xl font-bold font-mono">₦{returnReq.refundAmount ? Number(returnReq.refundAmount).toLocaleString() : '0'}</span>
                </div>
              </div>
            )}

            {returnReq.status === 'COMPLETED' && (
              <div className="bg-green-600 rounded-2xl p-8 shadow-xl text-white flex flex-col items-center text-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white mb-2 z-10">
                  <FiCheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold z-10">Refund Successfully Processed!</h3>
                <p className="text-green-100 text-sm leading-relaxed max-w-md z-10">
                  Your return has been completed and the funds have been dispatched to your original payment method. Depending on your bank, it may take 3-5 business days to appear.
                </p>
                <button
                  onClick={() => navigate("/customer/orders")}
                  className="mt-2 px-8 py-3 bg-white text-green-600 rounded-xl text-sm font-bold hover:bg-green-50 transition-all shadow-sm z-10"
                >
                  View My Orders
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Trust & Info */}
          <div className="lg:col-span-4 flex flex-col gap-8 sticky top-28">
            {/* Support Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
              <h3 className="text-md font-bold text-gray-900">Need Assistance?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                If you have questions about your return or are facing issues with the drop-off station, our support team is available 24/7.
              </p>
              <div className="flex flex-col gap-2">
                <button className="w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all text-left flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                    <FiAlertCircle size={14} />
                  </div>
                  Contact Support
                </button>
                <button className="w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all text-left flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                    <FiCalendar size={14} />
                  </div>
                  View Return Policy
                </button>
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
                  <span><strong className="text-gray-900">Fair Assessment:</strong> Your item is reviewed by certified technicians.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 shrink-0 mt-0.5" size={14} />
                  <span><strong className="text-gray-900">Fast Reversals:</strong> Refunds are triggered the moment check-in is verified.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 shrink-0 mt-0.5" size={14} />
                  <span><strong className="text-gray-900">Escrow Safety:</strong> Funds are held in secure escrow until resolution.</span>
                </li>
              </ul>
              <div className="pt-3 flex flex-col gap-1 border-t border-orange-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Priority Support Line</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">+234 800 KARAKATA</span>
                  <span className="text-[10px] font-bold text-orange-600 uppercase">Toll Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
