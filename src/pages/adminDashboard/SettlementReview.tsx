import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiFinance } from "../../services/adminDashboard/apiFinance";
import NavBar from "../../components/NavBar";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";
import { FiCheckCircle, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router";

export default function SettlementReview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["adminSettlementEligible"],
    queryFn: () => apiFinance.getSettlementEligible(),
  });

  const settleMutation = useMutation({
    mutationFn: (walletIds: string[]) => apiFinance.confirmSettlement({ walletIds }),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["adminSettlementEligible"] });
      queryClient.invalidateQueries({ queryKey: ["adminFinanceWallets"] });
      queryClient.invalidateQueries({ queryKey: ["adminFinanceOverview"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to settle funds");
    },
  });

  const toggleWallet = (id: string) => {
    setSelectedWallets(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedWallets.length === (data?.data?.length || 0)) {
      setSelectedWallets([]);
    } else {
      setSelectedWallets(data?.data?.map((w: any) => w.walletId) || []);
    }
  };

  const handleConfirm = async () => {
    if (selectedWallets.length === 0) {
      toast.error("Please select at least one wallet to settle.");
      return;
    }
    await settleMutation.mutateAsync(selectedWallets);
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;

  const eligibleWallets = data?.data || [];

  return (
    <div className="font-primary w-full bg-gray-50 min-h-screen">
      <NavBar title="Settlement Review" />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition shadow-sm"
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">Review Eligible Settlements</h1>
            <p className="text-gray-500 text-sm">Verify and commit matured pending balances to available funds.</p>
          </div>
        </div>

        {eligibleWallets.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center">
            <FiCheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">All Caught Up!</h3>
            <p className="text-gray-500">There are currently no matured transactions awaiting settlement.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-orange-600"
                    checked={selectedWallets.length === eligibleWallets.length}
                    onChange={handleSelectAll}
                  />
                  <span className="text-sm font-semibold text-gray-700">Select All</span>
                </div>
                <div className="text-sm text-gray-500">
                  {selectedWallets.length} of {eligibleWallets.length} selected
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                    <tr className="border-b">
                      <th className="px-6 py-4 w-10"></th>
                      <th className="px-6 py-4">Store</th>
                      <th className="px-6 py-4">Settleable Amount</th>
                      <th className="px-6 py-4">Txs Count</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {eligibleWallets.map((wallet: any) => (
                      <tr key={wallet.walletId} className={`hover:bg-gray-50 transition-colors ${selectedWallets.includes(wallet.walletId) ? 'bg-orange-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-orange-600"
                            checked={selectedWallets.includes(wallet.walletId)}
                            onChange={() => toggleWallet(wallet.walletId)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800">{wallet.storeName}</div>
                          <div className="text-xs text-gray-500">{wallet.storeEmail}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-green-600">
                          ₦{wallet.settleableAmount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {wallet.transactionCount} txns
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedWallets([wallet.walletId])}
                            className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                          >
                            Select Only
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end items-center gap-4">
              <div className="text-right mr-4">
                <p className="text-sm text-gray-500">Total to be settled:</p>
                <p className="text-2xl font-black text-gray-800">
                  ₦{eligibleWallets
                    .filter((w: any) => selectedWallets.includes(w.walletId))
                    .reduce((sum, w) => sum + (w.settleableAmount || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleConfirm}
                disabled={selectedWallets.length === 0 || settleMutation.isPending}
                className="px-8 py-3 bg-[#f57c00] text-white rounded-xl font-bold hover:bg-[#e67300] transition-all shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {settleMutation.isPending ? "Processing..." : "Confirm Settlement"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
