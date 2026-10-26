import React, { useState } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { FaChartLine, FaUsers, FaShoppingBag, FaPercentage } from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import { useQuery } from "@tanstack/react-query";
import { getCustomerStats, getTopProducts } from "../../services/apiAdmin";
import Spinner from "../../components/Spinner";
import { formatPrice } from "../../utils/utils";

// Mock Data for Trends (Usually fetched from a dedicated analytics endpoint)
const PERFORMANCE_DATA = [
  { month: "Jan", gmv: 4500000, orders: 1200, activeUsers: 400, conversion: 3.2 },
  { month: "Feb", gmv: 5200000, orders: 1400, activeUsers: 450, conversion: 3.5 },
  { month: "Mar", gmv: 4800000, orders: 1300, activeUsers: 420, conversion: 3.1 },
  { month: "Apr", gmv: 6100000, orders: 1600, activeUsers: 500, conversion: 3.8 },
  { month: "May", gmv: 5900000, orders: 1500, activeUsers: 480, conversion: 3.6 },
  { month: "Jun", gmv: 7200000, orders: 1800, activeUsers: 600, conversion: 4.1 },
];

export default function Analytics() {
  const { data: customerStatsData, isLoading: loadingCustomers } = useQuery({
    queryKey: ["adminCustomerStats"],
    queryFn: getCustomerStats,
  });

  const { data: topProductsData, isLoading: loadingProducts } = useQuery({
    queryKey: ["adminTopProducts"],
    queryFn: getTopProducts,
  });

  if (loadingCustomers || loadingProducts) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="big" />
      </div>
    );
  }

  const stats = customerStatsData?.data;
  const topProducts = topProductsData?.data || [];

  return (
    <div className="font-primary w-full bg-gray-50 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
              <FaUsers size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.total || 0}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <FaShoppingBag size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Order Value</p>
              <h3 className="text-2xl font-bold text-gray-900">₦{formatPrice(12500)}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <FaChartLine size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Growth Rate</p>
              <h3 className="text-2xl font-bold text-gray-900">+12.5%</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
              <FaPercentage size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Conv. Rate</p>
              <h3 className="text-2xl font-bold text-gray-900">3.8%</h3>
            </div>
          </div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* GMV & Order Volume Trend */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Growth Telemetry</h3>
                <p className="text-sm text-gray-500">GMV and Order volume trend over time</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                <FaChartLine size={12} />
                Live Sync
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_DATA}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f57c00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f57c00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36} align="right" />
                  <Area
                    type="monotone"
                    dataKey="gmv"
                    name="GMV (₦)"
                    stroke="#f57c00"
                    fill="url(#colorGmv)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="#3b82f6"
                    fill="transparent"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Acquisition & Retention */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">User Acquisition</h3>
                <p className="text-sm text-gray-500">Active user growth and retention velocity</p>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PERFORMANCE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="activeUsers" fill="#f57c00" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section: Vendor Performance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">High-Velocity Products</h3>
              <p className="text-sm text-gray-500">Top contributing products to marketplace GMV</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-gray-400 text-[10px] uppercase font-bold tracking-widest bg-gray-50">
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Units Sold</th>
                  <th className="px-6 py-4">Revenue Generated</th>
                  <th className="px-6 py-4">Contribution %</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {topProducts.map((product: any, idx: number) => {
                  const contribution = ((product.revenue / 50000000) * 100).toFixed(2); // Simulated total GMV for %
                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                      <td className="px-6 py-4 text-gray-600">{product.sales} units</td>
                      <td className="px-6 py-4 font-bold text-gray-900">₦{formatPrice(product.revenue)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full" style={{ width: `${Math.min(parseFloat(contribution), 100)}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-gray-500">{contribution}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          product.status === 'In Stock' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
