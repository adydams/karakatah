import React from "react";
import { useModal } from "../../contexts/hooks/useModal";
import { FiCalendar, FiTag, FiUser, FiInfo, FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

type Props = {
  transaction: any;
};

export default function TransactionDetailsModal({ transaction }: Props) {
  const { closeModal } = useModal();

  if (!transaction) return null;

  const isCredit = transaction.type === 'SALE_CREDIT' || (transaction.type === 'ADJUSTMENT' && transaction.netAmount > 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#dec1af] max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isCredit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {isCredit ? <FiArrowUpRight size={24} /> : <FiArrowDownRight size={24} />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#574235]">Transaction Details</h2>
            <p className="text-xs text-gray-500 font-mono">ID: {transaction.id}</p>
          </div>
        </div>
        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <FiCalendar className="text-gray-400" />
            <span className="text-gray-500">Date:</span>
            <span className="font-medium text-gray-800">{new Date(transaction.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FiTag className="text-gray-400" />
            <span className="text-gray-500">Type:</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              transaction.type === 'SALE_CREDIT' ? 'bg-green-100 text-green-600' :
              transaction.type === 'PAYOUT_DEBIT' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {transaction.type}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FiUser className="text-gray-400" />
            <span className="text-gray-500">Store:</span>
            <span className="font-medium text-gray-800">{transaction.store?.name || 'System'}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-center items-center text-center">
          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Net Amount</p>
          <p className={`text-3xl font-black ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
            {isCredit ? '+' : '-'}₦{Number(Math.abs(transaction.netAmount || 0)).toLocaleString()}
          </p>
          {transaction.type === 'SALE_CREDIT' && (
            <p className="text-[10px] text-gray-400 mt-2">
              Gross: ₦{Number(transaction.grossAmount || 0).toLocaleString()} | Comm: ₦{Number(transaction.commissionAmount || 0).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
        <div className="flex items-center gap-2 mb-2 text-[#574235] font-bold text-sm">
          <FiInfo size={16} />
          <span>Transaction Note</span>
        </div>
        <p className="text-sm text-gray-600 italic">
          "{transaction.description || 'No additional details provided for this transaction.'}"
        </p>
      </div>

      {transaction.orderId && (
        <div className="mt-6 p-4 rounded-xl border border-gray-100 bg-white flex justify-between items-center">
          <span className="text-sm text-gray-500">Linked Order ID:</span>
          <span className="font-mono text-xs font-bold text-blue-600">#{transaction.orderId.slice(0, 8)}</span>
        </div>
      )}
    </div>
  );
}
