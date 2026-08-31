import React from "react";
import { Link } from "react-router";
import { RiStoreFill } from "react-icons/ri";

type StoreCardProps = {
  name: string;
  id: string;
};

export default function StoreCard({ name, id }: StoreCardProps) {
  return (
    <Link
      to={`/dashboard/stores/${id}`}
      className="group flex flex-col items-center justify-center p-5 bg-white rounded-2xl shadow-sm border border-[#dec1af] hover:border-[#f57c00] hover:shadow-md transition-all duration-300 text-center"
    >
      <div className="h-12 w-12 rounded-full bg-orange-50 text-[#f57c00] flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
        <RiStoreFill size={24} />
      </div>
      <h3 className="text-sm font-bold text-[#574235] truncate w-full group-hover:text-[#f57c00] transition-colors">
        {name}
      </h3>
      <span className="text-[10px] text-gray-400 mt-1">View Store</span>
    </Link>
  );
}
