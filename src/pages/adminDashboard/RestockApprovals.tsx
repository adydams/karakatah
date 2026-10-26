import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getReturns, markPickedUp } from "../../services/apiReturns";
import { getHubs, type Hub } from "../../services/apiAdmin";
import Spinner from "../../components/Spinner";
import { FaSearch, FaFilter, FaCheckCircle } from "react-icons/fa";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import toast from "react-hot-toast";

export default function RestockApprovals() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [tempSearch, setTempSearch] = useState("");
  const [selectedHubs, setSelectedHubs] = useState<Record<string, string>>({});
  const { data: hubsData } = useQuery({ queryKey: ["activeHubs"], queryFn: getHubs });

  const offset = (page - 1) * limit;

  const { data: returnData, isLoading: loading } = useQuery({
    queryKey: ["adminRestocks", page, search],
    queryFn: () => getReturns({
    status: "approved",
      name: search,
      page,
      limit,
    }),
    placeholderData: (previousData) => previousData,
  });

  const applySearch = () => {
    setSearch(tempSearch);
    setPage(1);
  };

  const hubs: Hub[] = (hubsData?.data ?? []).filter((hub: Hub) => hub.isActive);

  const handleMarkPickedUp = async (id: string) => {
    const hubId = selectedHubs[id];
    if (!hubId) {
      toast.error("Select the hub where this returned item was collected");
      return;
    }
    if (!window.confirm("Confirm that the store owner has picked up this returned item?")) return;
    try {
      await markPickedUp(id, hubId);
      toast.success("Return marked as collected at the selected hub");
      queryClient.invalidateQueries({ queryKey: ["adminRestocks"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to confirm restock");
    }
  };

  const returns = returnData?.data ?? [];
  const totalRecords = returnData?.totalRecords || 0;
  const totalPages = returnData?.totalPages || 1;

  return (
    <div className="font-primary w-full bg-gray-50 min-h-screen">
      <NavBar title="Restock Approvals" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Restock Queue</h1>
            <p className="text-sm text-gray-500 mt-1">Review returned items and record the hub where each item was collected.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={tempSearch}
              onChange={(e) => setTempSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearch()}
              placeholder="Search by order ID or customer..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
            <button
              onClick={applySearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4">Return ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Approved Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <Spinner />
                    </td>
                  </tr>
                ) : returns.length > 0 ? returns.map((req: any) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-800">#{req.id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-800 font-medium">{req.user?.name || "Unknown"}</span>
                        <span className="text-xs text-gray-400">{req.user?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">#{req.order?.id?.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(req.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={selectedHubs[req.id] || ""}
                          onChange={(event) => setSelectedHubs((current) => ({ ...current, [req.id]: event.target.value }))}
                          className="max-w-[180px] rounded-lg border border-gray-200 px-2 py-1.5 text-xs"
                        >
                          <option value="">Select collection hub</option>
                          {hubs.map((hub) => <option key={hub.id} value={hub.id}>{hub.name}</option>)}
                        </select>
                        <button
                          onClick={() => handleMarkPickedUp(req.id)}
                          className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold text-xs transition-all flex items-center gap-2"
                        >
                          <FaCheckCircle size={14} />
                          Mark Collected
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic">
                      No pending restocks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalRecords > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <p className="text-xs text-gray-500">
                Showing <span className="font-bold text-gray-800">{offset + 1}</span> to <span className="font-bold text-gray-800">{Math.min(offset + limit, totalRecords)}</span> of <span className="font-bold text-gray-800">{totalRecords}</span> approvals
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 text-gray-600 transition-colors"
                >
                  <IoMdArrowBack size={18} />
                </button>
                <span className="text-xs font-bold text-gray-800 px-3">Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 text-gray-600 transition-colors"
                >
                  <IoMdArrowForward size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
