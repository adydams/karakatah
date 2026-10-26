import React, { useState } from "react";
import {
  FaShoppingCart, FaChartLine, FaHistory, FaCheckCircle,
  FaUserCheck, FaPiggyBank, FaRegClock, FaUndoAlt, FaShieldAlt
} from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import { PiUsersFourFill } from "react-icons/pi";
import { RiStoreFill } from "react-icons/ri";
import { MdLocalShipping, MdGroup } from "react-icons/md";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { NavLink } from "react-router";
import RangeInfo from "../../components/adminDashboard/RangeInfo";
import Table from "../../components/adminDashboard/Table";
import { useQuery } from "@tanstack/react-query";
import { apiFinance } from "../../services/adminDashboard/apiFinance";
import { getTopProducts, getCustomerStats } from "../../services/apiAdmin";
import Spinner from "../../components/Spinner";
import { formatPrice } from "../../utils/utils";

export default function Overview() {
  const [dateFilter, setDateFilter] = useState("Today");
  const [activeQueueTab, setActiveQueueTab] = useState("Critical");

  const { data: overviewData, isLoading: loadingOverview } = useQuery({
    queryKey: ["adminFinanceOverview"],
    queryFn: apiFinance.getOverview,
  });

  const { data: chartData, isLoading: loadingChart } = useQuery({
    queryKey: ["adminFinanceRevenueChart"],
    queryFn: apiFinance.getRevenueChart,
  });

  const { data: topProductsData, isLoading: loadingProducts } = useQuery({
    queryKey: ["adminTopProducts"],
    queryFn: getTopProducts,
  });

  const { data: customerStatsData, isLoading: loadingCustomers } = useQuery({
    queryKey: ["adminCustomerStats"],
    queryFn: getCustomerStats,
  });

  const stats = overviewData?.data;
  const revenueChart = chartData?.data || [];
  const topProducts = topProductsData?.data || [];
  const customerStats = customerStatsData?.data;

  const kpis = [
    {
      title: "Gross Merchandise Value",
      icon: <GiCash size={20} />,
      val: `₦${formatPrice(stats?.totalPlatformRevenue || 0)}`,
      trend: "+18.4% vs last week",
      highlight: `8% Take: ₦${formatPrice((stats?.totalPlatformRevenue || 0) * 0.08)}`,
      color: "bg-orange-100 text-orange-600",
      accent: "bg-orange-500"
    },
    {
      title: "Active Orders Velocity",
      icon: <FaShoppingCart size={20} />,
      val: "1,428 Orders",
      trend: "98.6% On Time",
      progress: { inTransit: 68, processing: 29, flags: 3 },
      color: "bg-blue-100 text-blue-600",
      accent: "bg-blue-500"
    },
    {
      title: "Available Liquidity Pool",
      icon: <FaPiggyBank size={20} />,
      val: `₦${formatPrice(stats?.totalAvailableBalance || 0)}`,
      trend: "Settleable: ₦7.94M",
      details: "Escrow: ₦18.42M",
      color: "bg-amber-100 text-amber-600",
      accent: "bg-amber-500"
    },
    {
      title: "Fulfillment Quality Index",
      icon: <FaUserCheck size={20} />,
      val: "99.4%",
      trend: "0.4% Claim Ratio",
      details: "9 Claims Active",
      color: "bg-green-100 text-green-600",
      accent: "bg-green-500"
    },
  ];

  if (loadingOverview || loadingChart || loadingProducts || loadingCustomers) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="big" />
      </div>
    );
  }

  return (
    <div className="font-primary w-full bg-[#f8f9ff] min-h-screen pb-10">
      {/* Operational Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold text-xs uppercase tracking-wider border border-orange-200">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Production Core
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <FaCheckCircle className="text-orange-500" />
            <span className="font-medium">18 Microservices Operational</span>
            <span className="text-gray-300">•</span>
            <span className="font-bold text-gray-700">99.98% SLA Guaranteed</span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <div className="bg-white shadow-sm rounded-lg p-1 flex items-center gap-1 border border-gray-200">
            {["Today", "Last 7D", "This Month"].map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  dateFilter === filter ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition-all text-xs font-semibold border border-gray-200">
            <FaHistory size={14} />
            Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white shadow-md hover:bg-orange-600 transition-all text-xs font-semibold">
            <RiStoreFill size={14} />
            + Onboard Store
          </button>
        </div>
      </div>

      {/* Executive KPI Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{kpi.title}</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">{kpi.val}</h2>
              </div>
              <div className={`p-3 rounded-xl ${kpi.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                {kpi.icon}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {kpi.progress ? (
                <div className="flex flex-col gap-2">
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
                    <div className={`h-full ${kpi.accent}`} style={{ width: `${kpi.progress.inTransit}%` }}></div>
                    <div className="bg-blue-300 h-full" style={{ width: `${kpi.progress.processing}%` }}></div>
                    <div className="bg-red-400 h-full" style={{ width: `${kpi.progress.flags}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> In-Transit</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-300"></span> Proc.</span>
                    <span className="flex items-center gap-1 text-red-500"><span className="w-2 h-2 rounded-full bg-red-400"></span> Flags</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-orange-600 text-xs font-bold flex items-center gap-1">
                    <FaChartLine size={12} /> {kpi.trend}
                  </span>
                  <span className="text-gray-400 text-xs font-medium">{kpi.highlight || kpi.details}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Analytical & Operations Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Analytics + Operational Queue */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          {/* Revenue & Commission Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Marketplace Velocity & Platform Yield</h3>
                  <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-600 text-[10px] font-bold uppercase border border-orange-200">Live Telemetry</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Real-time GMV aggregation alongside Karakata 8% commission capture.</p>
              </div>
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                {["GMV Volume", "Commission (₦)", "Net Payouts"].map((tab) => (
                  <button key={tab} className="px-3 py-1 rounded text-xs font-medium hover:bg-white hover:shadow-sm transition-all text-gray-600">
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col border border-gray-100 hover:bg-gray-100 transition-colors">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Peak Hourly Intake</span>
                <span className="text-2xl font-bold text-gray-900 mt-1">₦14.2M<span className="text-xs font-normal text-gray-500">/hr</span></span>
                <span className="text-orange-600 text-xs font-bold mt-1 flex items-center gap-1">
                  <FaChartLine size={10} /> 14:00 - 15:00 Today
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col border border-gray-100 hover:bg-gray-100 transition-colors">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Commission Yield</span>
                <span className="text-2xl font-bold text-orange-600 mt-1">₦1,136,000</span>
                <span className="text-gray-500 text-xs mt-1">Average 8.00% Net Take</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col border border-gray-100 hover:bg-gray-100 transition-colors">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Escrow Release Ratio</span>
                <span className="text-2xl font-bold text-gray-900 mt-1">96.8%</span>
                <span className="text-gray-500 text-xs mt-1">3.2% Held in Disputes</span>
              </div>
            </div>

            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChart}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f57c00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f57c00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#f57c00"
                    fillOpacity={1}
                    fill="url(#colorRev)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SuperAdmin Operational Queue */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">SuperAdmin Operational Queue</h3>
                <p className="text-sm text-gray-500 mt-1">Multi-vendor orders requiring immediate intervention or disbursement.</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors border border-gray-200">Bulk Release</button>
                <button className="px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition-colors shadow-sm">Resolve All SLA</button>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4">
              {["Critical", "Large Orders", "Store Approvals", "Fraud Alerts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveQueueTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    activeQueueTab === tab
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-400 text-[10px] uppercase tracking-widest bg-gray-50 rounded-lg">
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-4 font-semibold">Order / Store ID</th>
                    <th className="py-3 px-4 font-semibold">Merchant & Product</th>
                    <th className="py-3 px-4 font-semibold">Amount</th>
                    <th className="py-3 px-4 font-semibold">Station / Hub</th>
                    <th className="py-3 px-4 font-semibold">Escrow State</th>
                    <th className="py-3 px-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {topProducts.slice(0, 4).map((product, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-gray-900">#KKT-{10000 + idx}</span>
                          <span className="text-[10px] text-gray-400">Just now</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                            <FaShoppingCart />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-sm truncate max-w-[150px]">Vendor Store {idx + 1}</span>
                            <span className="text-xs text-gray-500 truncate max-w-[150px]">{product.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm">₦{formatPrice(product.revenue)}</span>
                          <span className="text-orange-600 text-[10px] font-bold uppercase">Fee: ₦{formatPrice(product.revenue * 0.08)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <RiStoreFill className="text-orange-500" />
                          <span>Main Hub</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase">
                          <span className="w-1 h-1 rounded-full bg-orange-500"></span> Paid & Ready
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors border border-gray-200">
                          Inspect QA
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Hubs, Settlement, Security */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          {/* Hub Capacity Monitor */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <RiStoreFill className="text-orange-500" />
                <h4 className="font-bold text-gray-900 tracking-tight">Hub Capacity</h4>
              </div>
              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-bold uppercase">Live Sensors</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Real-time parcel storage volume across Karakata flagship stations.</p>
            <div className="flex flex-col gap-4">
              {[
                { name: "Ikeja Central Hub", cap: 88, status: "Near Capacity", color: "bg-orange-500" },
                { name: "Lekki Boutique Hub", cap: 64, status: "Optimal Flow", color: "bg-orange-400" },
                { name: "Surulere Logistics", cap: 42, status: "Available Space", color: "bg-orange-300" },
                { name: "Abuja Wuse 2", cap: 71, status: "Normal", color: "bg-orange-500" },
              ].map((hub, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800">{hub.name}</span>
                    <span className="font-mono font-bold text-orange-600">{hub.cap}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className={`${hub.color} h-full rounded-full`} style={{ width: `${hub.cap}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-500">
                    <span>Storage Volume</span>
                    <span className="text-orange-600 font-medium">{hub.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-2 rounded-xl bg-gray-50 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 border border-gray-200">
              Manage Routing Matrix <FaUndoAlt size={12} />
            </button>
          </div>

          {/* Settlement Engine Widget */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaRegClock className="text-orange-500" />
                <h4 className="font-bold text-gray-900 tracking-tight">Settlement Engine</h4>
              </div>
              <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-600 text-[10px] font-bold uppercase">Cron Active</span>
            </div>
            <div className="p-4 rounded-xl bg-orange-50 flex flex-col my-4 border border-orange-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Next Auto-Disbursement</span>
                <span className="font-mono font-bold text-gray-900">00:01 WAT</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-orange-600 font-bold text-xs">
                <FaRegClock size={12} />
                <span>Countdown: 04h 12m 44s</span>
              </div>
            </div>
            <div className="space-y-2 text-xs mb-6">
              <div className="flex justify-between text-gray-500">
                <span>Settleable Pool:</span>
                <span className="font-bold text-gray-900">₦7,940,220.00</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Eligible Merchants:</span>
                <span className="font-semibold text-gray-900">14 Stores Cleared</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Transfer Gateway:</span>
                <span className="text-orange-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Paystack Ready
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex-1 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-all shadow-sm">
                Execute Pre-Run
              </button>
              <button className="px-3 py-2 rounded-xl bg-gray-50 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors border border-gray-200">
                Queue Details
              </button>
            </div>
          </div>

          {/* Security Audit Stream */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-orange-500" />
                <h4 className="font-bold text-gray-900 tracking-tight">Security Audit Stream</h4>
              </div>
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { user: "Adeyemi O.", action: "approved high-value refund #RET-8041", value: "₦850,000.00", time: "12m ago", icon: <FaCheckCircle className="text-green-500" /> },
                { user: "System", action: "reconciled 142 Paystack Webhooks", value: "No Errors", time: "34m ago", icon: <FaUndoAlt className="text-blue-500" /> },
                { user: "Store Admin", action: "requested tier promotion", value: "6.5% Rate", time: "1h ago", icon: <FaUndoAlt className="text-orange-500" /> },
                { user: "System", action: "created admin for Chinedu Eze", value: "Supervisor", time: "2h ago", icon: <FaUserCheck className="text-orange-500" /> },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5 border border-gray-100 group-hover:bg-orange-50 transition-colors">
                    {log.icon}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-700 leading-tight">
                      <strong className="text-orange-600">{log.user}</strong> {log.action} <span className="font-mono font-bold">{log.value}</span>.
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1">{log.time} • System Log</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 text-center text-xs text-orange-600 hover:text-orange-700 font-bold transition-colors">
              View Comprehensive Audit Ledger →
            </button>
          </div>
        </div>
      </div>

      {/* System Health Footer */}
      <footer className="mt-10">
        <div className="p-4 rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center flex-wrap justify-center md:justify-start gap-6 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">PostgreSQL Latency:</span>
              <strong className="text-gray-900 font-mono">14ms</strong>
            </div>
            <div className="hidden md:block h-4 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Primary Gateway:</span>
              <strong className="text-orange-600 font-mono">Paystack (Active)</strong>
            </div>
            <div className="hidden md:block h-4 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Logistics API:</span>
              <strong className="text-orange-600 font-mono">ShipBubble (Synced)</strong>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-medium">Karakata Enterprise Engine v4.8.2</span>
            <button className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors">
              <FaUndoAlt size={14} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
