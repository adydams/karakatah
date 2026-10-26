import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getReturns } from "../services/apiReturns";
import Spinner from "../components/Spinner";
import NavBar from "../components/Navbar";

export default function StoreReturnApprovals() {
  const { data, isLoading } = useQuery({
    queryKey: ["storePendingReturns"],
    queryFn: () => getReturns({ status: "APPROVED" }),
  });
  const returns = data?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Returned Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            These approved returns are waiting for your store to collect them.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner /></div>
          ) : returns.length === 0 ? (
            <p className="px-6 py-20 text-center text-gray-500">No returned products are waiting for collection.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Approved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {returns.map((item: any) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.orderItem?.product?.name || "Returned product"}</td>
                      <td className="px-6 py-4 text-gray-600">#{item.order?.id?.slice(-8).toUpperCase()}</td>
                      <td className="max-w-xs px-6 py-4 text-gray-600">{item.reason}</td>
                      <td className="px-6 py-4 text-gray-500">{item.reviewedAt ? new Date(item.reviewedAt).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
