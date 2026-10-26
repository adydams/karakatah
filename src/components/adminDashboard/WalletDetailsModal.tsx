import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFinance } from "../../services/adminDashboard/apiFinance";
import Spinner from "../Spinner";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { RiWallet3Line } from "react-icons/ri";
import { useModal } from "../../contexts/hooks/useModal";

type Props = {
  walletId: string;
};

export default function WalletDetailsModal({ walletId }: Props) {
  const { closeModal } = useModal();
  const { data, isLoading } = useQuery({
    queryKey: ["walletDetails", walletId],
    queryFn: async () => {
      const res = await apiFinance.getWalletDetails(walletId);
      return res.data;
    },
  });

  if (isLoading) return <div className="flex justify-center p-10"><Spinner /></div>;
  if (!data) return null;

  const { wallet, transactions } = data;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#dec1af] max-w-3xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
            <RiWallet3Line size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#574235]">{wallet.store?.name}</h2>
            <p className="text-xs text-gray-500">{wallet.store?.email}</p>
          </div>
        </div>
        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-green-50 border border-green-100">
          <p className="text-xs text-green-600 font-medium mb-1">Available Balance</p>
          <p className="text-xl font-bold text-green-700">₦{Number(wallet.availableBalance || 0).toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-xs text-amber-600 font-medium mb-1">Pending Balance</p>
          <p className="text-xl font-bold text-amber-700">₦{Number(wallet.pendingBalance || 0).toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-xs text-blue-600 font-medium mb-1">Lifetime Earnings</p>
          <p className="text-xl font-bold text-blue-700">₦{Number(wallet.lifetimeEarnings || 0).toLocaleString()}</p>
        </div>
      </div>

      <h3 className="font-bold text-[#574235] mb-4">Transaction History</h3>
      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((txn: any) => (
              <tr key={txn.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{new Date(txn.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-medium">{txn.type}</td>
                <td className={`px-4 py-3 text-right font-bold ${txn.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.netAmount >= 0 ? '+' : ''}₦{Math.abs(txn.netAmount).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">{txn.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
