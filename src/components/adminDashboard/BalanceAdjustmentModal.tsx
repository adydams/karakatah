import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../contexts/hooks/useModal";
import { apiFinance } from "../../services/adminDashboard/apiFinance";
import toast from "react-hot-toast";
import Spinner from "../Spinner";

type Props = {
  walletId: string;
  storeId: string;
  storeName: string;
};

export default function BalanceAdjustmentModal({ walletId, storeId, storeName }: Props) {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiFinance.adjustBalance({
        walletId,
        storeId,
        amount: parseFloat(amount),
        type,
        description,
      });

      if (res.success) {
        toast.success("Balance adjusted successfully");
        queryClient.invalidateQueries({ queryKey: ["adminFinanceWallets"] });
        queryClient.invalidateQueries({ queryKey: ["adminFinanceOverview"] });
        closeModal();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to adjust balance");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-[#dec1af] max-w-md w-full mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#574235]">Adjust Balance</h2>
          <p className="text-sm text-gray-500">Modifying funds for {storeName}</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#574235]/70">Amount (₦)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="rounded-md border border-[#dec1af] p-2 outline-none focus:border-[#f57c00]"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#574235]/70">Transaction Type</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setType("CREDIT")}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                type === "CREDIT" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              CREDIT (+)
            </button>
            <button
              type="button"
              onClick={() => setType("DEBIT")}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                type === "DEBIT" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              DEBIT (-)
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#574235]/70">Reason/Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Refund for Order #123"
            className="rounded-md border border-[#dec1af] p-2 outline-none focus:border-[#f57c00]"
            rows={3}
          />
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
            disabled={isSubmitting}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-md transition-all ${
              type === "CREDIT" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            } disabled:opacity-50`}
          >
            {isSubmitting ? <Spinner type="small" /> : "Apply Adjustment"}
          </button>
        </div>
      </form>
    </div>
  );
}
