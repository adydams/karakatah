import React from "react";
import { FaEye, FaTrashAlt } from "react-icons/fa";

type TableOrderItemProps = {
  id?: string;
  createdAt?: string;
  customer?: string;
  priority?: string;
  total?: number;
  paymentStatus?: string;
  itemsCount?: number;
  deliveryNumber?: string;
  status?: string;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function TableOrderItem({
  id = "ORD-001",
  createdAt = "2026-08-27",
  customer = "John Doe",
  priority = "High",
  total = 15000,
  paymentStatus = "Paid",
  itemsCount = 3,
  deliveryNumber = "DEL-9988",
  status = "Processing",
  onView,
  onDelete,
}: TableOrderItemProps) {
  return (
    <div className="grid w-full grid-cols-10 items-center border-b border-gray-100 px-2 py-3 text-sm hover:bg-gray-50 transition-colors">
      <div className="text-gray-800 font-medium truncate">{id}</div>
      <div className="text-gray-600">{createdAt}</div>
      <div className="text-gray-800 truncate">{customer}</div>
      <div className="text-gray-600">{priority}</div>
      <div className="text-gray-800 font-semibold">₦{total?.toLocaleString()}</div>
      <div className="flex items-center gap-1">
        <span className={`h-2 w-2 rounded-full ${paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}></span>
        <span className="text-gray-600">{paymentStatus}</span>
      </div>
      <div className="text-gray-600">{itemsCount} items</div>
      <div className="text-gray-600 truncate">{deliveryNumber}</div>
      <div className="text-gray-600">{status}</div>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => onView?.(id)}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="View"
        >
          <FaEye size={14} />
        </button>
        <button
          onClick={() => onDelete?.(id)}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Delete"
        >
          <FaTrashAlt size={14} />
        </button>
      </div>
    </div>
  );
}
