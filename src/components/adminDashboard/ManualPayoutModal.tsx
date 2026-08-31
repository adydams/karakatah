import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../contexts/hooks/useModal";
import { apiFinance } from "../../services/adminDashboard/apiFinance";
import toast from "react-hot-toast";
import Spinner from "../Spinner";

export default function ManualPayoutModal() {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    storeId: "",
    amount: "",
    accountNumber: "",
    bankCode: "",
    accountName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: wallets, isLoading: loadingWallets } = useQuery({
    queryKey: ["adminFinanceWallets"],
    queryFn: () => apiFinance.getWallets(1, 100),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.storeId || !form.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const wallet = wallets?.data?.find((w: any) => w.storeId === form.storeId);
      if (!wallet) throw new Error("Store wallet not found");

      const res = await apiFinance.triggerPayout({
        ...form,
        walletId: wallet.id,
        amount: parseFloat(form.amount),
      });

      if (res.success) {
        toast.success("Payout triggered successfully");
        queryClient.invalidateQueries({ queryKey: ["adminFinancePayouts"] });
        queryClient.invalidateQueries({ queryKey: ["adminFinanceWallets"] });
        closeModal();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to trigger payout");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-[#dec1af] max-w-md w-full mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#574235]">Manual Payout</h2>
          <p className="text-sm text-gray-500">Initiate a fund transfer to a store.</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#574235]/70">Select Store</label>
            <select
              value={form.storeId}
              onChange={(e) => setForm({ ...form, storeId: e.target.value })}
              className="rounded-md border border-[#dec1af] p-2 outline-none focus:border-[#f57c00]"
              required
            >
              <option value="">Choose a store...</option>
              {wallets?.data?.map((w: any) => (
                <option key={w.storeId} value={w.storeId}>
                  {w.store?.name} (Available: ₦{w.availableBalance?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#574235]/70">Payout Amount (₦)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              className="rounded-md border border-[#dec1af] p-2 outline-none focus:border-[#f57c00]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#574235]/70">Bank Code</label>
              <input
                type="text"
                value={form.bankCode}
                onChange={(e) => setForm({ ...form, bankCode: e.target.value })}
                placeholder="e.g. 058"
                className="rounded-md border border-[#dec1af] p-2 outline-none focus:border-[#f57c00]"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#574235]/70">Account Number</label>
              <input
                type="text"
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                placeholder="10 digits"
                className="rounded-md border border-[#dec1af] p-2 outline-none focus:border-[#f57c00]"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#574235]/70">Account Name</label>
            <input
              type="text"
              value={form.accountName}
              onChange={(e) => setForm({ ...form, accountName: e.target.value })}
              placeholder="Enter full account name"
              className="rounded-md border border-[#dec1af] p-2 outline-none focus:border-[#f57c00]"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || loadingWallets}
            className="bg-[#f57c00] px-4 py-2 text-sm font-semibold text-white rounded-md hover:bg-[#e67300] disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? <Spinner type="small" /> : "Process Payout"}
          </button>
        </div>
      </form>
    </div>
  );
}
