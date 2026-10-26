import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getMyOrders, downloadInvoiceBundle } from "../../services/apiOrders";
import { getAdvertisedDiscounts, getProductsByCategory } from "../../services/apiProducts";
import { getMyReturns } from "../../services/apiReturns";
import Spinner from "../../components/Spinner";
import { FaFileDownload, FaPrint, FaSearch, FaSortAmountDown, FaCheckCircle, FaUndo, FaTimesCircle, FaEye, FaRedo, FaStar, FaShieldAlt } from "react-icons/fa";
import { FaBoxOpen, FaTruck } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useModal } from "../../contexts/hooks/useModal";
import TrackingModal from "../../components/adminDashboard/TrackingModal";
import InvoiceModal from "../../components/customer/InvoiceModal";
import RecommendationBanner from "../../components/customer/RecommendationBanner";
import FlashSaleBanner from "../../components/customer/FlashSaleBanner";
import CustomerChrome from "../../components/customer/CustomerChrome";

export default function MyOrders() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal, closeModal } = useModal();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isReprinting, setIsReprinting] = useState(false);
  const [topCategories, setTopCategories] = useState<string[]>([]);
  const [dateFilterType, setDateFilterType] = useState<"all" | "date" | "month" | "year">("all");
  const [dateFilterValue, setDateFilterValue] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["all", "active", "delivered", "returns", "cancelled"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const { data: orders, isLoading, isFetching } = useQuery({
    queryKey: ["myOrders"],
    queryFn: getMyOrders,
    refetchInterval: 30000,
  });

  const { data: returnsData, isLoading: loadingReturns } = useQuery({
    queryKey: ["myReturns"],
    queryFn: getMyReturns,
    enabled: activeTab === "returns",
  });

  useEffect(() => {
    if (orders?.data) {
      const categoryCounts: Record<string, number> = {};
      orders.data.forEach((order: any) => {
        order.items?.forEach((item: any) => {
          const catId = item.product?.category?.id;
          if (catId) {
            categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
          }
        });
      });

      const sortedCategories = Object.entries(categoryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([id]) => id);

      setTopCategories(sortedCategories);
    }
  }, [orders]);

  const { data: recs1 } = useQuery({
    queryKey: ["recs1", topCategories[0]],
    queryFn: () => getProductsByCategory(topCategories[0] || ""),
    enabled: !!topCategories[0],
  });

  const { data: recs2 } = useQuery({
    queryKey: ["recs2", topCategories[1]],
    queryFn: () => getProductsByCategory(topCategories[1] || ""),
    enabled: !!topCategories[1],
  });

  const { data: advertisedDiscounts } = useQuery({
    queryKey: ["advertisedDiscounts"],
    queryFn: getAdvertisedDiscounts,
    staleTime: 60000,
  });

  const handleQuickReprint = async () => {
    const ordersList = orders?.data || [];
    if (ordersList.length === 0) {
      toast.error("No orders available to reprint");
      return;
    }

    try {
      setIsReprinting(true);
      const blob = await downloadInvoiceBundle();
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `Karakata_Invoices_${ordersList.length}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`${ordersList.length} invoices downloaded as one PDF`);
    } catch (err: any) {
      toast.error("Failed to reprint some invoices: " + err.message);
    } finally {
      setIsReprinting(false);
    }
  };

  const tabs = [
    { id: "all", label: "All Orders", icon: <FaBoxOpen size={14} /> },
    { id: "active", label: "In Transit & Active", icon: <FaTruck size={14} /> },
    { id: "delivered", label: "Delivered", icon: <FaCheckCircle size={14} /> },
    { id: "returns", label: "Returns & Refunds", icon: <FaUndo size={14} /> },
    { id: "cancelled", label: "Cancelled", icon: <FaTimesCircle size={14} /> },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Spinner type="big" color="#f97316" />
          <p className="text-sm font-medium text-gray-500 animate-pulse">Loading your orders...</p>
        </div>
      </div>
    );
  }

  const normalizeStatus = (value: unknown) =>
    String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[_\-\s]+/g, "_");

  const getShipmentStatus = (order: any) => {
    const orderStatus = normalizeStatus(order?.status);
    const logisticsStatus = normalizeStatus(order?.logisticsStatus);
    const shipmentStatus = normalizeStatus(order?.shipments?.[0]?.status);

    const failedOrderStates = ["failed", "payment_failed", "declined", "rejected"];
    const cancelledOrderStates = ["cancelled", "canceled", "cancelled_by_user"];
    const deliveredStates = ["delivered", "completed"];
    const activeShipmentStates = [
      "pending",
      "processing",
      "assigned",
      "order_received",
      "picked_up",
      "shipped",
      "in_transit",
      "out_for_delivery",
      "paid",
    ];

    if (failedOrderStates.includes(orderStatus) || ["delivery_failed"].includes(logisticsStatus)) {
      return "failed";
    }

    if (cancelledOrderStates.includes(orderStatus) || ["cancelled", "canceled", "delivery_cancelled"].includes(shipmentStatus)) {
      return "cancelled";
    }

    if (deliveredStates.includes(orderStatus) || deliveredStates.includes(shipmentStatus)) {
      return "delivered";
    }

    if (order.items && order.items.length > 0) {
      const allDelivered = order.items.every((item: any) => normalizeStatus(item.status) === "delivered");
      if (allDelivered) return "delivered";
    }

    if (activeShipmentStates.includes(shipmentStatus)) {
      return "active";
    }

    if (["paid"].includes(orderStatus) || (!shipmentStatus && ["processing"].includes(logisticsStatus))) {
      return "active";
    }

    if (["returned", "return_initiated"].includes(shipmentStatus)) {
      return "returned";
    }

    return shipmentStatus || logisticsStatus || orderStatus || "active";
  };

  const getShipmentLabel = (order: any) => {
    const status = getShipmentStatus(order);
    const labels: Record<string, string> = {
      active: "Order received",
      pending: "Order received",
      processing: "Processing",
      shipped: "Shipped",
      picked_up: "Picked up",
      in_transit: "In transit",
      out_for_delivery: "Out for delivery",
      delivered: "Delivered",
      completed: "Delivered",
      failed: "Payment failed",
      cancelled: "Delivery cancelled",
      returned: "Return in progress",
      delivery_failed: "Delivery issue",
      payment_failed: "Payment failed",
      order_received: "Order received",
    };

    return labels[status] || (status === "paid" ? "Payment confirmed" : "Processing");
  };

  const isReturnedItem = (item: any) =>
    ["returned", "return_requested"].includes(normalizeStatus(item?.status));

  const hasOnlyReturnedItems = (order: any) =>
    Array.isArray(order?.items) &&
    order.items.length > 0 &&
    order.items.every((item: any) => isReturnedItem(item));

  const filteredOrders = orders?.data?.filter((order: any) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const orderDate = new Date(order.createdAt);
    const matchesDate =
      dateFilterType === "all" ||
      !dateFilterValue ||
      (dateFilterType === "date" && orderDate.toISOString().slice(0, 10) === dateFilterValue) ||
      (dateFilterType === "month" && orderDate.toISOString().slice(0, 7) === dateFilterValue) ||
      (dateFilterType === "year" && String(orderDate.getFullYear()) === dateFilterValue);

    const currentStatus = getShipmentStatus(order);

    if (activeTab === "all") return matchesSearch && matchesDate;
    if (activeTab === "active") {
      return matchesSearch && matchesDate && !["delivered", "completed", "returned", "cancelled", "failed"].includes(currentStatus);
    }
    if (activeTab === "delivered") {
      return matchesSearch && matchesDate &&
        (currentStatus === "delivered" || currentStatus === "completed") &&
        !hasOnlyReturnedItems(order);
    }
    if (activeTab === "returns") return matchesSearch && matchesDate && currentStatus === "returned";
    if (activeTab === "cancelled") return matchesSearch && matchesDate && (["cancelled", "failed"].includes(currentStatus) || ["cancelled", "delivery_failed", "payment_failed"].includes(normalizeStatus(order?.status || order?.logisticsStatus)));
    return matchesSearch && matchesDate;
  });

  const renderContent = () => {
    if (activeTab === "returns") {
      if (loadingReturns) {
        return (
          <div className="flex h-64 items-center justify-center">
            <Spinner />
          </div>
        );
      }
      if (returnsData?.data && returnsData.data.length > 0) {
        return returnsData.data.map((ret: any) => (
          <div key={ret.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
            <div className="bg-gray-50/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 uppercase font-bold">Return ID:</span>
                  <span className="font-bold text-gray-900">#{ret.id.slice(0, 8)}</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 uppercase font-bold">Date:</span>
                  <span className="text-gray-700">{new Date(ret.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/customer/returns/status/${ret.id}`)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-all shadow-sm"
                >
                  View Status
                </button>
              </div>
            </div>
            <div className="px-6 py-3 bg-orange-50/50 border-b border-orange-100 flex items-center gap-3">
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-orange-600 text-white text-[10px] font-bold uppercase">
                <FaUndo size={12} />
                {ret.status.replace('_', ' ')}
              </div>
              <p className="text-xs font-medium text-orange-700">
                Request for {ret.product?.name || "item"} submitted for review.
              </p>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden border border-gray-100">
                  <img src={ret.product?.images?.[0]?.url || "/placeholder-product.jpg"} className="w-full h-full object-cover" alt={ret.product?.name} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{ret.product?.name || "Product name not available"}</p>
                  <p className="text-xs text-gray-500">Reason: {ret.reason.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block uppercase font-bold">Refund Amount</span>
                <span className="text-lg font-bold text-gray-900">₦{Number(ret.refundAmount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ));
      }
      return (
        <div className="text-center py-20">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUndo size={40} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No returns found</h3>
          <p className="text-sm text-gray-500">You haven't initiated any return requests yet.</p>
        </div>
      );
    }

    if (filteredOrders && filteredOrders.length > 0) {
      return filteredOrders.map((order: any) => (
        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
          <div className="bg-gray-50/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 uppercase font-bold">Order ID:</span>
                <span className="font-bold text-gray-900">#{order.id.slice(0, 8)}</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 uppercase font-bold">Placed:</span>
                <span className="text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 uppercase font-bold">Total:</span>
                <span className="font-bold text-gray-900">₦{(order.totalAmount || order.total || 0).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openModal(<InvoiceModal orderId={order.id} />)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-all"
              >
                Print Invoice
              </button>
              <button
                onClick={() => openModal(<TrackingModal orderId={order.id} onClose={closeModal} />)}
                className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-all shadow-sm"
              >
                <FaTruck size={12} className="text-white" /> Track Order
              </button>
            </div>
          </div>
          <div className="px-6 py-3 bg-orange-50/50 border-b border-orange-100 flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-orange-600 text-white text-[10px] font-bold uppercase">
              <FaTruck size={12} />
              {getShipmentLabel(order)}
            </div>
            <p className="text-xs font-medium text-orange-700">
              {(() => {
                const currentStatus = getShipmentStatus(order);

                if (["delivered", "completed"].includes(currentStatus)) {
                  return "Your package has been delivered successfully";
                }

                if (["failed", "cancelled"].includes(currentStatus)) {
                  return currentStatus === "failed"
                    ? "Payment failed, so this order is not active in shipping."
                    : "This order was cancelled and is no longer in the shipping flow.";
                }

                if (order.shipments?.[0]?.deliveryEta || order.deliveryDate) {
                  return `Expected Delivery: ${new Date(order.shipments?.[0]?.deliveryEta || order.deliveryDate).toLocaleDateString()}`;
                }

                return `Expected Delivery: ${new Date(Date.now() + 86400000 * 2).toLocaleDateString()}`;
              })()}
            </p>
          </div>
          <div className="p-6 space-y-4">
            {order.items?.filter((item: any) => {
                if (activeTab === "delivered") {
                  return normalizeStatus(item.status) === "delivered";
                }
                return true;
              }).map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:border-orange-600/20 hover:bg-orange-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={item.product?.images?.[0]?.url || "/placeholder-product.jpg"}
                      className="w-20 h-20 rounded-xl object-cover border border-gray-100"
                      alt={item.product?.name}
                    />
                    <span className="absolute -top-2 -right-2 bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-200">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{item.product?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`${item.status === 'DELIVERED' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'} text-[10px] font-bold uppercase px-1.5 py-0.5 rounded`} >
                        {item.status}
                      </span>
                      <span className="text-xs text-gray-400">• {item.product?.category?.name}</span>
                    </div>
                  </div>
                </div>
                {(order.isReturnable && item.status === 'DELIVERED') ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => navigate(`/customer/returns/initiate/${item.id}`, { state: { item: { ...item, order, station: order.shipments?.[0]?.pickupStation || { name: 'Unknown Station', address: 'N/A' } } } })}
                      className="flex items-center gap-2 rounded-lg border border-orange-600 px-3 py-2 text-xs font-bold text-orange-600 transition-all hover:bg-orange-600 hover:text-white"
                    >
                      <FaUndo size={11} /> Return item
                    </button>
                    <button
                      onClick={() => openModal(<InvoiceModal orderId={order.id} />)}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 transition-all hover:border-orange-600 hover:text-orange-600"
                    >
                      <FaEye size={11} /> Details
                    </button>
                  </div>
                ) : item.status === 'RETURN_REQUESTED' ? (
                  <div className="flex shrink-0 items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">
                    <FaUndo size={11} /> Return Initiated
                  </div>
                ) : item.status === 'RETURNED' ? (
                  <div className="flex shrink-0 items-center gap-2 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                    <FaCheckCircle size={11} /> Item Returned
                  </div>
                ) : null}
              </div>
            ))}
            {getShipmentStatus(order) === "delivered" && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-orange-50/50 px-4 py-3 text-xs">
                <div className={`flex items-center gap-2 font-semibold ${order.isReturnable ? 'text-orange-600' : 'text-gray-500'}`}>
                  <FaShieldAlt size={13} />
                  {order.isReturnable
                    ? "Eligible for return within the configured return window"
                    : "Return window has expired for this order"}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openModal(<InvoiceModal orderId={order.id} />)}
                    className="flex items-center gap-1 font-bold text-gray-600 hover:text-orange-600"
                  >
                    <FaPrint size={11} /> Invoice
                  </button>
                  <button
                    onClick={() => navigate(`/customer/orders`)}
                    className="flex items-center gap-1 font-bold text-gray-600 hover:text-orange-600"
                  >
                    <FaRedo size={11} /> Buy again
                  </button>
                  <button
                    onClick={() => toast.success("Product review coming soon")}
                    className="flex items-center gap-1 font-bold text-gray-600 hover:text-orange-600"
                  >
                    <FaStar size={11} /> Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ));
    }

    return (
      <div className="text-center py-20">
        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaBoxOpen size={40} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
        <p className="text-sm text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <CustomerChrome />
      <main className="pt-24 px-4 lg:px-20 pb-20">
      {isFetching && !isLoading && (
        <div className="absolute top-8 right-8 z-50">
          <Spinner type="small" />
        </div>
      )}

      <div className="max-w-[1600px] mx-auto flex gap-8 items-start">
        <div className="hidden xl:block w-[280px] shrink-0">
          <FlashSaleBanner discounts={advertisedDiscounts?.data || []} />
          <RecommendationBanner
            products={recs1?.data || []}
            title="You may also like this"
          />
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                  Customer Escrow Protected
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-xs text-gray-500 font-medium">Lagos • Abuja • Port Harcourt Hubs</span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Orders & Receipts</h1>
              <p className="text-sm text-gray-500 max-w-2xl">
                Track real-time shipments, reprint official tax invoices, and manage item returns across Nigerian fulfillment hubs.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                <FaFileDownload className="text-orange-600" />
                Download Tax Report
              </button>
              <button
                onClick={handleQuickReprint}
                disabled={isReprinting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isReprinting ? <Spinner type="small" color="#ffffff" /> : <FaPrint />}
                {isReprinting ? "Preparing PDF..." : "Quick Reprint Invoices"}
              </button>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-1 border-b border-gray-200 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-stretch justify-between gap-3 xl:flex-row xl:items-center">
            <div className="relative w-full xl:w-96">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by Order ID, tracking number..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-wide text-gray-400" htmlFor="order-date-filter">
                Filter by
              </label>
              <select
                id="order-date-filter"
                value={dateFilterType}
                onChange={(e) => {
                  setDateFilterType(e.target.value as typeof dateFilterType);
                  setDateFilterValue("");
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-orange-600"
              >
                <option value="all">All time</option>
                <option value="date">Day</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
              {dateFilterType !== "all" && (
                <input
                  type={dateFilterType === "date" ? "date" : dateFilterType === "month" ? "month" : "number"}
                  min={dateFilterType === "year" ? "2000" : undefined}
                  max={dateFilterType === "year" ? String(new Date().getFullYear()) : undefined}
                  value={dateFilterValue}
                  onChange={(e) => setDateFilterValue(e.target.value)}
                  placeholder={dateFilterType === "year" ? "YYYY" : undefined}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-orange-600"
                  aria-label={`Filter orders by ${dateFilterType}`}
                />
              )}
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <FaSortAmountDown className="text-gray-400" />
                <span>Most Recent</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {renderContent()}
          </div>
        </div>

        <div className="hidden xl:block w-[280px] shrink-0">
          <RecommendationBanner
            products={recs2?.data || []}
            title="Explore more"
          />
        </div>
      </div>
      </main>
    </div>
  );
}
