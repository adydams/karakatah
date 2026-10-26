import React, { useState } from "react";
import { FaMoneyBillTransfer, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFinance } from "../../services/adminDashboard/apiFinance";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";

export default function Payouts() {
  const queryClient = useQueryClient();
  const { data: payoutsData, isLoading } = useQuery({
    queryKey: ["adminPayouts"],
    queryFn: apiFinance.getPayouts,
  });

  const triggerMutation = useMutation({
    mutationFn: (payoutData) => apiFinance.triggerPayout(payoutData),
    onSuccess: () => {
      toast.success("Payout triggered successfully");
      queryClient.invalidateQueries({ queryKey: ["adminPayouts"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to trigger payout"),
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="big" />
      </div>
    );
  }

  const payouts = payoutsData?.data || [];

  return (
    <div className="font-primary w-full bg-[#f8f9ff] min-h-screen pb-10 px-6 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payout Management</h1>
          <p className="text-sm text-gray-500 mt-1">Disburse funds to vendors and monitor payment status.</p>
        </div>
        <button
          onClick={() => {
            // Simple trigger for global payout as a shortcut
            // In a real app, this would open a modal
            // triggerMutation.mutate({ ... })
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white shadow-md hover:bg-orange-600 transition-all text-xs font-semibold"
        >
          <FaMoneyBillTransfer size={14} />
          Trigger Global Payout
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <FaMoneyBillTransfer className="text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Payout History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-6 font-semibold">Payout ID</th>
                  <th className="py-3 px-6 font-semibold">Store Name</th>
                  <th className="py-3 px-6 font-semibold">Amount</th>
                  <th className="py-3 px-6 font-semibold">Date</th>
                  <th className="py-3 px-6 font-semibold">Status</th>
                  <th className="py-3 px-6 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {payouts.length > 0 ? (
                  payouts.map((payout: any, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-4 px-6 font-mono font-bold text-gray-900">{payout.id}</td>
                      <td className="py-4 px-6 text-gray-600">{payout.store?.name || "Unknown Store"}</td>
                      <td className="py-4 px-6 font-bold text-gray-900">₦{payout.amount}</td>
                      <td className="py-4 px-6 text-gray-600">{new Date(payout.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          payout.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                          payout.status === 'PROCESSING' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                          <FaArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400 italic">
                      No payout records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
