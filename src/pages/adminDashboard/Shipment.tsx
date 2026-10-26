import { useState, useEffect, Fragment as ReactFragment } from "react";
import { getDriversSummary, getShipments, updateShipmentStatus, assignDriver, cancelShipment, reassignProvider, recoverShipments, trackShipment, markShipmentDelivered, updateFulfillmentStatus } from "../../services/apiAdmin";
import Spinner from "../../components/Spinner";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";
import OrderDetailsModal from "../../components/adminDashboard/OrderDetailsModal";
import { useModal } from "../../contexts/hooks/useModal";
import { FaCheckCircle, FaTruck, FaMapMarkerAlt, FaUserPlus, FaUndo, FaRegTimesCircle, FaExchangeAlt, FaSearch, FaClock, FaSyncAlt, FaEye, FaBox } from "react-icons/fa";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";

export default function Shipment() {
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Applied Filters
  const [provider, setProvider] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [driverId, setDriverId] = useState("ALL");
  const [customer, setCustomer] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Assignment state
  const [assigningShipment, setAssigningShipment] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [shipmentToCancel, setShipmentToCancel] = useState<{ id: string; reference: string } | null>(null);
  const [shipmentToReassign, setShipmentToReassign] = useState<string | null>(null);
  const [providerChoice, setProviderChoice] = useState<"internal" | "shipbubble">("internal");

  // Temporary state for inputs
  const [tempSearch, setTempSearch] = useState("");
  const [tempProvider, setTempProvider] = useState("ALL");
  const [tempStatus, setTempStatus] = useState("ALL");
  const [tempDriverId, setTempDriverId] = useState("ALL");
  const [tempCustomer, setTempCustomer] = useState("");
  const [tempDateRange, setTempDateRange] = useState({ start: "", end: "" });
  const [tempLimit, setTempLimit] = useState(10);
  const [isApplying, setIsApplying] = useState(false);
  const [expandedShipment, setExpandedShipment] = useState<string | null>(null);

  const offset = (page - 1) * limit;

  const { data: driverData } = useQuery({
    queryKey: ["adminDriversSummary"],
    queryFn: getDriversSummary,
  });

  const { data: deliveryData, isLoading: loadingDeliveries, isFetching: fetchingDeliveries } = useQuery({
    queryKey: ["adminShipments", page, search, provider, status, driverId, customer, dateRange],
    queryFn: () => getShipments({
      limit,
      offset,
      search,
      provider: provider === "ALL" ? undefined : provider,
      status: status === "ALL" ? undefined : status,
      driverId: driverId === "ALL" ? undefined : driverId,
      customer: customer || undefined,
      startDate: dateRange.start || undefined,
      endDate: dateRange.end || undefined,
    }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setIsApplying(false);
  }, [deliveryData]);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateShipmentStatus({ id, status }),
    onSuccess: (_, variables) => {
      toast.success(`Shipment marked as ${variables.status.toLowerCase().replace('_', ' ')}`);
      queryClient.invalidateQueries({ queryKey: ["adminShipments"] });
      queryClient.invalidateQueries({ queryKey: ["adminDriversSummary"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to update shipment status"),
  });

  const trackMutation = useMutation({
    mutationFn: (id: string) => trackShipment(id),
    onSuccess: (response: any) => {
      toast.success(response.message || "ShipBubble tracking refreshed");
      queryClient.invalidateQueries({ queryKey: ["adminShipments"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || err.message || "Failed to refresh tracking"),
  });

  const fulfillmentMutation = useMutation({
    mutationFn: ({ fulfillmentId, status, note }: { fulfillmentId: string; status: string; note?: string }) =>
      updateFulfillmentStatus(fulfillmentId, status, note),
    onSuccess: (response: any) => {
      toast.success(response.message || "Item updated");
      queryClient.invalidateQueries({ queryKey: ["adminShipments"] });
      queryClient.invalidateQueries({ queryKey: ["adminDriversSummary"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || err.message || "Failed to update item"),
  });

  const deliverMutation = useMutation({
    mutationFn: (id: string) => markShipmentDelivered(id),
    onSuccess: () => {
      toast.success("Internal shipment marked delivered");
      queryClient.invalidateQueries({ queryKey: ["adminShipments"] });
      queryClient.invalidateQueries({ queryKey: ["adminDriversSummary"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || err.message || "Failed to mark delivered"),
  });

  const assignMutation = useMutation({
    mutationFn: (data: { shipmentId: string; driverId: string }) => assignDriver(data),
    onSuccess: () => {
      toast.success("Driver assigned successfully");
      setAssigningShipment(null);
      setSelectedDriverId("");
      queryClient.invalidateQueries({ queryKey: ["adminShipments"] });
      queryClient.invalidateQueries({ queryKey: ["adminDriversSummary"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to assign driver"),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelShipment(id),
    onSuccess: () => {
      toast.success("Shipment cancelled successfully", {
        duration: 3500,
        style: { border: "1px solid #fed7aa", color: "#9a3412" },
      });
      setShipmentToCancel(null);
      queryClient.invalidateQueries({ queryKey: ["adminShipments"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to cancel shipment"),
  });

  const reassignMutation = useMutation({
    mutationFn: ({ id, provider }: { id: string; provider: string }) => reassignProvider(id, provider),
    onSuccess: () => {
      toast.success("Provider reassigned successfully");
      queryClient.invalidateQueries({ queryKey: ["adminShipments"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to reassign provider"),
  });

  const recoverMutation = useMutation({
    mutationFn: () => recoverShipments(),
    onSuccess: (res: any) => {
      const failedCount = res.data?.failedCount || 0;
      if (failedCount) {
        const expiredTokenCount = (res.data?.failedOrders || []).filter((item: any) =>
          item.reason?.toLowerCase().includes("token")
        ).length;
        toast.error(
          `${res.data?.repairedCount || 0} repaired. ${failedCount} still need attention${
            expiredTokenCount ? ` (${expiredTokenCount} expired courier tokens)` : ""
          }.`,
          { duration: 6000 }
        );
      } else {
        toast.success(res.message || "Missing shipments recovered successfully", { duration: 5000 });
      }
      queryClient.invalidateQueries({ queryKey: ["adminShipments"] });
      queryClient.invalidateQueries({ queryKey: ["adminDriversSummary"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to recover shipments"),
  });

  const applyFilters = () => {
    setIsApplying(true);
    setSearch(tempSearch);
    setProvider(tempProvider);
    setStatus(tempStatus);
    setDriverId(tempDriverId);
    setCustomer(tempCustomer);
    setDateRange(tempDateRange);
    setLimit(tempLimit);
    setPage(1);
  };

  const drivers = driverData?.data ?? [];

  const activeDrivers = [...drivers]
    .filter((d: any) => d.status === "Active" || d.status === "Overloaded")
    .sort((a, b) => b.activeTasks - a.activeTasks)
    .slice(0, 4);

  const inactiveDrivers = [...drivers]
    .filter((d: any) => d.status === "Idle")
    .sort((a, b) => b.completedTasks - a.completedTasks)
    .slice(0, 10);

  const deliveries = deliveryData?.data ?? [];
  const totalDeliveries = deliveryData?.total || deliveries.length;
  const totalPages = deliveryData?.totalPages || Math.ceil(totalDeliveries / limit);

  const handleReassign = (id: string) => {
    setProviderChoice("internal");
    setShipmentToReassign(id);
  };

  return (
    <div className="font-primary relative w-full min-w-0 max-w-full overflow-hidden">
      {/* Loading Overlay */}
      {(fetchingDeliveries || isApplying || recoverMutation.isPending) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/10 transition-opacity duration-200">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full border border-orange-200 bg-white p-6 shadow-2xl animate-bounce">
              <Spinner size="big" color="#f97316" />
            </div>
            <p className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-600 shadow-lg animate-pulse">
              {recoverMutation.isPending ? "Recovering shipments..." : "Updating fleet data..."}
            </p>
          </div>
        </div>
      )}

      <div className="my-6 space-y-8 px-3 sm:my-10 sm:px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Fleet Operations Center</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor driver workload and orchestrate real-time internal deliveries.</p>
          </div>
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row">
            <button
              onClick={() => recoverMutation.mutate()}
              disabled={recoverMutation.isPending}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all shadow-sm min-w-[160px]"
            >
              {recoverMutation.isPending ? (
                <>
                  <Spinner size="small" color="#ea580c" />
                  <span>Recovering...</span>
                </>
              ) : "Recover Shipments"}
            </button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition-all shadow-md">
              + Dispatch Shipment
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-end justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto flex-1">
              {/* Multi-Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">General Search</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    value={tempSearch}
                    onChange={(e) => setTempSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    placeholder="Shipment ID, Driver, Order..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Provider Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Provider</label>
                <select
                  value={tempProvider}
                  onChange={(e) => setTempProvider(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="ALL">All Providers</option>
                  <option value="internal">Karakata Internal</option>
                  <option value="shipbubble">ShipBubble</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Status</label>
                <select
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="picked_up">Picked Up</option>
                  <option value="delivered">Delivered</option>
                  <option value="returned">Returned</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Items Per Page */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Page Limit</label>
                <select
                  value={tempLimit}
                  onChange={(e) => setTempLimit(Number(e.target.value))}
                  className="w-full p-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>
            </div>

            <span
              role="button"
              tabIndex={0}
              onClick={applyFilters}
              className="bg-orange-500 text-white px-8 py-2 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-md"
            >
              Apply Filters
            </span>
          </div>

          {/* Advanced Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Assigned Driver</label>
              <select
                value={tempDriverId}
                onChange={(e) => setTempDriverId(e.target.value)}
                className="w-full p-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="ALL">All Drivers</option>
                {drivers.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Customer Name</label>
              <input
                type="text"
                value={tempCustomer}
                onChange={(e) => setTempCustomer(e.target.value)}
                placeholder="Search customer..."
                className="w-full p-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Date Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={tempDateRange.start}
                  onChange={(e) => setTempDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={tempDateRange.end}
                  onChange={(e) => setTempDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {loadingDeliveries && (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-orange-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 text-sm font-semibold text-orange-600">
              <Spinner size="small" color="#f97316" />
              Loading shipment records...
            </div>
          </div>
        )}

        {/* Driver Workload Grid */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Top Active Captains</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeDrivers.map((driver: any, index: number) => (
                <div key={`active-${index}`} className="bg-white p-2.5 rounded-lg shadow-sm border border-orange-200 hover:shadow-md transition-all duration-200 group min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-[11px]">
                        {driver.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-gray-800 text-xs leading-none truncate">{driver.name}</h3>
                        <p className="text-[9px] text-gray-400 truncate">{driver.email}</p>
                      </div>
                    </div>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      driver.status === "Overloaded" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                    }`}>
                      {driver.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                    <div className="text-center">
                      <p className="text-[8px] text-gray-400 uppercase font-semibold">Active</p>
                      <p className="text-sm font-bold text-gray-800">{driver.activeTasks}</p>
                    </div>
                    <div className="text-center border-l border-gray-100">
                      <p className="text-[8px] text-gray-400 uppercase font-semibold">Done</p>
                      <p className="text-sm font-bold text-gray-800">{driver.completedTasks}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Top Inactive Captains</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 opacity-80">
              {inactiveDrivers.map((driver: any, index: number) => (
                <div key={`inactive-${index}`} className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-[11px]">
                        {driver.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-gray-800 text-xs leading-none truncate">{driver.name}</h3>
                        <p className="text-[9px] text-gray-400 truncate">{driver.email}</p>
                      </div>
                    </div>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase bg-gray-100 text-gray-600">
                      Idle
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                    <div className="text-center">
                      <p className="text-[8px] text-gray-400 uppercase font-semibold">Active</p>
                      <p className="text-sm font-bold text-gray-800">{driver.activeTasks}</p>
                    </div>
                    <div className="text-center border-l border-gray-100">
                      <p className="text-[8px] text-gray-400 uppercase font-semibold">Done</p>
                      <p className="text-sm font-bold text-gray-800">{driver.completedTasks}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Deliveries Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#dec1af] overflow-hidden">
          <div className="p-6 border-b border-[#dec1af] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-6">
              <h3 className="font-bold text-lg text-[#574235]">Fleet Deliveries</h3>

              {/* Pagination Controls */}
              {totalDeliveries > 0 && (
                <div className="flex items-center gap-4 scale-90 origin-left">
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    <span>Total: <span className="font-bold text-gray-800">{totalDeliveries}</span></span>
                    <span className="text-gray-300">|</span>
                    <span>Page <span className="font-bold text-gray-800">{page}</span> of {totalPages}</span>
                  </div>
                  <DashboardPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className="w-full overflow-x-auto custom-scrollbar"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <table className="min-w-[1100px] w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap">
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4">Shipment ID</th>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Assigned Driver</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Current Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm whitespace-nowrap">
                {deliveries.length > 0 ? deliveries.map((shipment: any) => (
                  <ReactFragment key={shipment.id}>
                  <tr className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">#{shipment.id?.slice(0, 8) || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        shipment.provider === 'internal' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {shipment.provider || 'Unknown'}
                      </span>
                      <div className="mt-1 font-mono text-[10px] text-gray-400">
                        {shipment.providerOrderId || "No provider reference"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold">
                          {shipment.driver?.name?.[0] || 'D'}
                        </div>
                        <span className="text-gray-800 font-medium">{shipment.driver?.name || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700">{shipment.order?.user?.name || "N/A"}</div>
                      <div className="text-[10px] text-gray-400">{shipment.order?.user?.phone || "No phone"}</div>
                      <div className="text-[10px] text-gray-400">
                        Order #{shipment.order?.id?.slice(0, 8) || "N/A"} · ₦{Number(shipment.shippingFee || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaMapMarkerAlt size={12} className="text-orange-500" />
                        {shipment.events?.[0]?.location || "Central Hub"}
                      </div>
                      <div className="mt-1 text-[10px] text-gray-400">
                        {shipment.order?.shippingSnapshot?.city || shipment.order?.shippingSnapshot?.state || "No destination"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        shipment.status === 'delivered' ? 'bg-green-100 text-green-600' :
                        shipment.status === 'picked_up' ? 'bg-blue-100 text-blue-600' :
                        shipment.status === 'returned' ? 'bg-red-100 text-red-600' :
                        shipment.status === 'cancelled' ? 'bg-gray-100 text-gray-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {shipment.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex min-w-[180px] flex-nowrap items-center justify-end gap-1 whitespace-nowrap">
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => setExpandedShipment(expandedShipment === shipment.id ? null : shipment.id)}
                          className="cursor-pointer p-1.5 text-indigo-600 hover:text-indigo-800 transition-colors"
                          title="View items (per-product actions)"
                          aria-label="View items"
                        >
                          <FaBox size={14} style={{ color: "#4f46e5", display: "block" }} />
                        </span>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => openModal(<OrderDetailsModal orderId={shipment.order?.id} />)}
                          className="cursor-pointer p-1.5 text-slate-700 hover:text-slate-900 transition-colors"
                          title="View order details"
                          aria-label="View order details"
                        >
                          <FaEye size={14} style={{ color: "#334155", display: "block" }} />
                        </span>
                        {shipment.provider === "shipbubble" && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={() => trackMutation.mutate(shipment.id)}
                            aria-disabled={trackMutation.isPending}
                            className={`cursor-pointer p-1.5 text-blue-600 hover:text-blue-800 ${trackMutation.isPending ? "pointer-events-none opacity-60" : ""}`}
                            title="Refresh ShipBubble tracking"
                            aria-label="Refresh ShipBubble tracking"
                          >
                            <FaSyncAlt size={14} style={{ color: "#2563eb", display: "block" }} />
                          </span>
                        )}
                        {shipment.provider === "internal" && shipment.status !== "delivered" && shipment.status !== "cancelled" && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={() => deliverMutation.mutate(shipment.id)}
                            aria-disabled={deliverMutation.isPending}
                            className={`cursor-pointer p-1.5 text-emerald-600 hover:text-emerald-800 ${deliverMutation.isPending ? "pointer-events-none opacity-60" : ""}`}
                            title="Mark internal shipment delivered"
                            aria-label="Mark internal shipment delivered"
                          >
                            <FaCheckCircle size={14} style={{ color: "#059669", display: "block" }} />
                          </span>
                        )}
                        {shipment.status !== 'delivered' && shipment.status !== 'returned' && shipment.status !== 'cancelled' && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={() => statusMutation.mutate({ id: shipment.id, status: 'picked_up' })}
                            className="cursor-pointer p-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Mark Picked Up"
                            aria-label="Mark Picked Up"
                          >
                            <FaTruck size={14} style={{ color: "#2563eb", display: "block" }} />
                          </span>
                        )}
                        {shipment.status === 'picked_up' && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={() => statusMutation.mutate({ id: shipment.id, status: 'delivered' })}
                            className="cursor-pointer p-1.5 text-green-600 hover:text-green-800 transition-colors"
                            title="Mark Delivered"
                            aria-label="Mark Delivered"
                          >
                            <FaCheckCircle size={14} style={{ color: "#16a34a", display: "block" }} />
                          </span>
                        )}
                        {(shipment.status === 'picked_up' || shipment.status === 'assigned') && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={() => statusMutation.mutate({ id: shipment.id, status: 'returned' })}
                            className="cursor-pointer p-1.5 text-red-600 hover:text-red-800 transition-colors"
                            title="Mark Returned"
                            aria-label="Mark Returned"
                          >
                            <FaUndo size={14} style={{ color: "#dc2626", display: "block" }} />
                          </span>
                        )}
                        {shipment.status !== 'delivered' && shipment.status !== 'returned' && shipment.status !== 'cancelled' && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              setShipmentToCancel({
                                id: shipment.id,
                                reference: shipment.providerOrderId || shipment.id.slice(0, 8),
                              });
                            }}
                            className="cursor-pointer p-1.5 text-red-600 hover:text-red-800 transition-colors"
                            title="Cancel Shipment"
                            aria-label="Cancel Shipment"
                          >
                            <FaRegTimesCircle size={14} style={{ color: "#dc2626", display: "block" }} />
                          </span>
                        )}
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => handleReassign(shipment.id)}
                          className="cursor-pointer p-1.5 text-purple-600 hover:text-purple-800 transition-colors"
                          title="Reassign Provider"
                          aria-label="Reassign Provider"
                        >
                          <FaExchangeAlt size={14} style={{ color: "#9333ea", display: "block" }} />
                        </span>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => setAssigningShipment(shipment.id)}
                          className="cursor-pointer p-1.5 text-orange-600 hover:text-orange-800 transition-colors"
                          title="Assign Driver"
                          aria-label="Assign Driver"
                        >
                          <FaUserPlus size={14} style={{ color: "#ea580c", display: "block" }} />
                        </span>
                        <span role="button" tabIndex={0} className="cursor-pointer p-1.5 text-slate-600 hover:text-slate-900 transition-colors" title={shipment.trackingUrl ? "Open tracking" : "Tracking unavailable"} aria-label={shipment.trackingUrl ? "Open tracking" : "Tracking unavailable"} onClick={() => shipment.trackingUrl && window.open(shipment.trackingUrl, "_blank", "noopener,noreferrer")}>
                        <FaClock size={14} style={{ color: "#475569", display: "block" }} />
                        </span>
                      </div>
                    </td>
                  </tr>
                  {expandedShipment === shipment.id && (
                    <tr>
                      <td colSpan={7} className="bg-slate-50/80 px-6 py-4">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            Items in this shipment — act per product
                          </p>
                          <button
                            onClick={() => setExpandedShipment(null)}
                            className="text-[10px] font-bold text-gray-400 hover:text-gray-600"
                          >
                            Close
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(shipment.order?.items || []).length === 0 && (
                            <p className="text-xs text-gray-400 italic">No item data available.</p>
                          )}
                          {(shipment.order?.items || []).map((item: any) => (
                            <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-3">
                                  {item.product?.images?.[0]?.url && (
                                    <img src={item.product.images[0].url} alt={item.product.name} className="h-10 w-10 rounded-lg object-cover border border-gray-100" />
                                  )}
                                  <div>
                                    <p className="text-xs font-bold text-gray-800">{item.product?.name || item.productName}</p>
                                    <p className="text-[10px] text-gray-400">Qty {item.quantity} · ₦{Number(item.price || 0).toLocaleString()}</p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  {(item.fulfillments || []).map((f: any) => (
                                    <div key={f.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1">
                                      <span className="text-[10px] text-gray-500">{f.stationName || "Station"} · {f.quantity}</span>
                                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                        f.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                                        f.status === "FAILED" ? "bg-red-100 text-red-700" :
                                        f.status === "RETURNED" ? "bg-orange-100 text-orange-700" :
                                        f.status === "PICKED_UP" || f.status === "IN_TRANSIT" ? "bg-blue-100 text-blue-700" :
                                        "bg-gray-100 text-gray-600"
                                      }`}>
                                        {f.status || "PENDING"}
                                      </span>
                                      {f.status !== "DELIVERED" && f.status !== "FAILED" && f.status !== "RETURNED" && (
                                        <>
                                          <button
                                            onClick={() => fulfillmentMutation.mutate({ fulfillmentId: f.id, status: "DELIVERED" })}
                                            disabled={fulfillmentMutation.isPending}
                                            className="rounded bg-green-600 px-1.5 py-0.5 text-[9px] font-bold text-white hover:bg-green-700 disabled:opacity-50"
                                            title="Mark this item delivered"
                                          >
                                            Deliver
                                          </button>
                                          <button
                                            onClick={() => fulfillmentMutation.mutate({ fulfillmentId: f.id, status: "FAILED", note: "Failed by admin" })}
                                            disabled={fulfillmentMutation.isPending}
                                            className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white hover:bg-red-700 disabled:opacity-50"
                                            title="Mark this item failed"
                                          >
                                            Fail
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                  </ReactFragment>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-gray-400 italic">
                      No shipments found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {shipmentToCancel && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-shipment-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
              <FaRegTimesCircle size={22} />
            </div>
            <h2 id="cancel-shipment-title" className="text-lg font-bold text-gray-900">
              Cancel shipment?
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              This will cancel shipment <span className="font-mono font-semibold text-gray-900">#{shipmentToCancel.reference}</span>.
              The action will be recorded in the shipment event history.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShipmentToCancel(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Keep shipment
              </button>
              <button
                type="button"
                onClick={() => cancelMutation.mutate(shipmentToCancel.id)}
                disabled={cancelMutation.isPending}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelMutation.isPending && <Spinner size="small" color="#ffffff" />}
                {cancelMutation.isPending ? "Cancelling..." : "Cancel shipment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {shipmentToReassign && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900">Reassign provider</h2>
            <p className="mt-2 text-sm text-gray-600">Choose the provider for this shipment.</p>
            <select
              value={providerChoice}
              onChange={(event) => setProviderChoice(event.target.value as "internal" | "shipbubble")}
              className="mt-5 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="internal">Internal</option>
              <option value="shipbubble">ShipBubble</option>
            </select>
            <div className="mt-6 flex justify-end gap-3">
              <span
                role="button"
                tabIndex={0}
                onClick={() => setShipmentToReassign(null)}
                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={() => {
                  reassignMutation.mutate({ id: shipmentToReassign, provider: providerChoice });
                  setShipmentToReassign(null);
                }}
                className="cursor-pointer rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Confirm
              </span>
            </div>
          </div>
        </div>
      )}

      {assigningShipment && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Assign Driver</h3>
              <button onClick={() => setAssigningShipment(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500 mb-4">Select a driver for shipment <span className="font-mono font-bold text-blue-600">#{assigningShipment.slice(0, 8)}</span></p>
              <select
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
              >
                <option value="">Choose a driver...</option>
                {drivers.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                ))}
              </select>
              <button
                onClick={() => assignMutation.mutate({ shipmentId: assigningShipment, driverId: selectedDriverId })}
                disabled={!selectedDriverId || assignMutation.isPending}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all disabled:bg-gray-300"
              >
                {assignMutation.isPending ? "Assigning..." : "Confirm Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
