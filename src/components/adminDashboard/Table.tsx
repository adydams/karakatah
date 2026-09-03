import React from "react";

type ProductTableProps = {
  data: {
    id: string | number;
    name: string;
    sales: number;
    revenue: number;
    status: string;
  }[];
};

export default function Table({ data = [] }: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Sales</th>
            <th className="px-4 py-3">Revenue</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-800">{product.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{product.sales}</td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-800">₦{product.revenue.toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                  product.status === "In Stock" ? "bg-green-100 text-green-700" :
                  product.status === "Low Stock" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {product.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
