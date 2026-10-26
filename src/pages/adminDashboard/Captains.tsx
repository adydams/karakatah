import React, { useState, useEffect } from "react";
import { getCaptains } from "../../services/apiAdmin";
import Spinner from "../../components/Spinner";
import { FaUserEdit, FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { useModal } from "../../contexts/hooks/useModal";
import EditCaptainModal from "../../components/adminDashboard/EditCaptainModal";

export default function Captains() {
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filter state
  const [filters, setFilters] = useState({
    status: "",
    department: "",
  });

  const [tempSearch, setTempSearch] = useState("");

  const offset = (page - 1) * limit;

  const { data: captainData, isLoading: loading, isFetching: fetching } = useQuery({
    queryKey: ["adminCaptains", page, search, filters],
    queryFn: () => getCaptains({
      name: search,
      page,
      limit,
      ...filters
    }),
    placeholderData: keepPreviousData,
  });

  const applySearch = () => {
    setSearch(tempSearch);
    setPage(1);
  };

  const captains = captainData?.data ?? [];
  const totalRecords = captainData?.totalRecords || 0;
  const totalPages = captainData?.totalPages || 1;

  return (
    <div className="font-primary w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Fleet Captains</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your internal delivery fleet and monitor driver status.</p>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition-all shadow-md flex items-center gap-2">
            <FaPlus size={14} />
            Onboard New Captain
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={tempSearch}
              onChange={(e) => setTempSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearch()}
              placeholder="Search by name, email or phone..."
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
              <option value="Active">Active</option>
              <option value="Idle">Idle</option>
              <option value="Overloaded">Overloaded</option>
            </select>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="p-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="">All Departments</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Port Harcourt">Port Harcourt</option>
            </select>
          </div>
        </div>

        {/* Captains List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4">Captain</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Workload</th>
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
                ) : captains.length > 0 ? captains.map((captain: any) => (
                  <tr key={captain.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                          {captain.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{captain.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-600">{captain.email}</span>
                        <span className="text-xs text-gray-400">{captain.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{captain.department || "Not Assigned"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        captain.status === 'Active' ? 'bg-green-100 text-green-600' :
                        captain.status === 'Idle' ? 'bg-gray-100 text-gray-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {captain.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-800">{captain.activeTasks} Active</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs text-gray-500">{captain.completedTasks} Total</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(<EditCaptainModal captain={captain} />)}
                        className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-all"
                        title="Edit Captain"
                      >
                        <FaUserEdit size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400 italic">
                      No captains found matching the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {loading ? (
              <div className="px-6 py-20 flex justify-center">
                <Spinner />
              </div>
            ) : captains.length > 0 ? captains.map((captain: any) => (
              <div key={captain.id} className="p-4 space-y-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                      {captain.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{captain.name}</p>
                      <p className="text-xs text-gray-500">{captain.department || "Not Assigned"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(<EditCaptainModal captain={captain} />)}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-colors"
                  >
                    <FaUserEdit size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Contact</span>
                    <span className="text-gray-600 truncate">{captain.email}</span>
                    <span className="text-gray-500 text-xs">{captain.phone}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase inline-block ${
                      captain.status === 'Active' ? 'bg-green-100 text-green-600' :
                      captain.status === 'Idle' ? 'bg-gray-100 text-gray-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {captain.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span className="text-xs text-gray-500">Workload: <span className="font-bold text-gray-800">{captain.activeTasks} Active</span> / {captain.completedTasks} Total</span>
                </div>
              </div>
            )) : (
              <div className="px-6 py-20 text-center text-gray-400 italic">
                No captains found matching the filters.
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalRecords > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Showing <span className="font-bold text-gray-800">{offset + 1}</span> to <span className="font-bold text-gray-800">{Math.min(offset + limit, totalRecords)}</span> of <span className="font-bold text-gray-800">{totalRecords}</span> captains
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
  );
}
