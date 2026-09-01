import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";
import { getAuditLogs } from "../../services/adminDashboard/apiAudit";
import { IoMdArrowDropdown } from "react-icons/io";

export default function AuditTrail() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");

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

  if (isError) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p>{error instanceof Error ? error.message : "Failed to fetch audit logs"}</p>
      </div>
    );
  }

  const logs = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="font-primary w-full">

      <div className="flex w-full flex-col rounded-xl bg-white px-3 py-3 shadow-sm/5 mt-10">
        <div className="flex w-full items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <h2 className="font-medium">Global System Logs</h2>
            <input
              type="text"
              placeholder="Search logs..."
              className="rounded-md border border-gray-300 px-3 py-1 outline-none focus:border-orange"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
            <select
              className="rounded-md border border-gray-300 px-2 py-1 outline-none focus:border-orange"
              value={filterAction}
              onChange={(e) => { setFilterAction(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="PAYOUT_TRIGGER">Payout Trigger</option>
            </select>
            <select
              className="rounded-md border border-gray-300 px-2 py-1 outline-none focus:border-orange"
              value={filterEntity}
              onChange={(e) => { setFilterEntity(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Entities</option>
              <option value="User">User</option>
              <option value="Wallet">Wallet</option>
              <option value="Payout">Payout</option>
              <option value="Product">Product</option>
              <option value="Order">Order</option>
            </select>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="border-dark-gray/40 flex items-center gap-2 rounded-md border px-3 py-2">
              All Logs
              <IoMdArrowDropdown size={18} />
            </div>
          </div>
        </div>

        <div className="bg-light-gray/40 border-dark-gray/10 mt-3 grid w-full grid-cols-[1fr_1fr_1fr_1fr_2fr] rounded-md border px-2 py-3 text-sm font-medium">
          <h3>User</h3>
          <h3>Action</h3>
          <h3>Entity</h3>
          <h3>Date</h3>
          <h3>Details</h3>
        </div>

        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Spinner type="big" />
          </div>
        ) : logs.length > 0 ? (
          <>
            {logs.map((log: any) => (
              <div key={log.id} className="grid w-full grid-cols-[1fr_1fr_1fr_1fr_2fr] border-b border-gray-100 px-2 py-3 text-sm">
                <span className="font-medium">{log.user?.name || "System"}</span>
                <span className="text-orange-600 font-bold">{log.action}</span>
                <span>{log.entityType} ({log.entityId})</span>
                <span className="text-gray-500">{new Date(log.createdAt).toLocaleString()}</span>
                <div className="text-xs text-gray-600 truncate max-w-xs" title={JSON.stringify(log.newValue)}>
                  {log.newValue ? `Changed to: ${JSON.stringify(log.newValue)}` : "No details available"}
                </div>
              </div>
            ))}
            {totalPages > 1 && (
              <DashboardPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="flex h-[600px] flex-col items-center justify-center">
            <p>No audit logs found</p>
          </div>
        )}
      </div>
    </div>
  );
}

