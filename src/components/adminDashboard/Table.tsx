import React from "react";

const topProducts = [
  { id: 1, name: "Nike Air Max 270", sales: 120, revenue: 1200000, status: "In Stock" },
  { id: 2, name: "Adidas Ultraboost", sales: 95, revenue: 950000, status: "In Stock" },
  { id: 3, name: "Puma RS-X", sales: 80, revenue: 800000, status: "Low Stock" },
  { id: 4, name: "New Balance 574", sales: 70, revenue: 700000, status: "In Stock" },
  { id: 5, name: "Reebok Classic", sales: 60, revenue: 600000, status: "Out of Stock" },
];

export default function Table() {
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
          {topProducts.map((product) => (
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
