import React, { useState, useEffect } from "react";
import { GrMoney } from "react-icons/gr";
import { BsCartX } from "react-icons/bs";
import { LiaShippingFastSolid } from "react-icons/lia";
import { PiShippingContainerLight } from "react-icons/pi";
import { VscOpenPreview } from "react-icons/vsc";
import { MdOutlinePayment, MdCheckCircle, MdGridView, MdList } from "react-icons/md";
import { TbBrandDeliveroo, TbProgress } from "react-icons/tb";
import { IoMdArrowDropdown, IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import { getAdminOrders, getOrderSummary } from "../../services/apiOrders";
import OrderCard from "../../components/adminDashboard/OrderCard";
import TableOrderItem from "../../components/adminDashboard/TableOrderItem";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";
import Spinner from "../../components/Spinner";
import { useModal } from "../../contexts/hooks/useModal";
import OrderDetailsModal from "../../components/adminDashboard/OrderDetailsModal";

export default function Orders() {
  // API State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // Local state for inputs to avoid jarring rerenders
  const [tempSearch, setTempSearch] = useState("");
  const [tempStatus, setTempStatus] = useState("ALL");
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");

  // Explicit loading state to ensure spinner visibility
  const [isApplying, setIsApplying] = useState(false);

  const { openModal } = useModal();
  const offset = (page - 1) * limit;

  const { data, isLoading, isError, error, isFetching } = useQuery<{ orders: any[]; total: number } | undefined>({
    queryKey: ["adminOrders", page, search, limit, statusFilter, startDate, endDate],
    queryFn: async () => {
      const res = await getAdminOrders({
        limit,
        offset,
        search,
        status: statusFilter,
        startDate,
        endDate,
      });
      return res as { orders: any[]; total: number };
    },
  });

  // Reset applying state when data changes
  useEffect(() => {
    setIsApplying(false);
  }, [data]);

  const { data: summary, isLoading: loadingSummary } = useQuery<{ data: Record<string, number> }>({
    queryKey: ["adminOrdersSummary"],
    queryFn: async () => (await getOrderSummary()) as { data: Record<string, number> },
  });

  const orders = data?.orders || [];
  const totalOrders = data?.total || 0;
  const totalPages = Math.ceil(totalOrders / limit);

  const applyFilters = () => {
    setIsApplying(true);
    setSearch(tempSearch);
    setStatusFilter(tempStatus);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setPage(1);
  };

  const handleOrderAction = (id: string, action: "details" | "tracking" | "invoice") => {
    openModal(<OrderDetailsModal orderId={id} initialTab={action} />);
  };

  if (isLoading && !data) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Error loading orders: {(error as any)?.message || "Unknown error"}
      </div>
    );
  }

  const views = [
    {
      title: "Order Paid",
      icon: <MdCheckCircle size={20} />,
      val: summary?.data?.PAID || 0,
      color: "bg-emerald-50 text-emerald-500",
    },
    {
      title: "Payment Refund",
      icon: <GrMoney size={20} />,
      val: summary?.data?.REFUNDED || 0,
      color: "bg-red-50 text-red-500",
    },
    {
      title: "Order Cancelled",
      icon: <BsCartX size={20} />,
      val: summary?.data?.CANCELLED || 0,
      color: "bg-gray-50 text-gray-500",
    },
    {
      title: "Order Shipped",
      icon: <PiShippingContainerLight size={20} />,
      val: summary?.data?.SHIPPED || 0,
      color: "bg-blue-50 text-blue-500",
    },
    {
      title: "Order Delivering",
      icon: <LiaShippingFastSolid size={20} />,
      val: summary?.data?.IN_TRANSIT || 0,
      color: "bg-amber-50 text-amber-500",
    },
    {
      title: "Pending Review",
      icon: <VscOpenPreview size={20} />,
      val: summary?.data?.FAILED || 0,
      color: "bg-purple-50 text-purple-500",
    },
    {
      title: "Pending Payment",
      icon: <MdOutlinePayment size={20} />,
      val: summary?.data?.PENDING || 0,
      color: "bg-orange-50 text-orange-500",
    },
    {
      title: "Delivered",
      icon: <TbBrandDeliveroo size={20} />,
      val: summary?.data?.DELIVERED || 0,
      color: "bg-green-50 text-green-500",
    },
    {
      title: "In Progress",
      icon: <TbProgress size={20} />,
      val: summary?.data?.PROCESSING || 0,
      color: "bg-indigo-50 text-indigo-500",
    },
  ];

  return (
    <div className="font-primary w-full p-4 lg:p-0 relative">
      {/* High-visibility Loading Overlay */}
      {(isFetching || isApplying) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity duration-200">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-6 rounded-full shadow-2xl border border-gray-100 animate-bounce">
              <Spinner />
            </div>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest animate-pulse">
              Fetching Orders...
            </p>
          </div>
        </div>
      )}

      <div className="my-2 grid w-full grid-cols-2 gap-3 py-5 lg:mt-10 lg:mb-5 lg:grid-cols-4">
        {views.map((view) => (
          <div
            key={view.title}
            className="flex w-full items-center justify-between gap-5 rounded-2xl bg-white px-7 py-4 shadow-sm border border-gray-100"
          >
            <div className="flex flex-col items-start justify-start gap-1">
              <h2 className="text-xs font-medium sm:text-sm text-gray-500">{view.title}</h2>
              <p className="text-xl font-bold text-gray-800">{view.val}</p>
            </div>
            <div className={`${view.color} flex h-[40px] w-[40px] items-center justify-center rounded-2xl lg:h-[50px] lg:w-[50px]`}>
              {view.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="my-5 flex w-full flex-col items-start justify-start rounded-2xl bg-white py-6 shadow-sm border border-gray-100">
        <div className="flex w-full items-center justify-between px-6 mb-6">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold text-gray-800">All Orders</h2>

            {/* Pagination Info & Controls */}
            {totalOrders > 0 && (
              <div className="flex items-center gap-4 scale-90 origin-left">
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  <span>Total: <span className="font-bold text-gray-800">{totalOrders}</span></span>
                  <span className="text-gray-300">|</span>
                  <span>Page <span className="font-bold text-gray-800">{page}</span> of {totalPages}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-600 transition-colors"
                    title="Previous Page"
                  >
                    <IoMdArrowBack size={18} />
                  </button>
                  <DashboardPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                  />
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-600 transition-colors"
                    title="Next Page"
                  >
                    <IoMdArrowForward size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setViewMode("card")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "card" ? "bg-white shadow-sm text-orange-600" : "text-gray-400 hover:text-gray-600"}`}
                title="Card View"
              >
                <MdGridView size={18} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "table" ? "bg-white shadow-sm text-orange-600" : "text-gray-400 hover:text-gray-600"}`}
                title="Table View"
              >
                <MdList size={18} />
              </button>
            </div>

            {/* Date Range Filter Group */}
            <div className="hidden lg:flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
              <input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className="bg-transparent focus:outline-none px-2 py-1 text-xs text-gray-600"
              />
              <span className="text-gray-400 text-[10px] uppercase font-bold">to</span>
              <input
                type="date"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
                className="bg-transparent focus:outline-none px-2 py-1 text-xs text-gray-600"
              />
            </div>

            {/* Items Per Page */}
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="border-gray-200 bg-gray-50 focus:bg-white focus:outline-none rounded-lg border px-2 py-2 text-xs transition-all duration-300 focus:ring-2 focus:ring-orange-500/20"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>

            {/* Status Filter */}
            <select
              value={tempStatus}
              onChange={(e) => setTempStatus(e.target.value)}
              className="border-gray-200 bg-gray-50 focus:bg-white focus:outline-none rounded-lg border px-2 py-2 text-xs transition-all duration-300 focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUNDED">Refunded</option>
            </select>

            {/* Search Bar */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                placeholder="Search orders..."
                className="border-gray-200 bg-gray-50 focus:bg-white focus:outline-none w-[150px] rounded-lg border px-4 py-2 text-xs transition-all duration-300 focus:w-[220px] focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <button
              onClick={applyFilters}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="px-6 w-full">
          {orders.length > 0 ? (
            viewMode === "card" ? (
              <div className="grid grid-cols-1 gap-4">
                {orders.map((order: any) => (
                  <OrderCard
                    key={order.id}
                    order={{
                      ...order,
                      storeName: order.store?.name,
                    }}
                    onAction={handleOrderAction}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order: any) => (
                      <TableOrderItem
                        key={order.id}
                        id={order.id}
                        createdAt={order.createdAt}
                        customer={order.user?.name}
                        total={order.totalAmount}
                        paymentStatus={order.status}
                        status={order.logisticsStatus}
                        onView={(id) => handleOrderAction(id, "details")}
                        onDelete={(id) => {}}
                      />
                    ))}
                  </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            <div className="py-20 text-center text-gray-400">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
