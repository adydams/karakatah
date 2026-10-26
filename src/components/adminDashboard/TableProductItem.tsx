import React from "react";
import { FaEllipsisV, FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

type TableProductItemProps = {
  id: string;
  name: string;
  image: string | undefined;
  stock: string | number;
  rating: number;
  noReview: number;
  category: string | undefined;
  storeOwner: string | undefined;
  price: number;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TableProductItem({
  id,
  name,
  image,
  stock,
  rating,
  noReview,
  category,
  storeOwner,
  price,
  onView,
  onEdit,
  onDelete,
}: TableProductItemProps) {
  return (
    <div className="grid w-full grid-cols-[3fr_1fr_1fr_1fr_1fr_120px_120px] items-center border-b border-gray-100 px-2 py-3 text-sm hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-md overflow-hidden border border-gray-200 shrink-0">
          <img
            src={image || "https://via.placeholder.com/150"}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
        <span className="font-medium text-[#574235] truncate">{name}</span>
      </div>
      <div className="text-gray-800 font-semibold">₦{price?.toLocaleString()}</div>
      <div className="text-gray-600">{stock}</div>
      <div className="text-gray-500 truncate">{category || "N/A"}</div>
      <div className="text-gray-600 truncate">{storeOwner || "N/A"}</div>
      <div className="flex items-center gap-1 text-gray-600">
        <span className="font-medium">{rating}</span>
        <span className="text-[10px] text-gray-400">({noReview})</span>
      </div>
      <div className="group relative flex justify-end">
        <button
          type="button"
          aria-label={`Actions for ${name}`}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          <FaEllipsisV size={14} />
        </button>
        <div className="invisible absolute right-0 bottom-full z-20 mb-1 min-w-32 rounded-lg border border-gray-100 bg-white p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onView(id)}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-blue-600 transition-colors hover:bg-blue-50"
          >
            <FaEye size={12} />
            View
          </button>
          <button
            type="button"
            onClick={() => onEdit(id)}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-amber-600 transition-colors hover:bg-amber-50"
          >
            <FaEdit size={12} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-red-600 transition-colors hover:bg-red-50"
          >
            <FaTrashAlt size={12} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
