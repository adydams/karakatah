import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "../../services/adminDashboard/apiAudit";
import Spinner from "../../components/Spinner";
import { FaSearch, FaFilter, FaShieldAlt, FaUndoAlt, FaCheckCircle } from "react-icons/fa";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";

export default function AuditTrail() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [tempSearch, setTempSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["auditLogs", currentPage, search, filterAction, filterEntity],
    queryFn: () => getAuditLogs({
      search,
      action: filterAction,
      entityType: filterEntity,
      page: currentPage,
      limit: 10,
    }),
  });

  const applyFilters = () => {
    setSearch(tempSearch);
    setCurrentPage(1);
  };

  if (isError) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-bold">{error instanceof Error ? error.message : "Failed to fetch audit logs"}</p>
        </div>
      </div>
    );
  }

  const logs = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalRecords = data?.totalRecords || 0;
  const offset = (currentPage - 1) * 10;

  return (
    <div className="font-primary w-full bg-gray-50 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Audit Ledger</h1>
            <p className="text-sm text-gray-500 mt-1">Immutable record of all administrative actions and financial movements.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold text-xs uppercase tracking-wider border border-orange-200">
            <FaShieldAlt size={12} />
            Read-Only Log
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={tempSearch}
              onChange={(e) => setTempSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              placeholder="Search user, action, or entity ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
            <button
              onClick={applyFilters}
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
              value={filterAction}
              onChange={(e) => { setFilterAction(e.target.value); setCurrentPage(1); }}
              className="p-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="PAYOUT_TRIGGER">Payout Trigger</option>
              <option value="SETTLEMENT_CONFIRM">Settlement Confirm</option>
            </select>
            <select
              value={filterEntity}
              onChange={(e) => { setFilterEntity(e.target.value); setCurrentPage(1); }}
              className="p-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="">All Entities</option>
              <option value="User">User</option>
              <option value="Wallet">Wallet</option>
              <option value="Payout">Payout</option>
              <option value="Product">Product</option>
              <option value="Order">Order</option>
              <option value="Shipment">Shipment</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4">Admin / User</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Change Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <Spinner />
                    </td>
                  </tr>
                ) : logs.length > 0 ? logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold">
                          {log.user?.name?.[0]?.toUpperCase() || "S"}
                        </div>
                        <span className="font-medium text-gray-800">{log.user?.name || "System"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        log.action === 'CREATE' ? 'bg-green-100 text-green-600' :
                        log.action === 'DELETE' ? 'bg-red-100 text-red-600' :
                        log.action === 'UPDATE' ? 'bg-blue-100 text-blue-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-800 font-medium">{log.entityType}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{log.entityId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate text-xs text-gray-600 font-mono bg-gray-50 p-1 rounded border border-gray-100" title={JSON.stringify(log.newValue)}>
                        {log.newValue ? JSON.stringify(log.newValue) : "No change data"}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic">
                      No audit logs found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalRecords > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <p className="text-xs text-gray-500">
                Showing <span className="font-bold text-gray-800">{offset + 1}</span> to <span className="font-bold text-gray-800">{Math.min(offset + 10, totalRecords)}</span> of <span className="font-bold text-gray-800">{totalRecords}</span> entries
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 text-gray-600 transition-colors"
                >
                  <IoMdArrowBack size={18} />
                </button>
                <span className="text-xs font-bold text-gray-800 px-3">Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
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
