import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getReturns, approveReturn, rejectReturn } from "../../services/apiReturns";
import Spinner from "../../components/Spinner";
import { FaSearch, FaFilter, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import toast from "react-hot-toast";
import { useModal } from "../../contexts/hooks/useModal";
import ReturnDetailsModal from "../../components/adminDashboard/ReturnDetailsModal";

export default function Returns() {
  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({ status: "" });
  const [tempSearch, setTempSearch] = useState("");

  const offset = (page - 1) * limit;

  const { data: returnData, isLoading: loading, isFetching: fetching } = useQuery({
    queryKey: ["adminReturns", page, search, filters],
    queryFn: () => getReturns({
      name: search,
      page,
      limit,
      ...filters
    }),
    placeholderData: (previousData) => previousData,
  });

  const applySearch = () => {
    setSearch(tempSearch);
    setPage(1);
  };

  const handleApprove = async (id: string) => {
    const faultParty = window.confirm("Set fault party to STORE? (Cancel for CUSTOMER)") ? "STORE" : "CUSTOMER";
    try {
      await approveReturn({ id, faultParty });
      toast.success("Return approved successfully");
      queryClient.invalidateQueries({ queryKey: ["adminReturns"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to approve return");
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt("Enter reason for rejection:");
    if (!reason) return;
    try {
      await rejectReturn({ id, reason });
      toast.success("Return rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["adminReturns"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to reject return");
    }
  };

  const returns = returnData?.data ?? [];
  const totalRecords = returnData?.totalRecords || 0;
  const totalPages = returnData?.totalPages || 1;

  return (
    <div className="font-primary w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Return Management</h1>
            <p className="text-sm text-gray-500 mt-1">Review and process product return requests from customers.</p>
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

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <FaFilter size={12} />
              Filters:
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="p-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
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
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
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
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.status === 'approved' ? 'bg-green-100 text-green-600' :
                        req.status === 'rejected' ? 'bg-red-100 text-red-600' :
                        req.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(<ReturnDetailsModal returnId={req.id} />)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                              title="Approve"
                            >
                              <FaCheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                              title="Reject"
                            >
                              <FaTimesCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400 italic">
                      No return requests found matching the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalRecords > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <p className="text-xs text-gray-500">
                Showing <span className="font-bold text-gray-800">{offset + 1}</span> to <span className="font-bold text-gray-800">{Math.min(offset + limit, totalRecords)}</span> of <span className="font-bold text-gray-800">{totalRecords}</span> requests
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
