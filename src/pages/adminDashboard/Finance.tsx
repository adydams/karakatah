import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFinance } from "../../services/adminDashboard/apiFinance";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";
import {
  FiTrendingUp, FiShoppingBag, FiCreditCard,
  FiPieChart, FiSend, FiList, FiArrowUpRight, FiArrowDownRight, FiCreditCard as FiWalletIcon
} from "react-icons/fi";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useModal } from "../../contexts/hooks/useModal";
import WalletDetailsModal from "../../components/adminDashboard/WalletDetailsModal";
import BalanceAdjustmentModal from "../../components/adminDashboard/BalanceAdjustmentModal";
import ManualPayoutModal from "../../components/adminDashboard/ManualPayoutModal";

export default function Finance() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  // --- Overview Data ---
  const { data: overview, isLoading: loadingOverview } = useQuery({
    queryKey: ["adminFinanceOverview"],
    queryFn: () => apiFinance.getOverview(),
  });

  const { data: chartData, isLoading: loadingChart } = useQuery({
    queryKey: ["adminFinanceChart"],
    queryFn: () => apiFinance.getRevenueChart(),
  });

  const { data: transactions, isLoading: loadingTrans } = useQuery({
    queryKey: ["adminGlobalTransactions"],
    queryFn: () => apiFinance.getGlobalTransactions(),
  });

  // --- Wallet Data ---
  const { data: wallets, isLoading: loadingWallets } = useQuery({
    queryKey: ["adminFinanceWallets", searchQuery],
    queryFn: () => apiFinance.getWallets(1, 50, searchQuery),
  });

  // --- Payout Data ---
  const { data: payouts, isLoading: loadingPayouts } = useQuery({
    queryKey: ["adminFinancePayouts"],
    queryFn: () => apiFinance.getPayouts(),
  });

  const handleGlobalPayout = async () => {
    navigate("/dashboard/finance/settlement-review");
  };

  const handleExportReport = async () => {
    try {
      const blob = await apiFinance.exportFinancialReport();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "financial_report.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      toast.error(err.message || "Failed to export report");
    }
  };

  if (loadingOverview || loadingTrans || loadingWallets || loadingPayouts || loadingChart) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  const stats = overview?.data || {};
  const formattedChartData = chartData?.data?.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' }),
    revenue: parseFloat(item.totalRevenue || 0),
    platform: parseFloat(item.platformRevenue || 0),
  })) || [];

  const topStores = [...(wallets?.data || [])]
    .sort((a: any, b: any) => (b.lifetimeEarnings || 0) - (a.lifetimeEarnings || 0))
    .slice(0, 5);

  return (
    <div className="font-primary w-full bg-white min-h-screen">

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-[#dec1af]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#f57c00] rounded-xl text-white shrink-0">
              <FiPieChart size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-extrabold text-[#574235] tracking-tight truncate">Finance Control Center</h1>
              <p className="text-[#574235]/70 text-xs md:text-sm truncate">Orchestrate ecosystem revenue, manage vendor funds, and monitor platform liquidity.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-white border border-[#dec1af] text-[#574235] rounded-xl hover:bg-gray-50 transition-all text-sm font-semibold shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <FiList size={16} />
              Export Report
            </button>
            <button
              onClick={handleGlobalPayout}
              className="px-4 py-2 bg-[#f57c00] text-white rounded-xl hover:bg-[#e67300] transition-all text-sm font-semibold shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <FiSend size={16} />
              Global Payout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 gap-4 md:gap-8">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon={<FiPieChart />}
            label="Overview"
          />
          <TabButton
            active={activeTab === "wallets"}
            onClick={() => setActiveTab("wallets")}
            icon={<FiWalletIcon />}
            label="Store Wallets"
          />
          <TabButton
            active={activeTab === "payouts"}
            onClick={() => setActiveTab("payouts")}
            icon={<FiSend />}
            label="Payouts"
          />
          <TabButton
            active={activeTab === "audit"}
            onClick={() => setActiveTab("audit")}
            icon={<FiList />}
            label="Financial Audit"
          />
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid - Bento Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Platform Revenue"
                  value={`₦${stats.totalPlatformRevenue?.toLocaleString()}`}
                  icon={<FiTrendingUp />}
                  color="text-blue-600"
                  bg="bg-blue-50"
                  trend="+12.5%"
                  isUp={true}
                />
                <StatCard
                  title="Store Earnings"
                  value={`₦${stats.totalStoreEarnings?.toLocaleString()}`}
                  icon={<FiShoppingBag />}
                  color="text-green-600"
                  bg="bg-green-50"
                  trend="+8.2%"
                  isUp={true}
                />
                <StatCard
                  title="Pending Balance"
                  value={`₦${stats.totalPendingBalance?.toLocaleString()}`}
                  icon={<FiWalletIcon />}
                  color="text-amber-600"
                  bg="bg-amber-50"
                  trend="Awaiting settlement"
                  isUp={null}
                />
                <StatCard
                  title="Available for Payout"
                  value={`₦${stats.totalAvailableBalance?.toLocaleString()}`}
                  icon={<FiCreditCard />}
                  color="text-purple-600"
                  bg="bg-purple-50"
                  trend="Ready to transfer"
                  isUp={null}
                  onClick={() => setActiveTab("wallets")}
                />
              </div>

              {/* Main Analytics Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-[#dec1af]">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 className="font-bold text-[#574235]">Revenue Growth</h3>
                    <select className="text-xs border border-[#dec1af] rounded px-2 py-1 outline-none text-[#574235] bg-white w-full sm:w-auto">
                      <option>Last 30 Days</option>
                      <option>Last 6 Months</option>
                      <option>This Year</option>
                    </select>
                  </div>
                  <div className="h-64 md:h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={formattedChartData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f57c00" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#f57c00" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#f57c00" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                        <Area type="monotone" dataKey="platform" stroke="#574235" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Distribution */}
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-[#dec1af]">
                  <h3 className="font-bold text-[#574235] mb-6">Financial Health</h3>
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Platform Margin</span>
                        <span className="font-bold text-gray-800">
                          {((stats.totalPlatformRevenue / (stats.totalPlatformRevenue + stats.totalStoreEarnings || 1)) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#f57c00] h-2 rounded-full"
                          style={{ width: `${(stats.totalPlatformRevenue / (stats.totalPlatformRevenue + stats.totalStoreEarnings || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Payout Liquidity</span>
                        <span className="font-bold text-gray-800">
                          {((stats.totalAvailableBalance / (stats.totalAvailableBalance + stats.totalPendingBalance || 1)) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(stats.totalAvailableBalance / (stats.totalAvailableBalance + stats.totalPendingBalance || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 italic text-center mt-4">
                      Values are synchronized in real-time from store wallets.
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Performance Leaderboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-[#dec1af]">
                  <h3 className="font-bold text-[#f57c00] mb-4">Top Earning Stores</h3>
                  <div className="space-y-4">
                    {topStores.map((store: any, idx: number) => (
                      <div key={store.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors gap-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-sm font-medium text-gray-700 truncate">{store.store?.name}</span>
                        </div>
                        <span className="text-sm font-bold text-green-600 shrink-0">₦{store.lifetimeEarnings?.toLocaleString()}</span>
                      </div>
                    ))}
                    {topStores.length === 0 && <p className="text-xs text-gray-400 text-center">No store data available.</p>}
                  </div>
                </div>
                <div className="lg:col-span-2 bg-[#f57c00] p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-2">Platform Liquidity Insight</h3>
                    <p className="text-orange-100 text-sm mb-6 max-w-md">
                      Your platform currently holds ₦{stats.totalAvailableBalance?.toLocaleString()} ready for payout.
                      This represents the current liquidity available to be transferred to vendors.
                    </p>
                    <button
                      onClick={handleGlobalPayout}
                      className="px-6 py-2 bg-white text-[#f57c00] rounded-xl font-bold text-sm hover:bg-orange-50 transition-all shadow-md"
                    >
                      Settle All Eligible Wallets
                    </button>
                  </div>
                  <FiPieChart size={120} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
                </div>
              </div>

              {/* Global Ledger */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#dec1af] overflow-hidden">
                <div className="p-4 md:p-5 border-b border-[#dec1af] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="font-bold text-[#574235]">Global Transaction Ledger</h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search Txn ID or Store..."
                      className="text-xs border border-[#dec1af] rounded px-2 py-1 outline-none w-full sm:w-48"
                      onChange={(e) => {
                        // Filter logic should be handled by state
                      }}
                    />
                    <select className="text-xs border border-[#dec1af] rounded px-2 py-1 outline-none w-full sm:w-auto">
                      <option>All Types</option>
                      <option>SALE_CREDIT</option>
                      <option>PAYOUT_DEBIT</option>
                      <option>ADJUSTMENT</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                      <tr className="border-b">
                        <th className="px-6 py-3">Txn ID</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Entity</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transactions?.data?.map((txn: any) => (
                        <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-700">#{txn.id.slice(0, 8)}</td>
                          <td className="px-6 py-4 text-gray-500">{new Date(txn.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-800">{txn.store?.name || 'System'}</div>
                            <div className="text-xs text-gray-400">Order: {txn.orderId?.slice(0, 8) || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                              txn.type === 'SALE_CREDIT' ? 'bg-green-100 text-green-600' :
                              txn.type === 'PAYOUT_DEBIT' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {txn.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-800">
                            ₦{parseFloat(txn.grossAmount || txn.netAmount || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              txn.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                              {txn.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "wallets" && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#dec1af] overflow-hidden">
              <div className="p-4 md:p-5 border-b border-[#dec1af] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-[#574235]">Store Wallets</h3>
                <input
                  type="text"
                  placeholder="Search store..."
                  className="text-sm border border-[#dec1af] rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-[#f57c00] w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                    <tr className="border-b">
                      <th className="px-6 py-3">Store Name</th>
                      <th className="px-6 py-3">Available Balance</th>
                      <th className="px-6 py-3">Pending Balance</th>
                      <th className="px-6 py-3">Lifetime Earnings</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {wallets?.data?.map((wallet: any) => (
                      <tr key={wallet.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">{wallet.store?.name || 'Unknown Store'}</div>
                          <div className="text-xs text-gray-400">{wallet.store?.email}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-green-600">₦{wallet.availableBalance?.toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold text-amber-600">₦{wallet.pendingBalance?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-600">₦{wallet.lifetimeEarnings?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-4">
                            <button
                              className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                              onClick={() => openModal(<WalletDetailsModal walletId={wallet.id} />)}
                            >
                              View Details
                            </button>
                            <button
                              className="text-orange-600 hover:text-orange-800 text-xs font-bold"
                              onClick={() => openModal(<BalanceAdjustmentModal walletId={wallet.id} storeId={wallet.store?.id} storeName={wallet.store?.name} />)}
                            >
                              Adjust Balance
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "payouts" && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#dec1af] overflow-hidden">
              <div className="p-4 md:p-5 border-b border-[#dec1af] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-[#574235]">Payout History</h3>
                <button
                  className="px-3 py-1 bg-[#f57c00] text-white rounded-md text-xs font-bold hover:bg-[#e67300] w-full sm:w-auto"
                  onClick={() => openModal(<ManualPayoutModal />)}
                >
                  Manual Payout
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                    <tr className="border-b">
                      <th className="px-6 py-3">Payout ID</th>
                      <th className="px-6 py-3">Store</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Completed At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payouts?.data?.map((payout: any) => (
                      <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-700">#{payout.id.slice(0, 8)}</td>
                        <td className="px-6 py-4 text-gray-800">{payout.store?.name || 'N/A'}</td>
                        <td className="px-6 py-4 font-bold text-gray-800">₦{payout.amount?.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            payout.status === 'PAID' ? 'bg-green-100 text-green-600' :
                            payout.status === 'FAILED' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {payout.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {payout.completedAt ? new Date(payout.completedAt).toLocaleDateString() : 'Pending'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#dec1af] overflow-hidden">
              <div className="p-4 md:p-5 border-b border-[#dec1af]">
                <h3 className="font-bold text-[#574235]">Financial Audit Trail</h3>
                <p className="text-xs text-gray-400">Immutable log of all fund movements across the platform.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                    <tr className="border-b">
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">Action</th>
                      <th className="px-6 py-3">Entity</th>
                      <th className="px-6 py-3">Details</th>
                      <th className="px-6 py-3">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions?.data?.map((txn: any) => (
                      <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-500 text-xs">{new Date(txn.createdAt).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-700">{txn.type}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {txn.store?.name || 'System'}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          Net: ₦{txn.netAmount?.toLocaleString()} | Gross: ₦{txn.grossAmount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {txn.userId ? `User #${txn.userId.slice(0, 8)}` : 'Automated'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-1 py-4 text-sm font-medium transition-all relative shrink-0 ${
        active ? "text-[#f57c00]" : "text-[#574235]/60 hover:text-[#574235]"
      }`}
    >
      {icon}
      {label}
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f57c00]" />}
    </button>
  );
}

function StatCard({ title, value, icon, color, bg, trend, isUp, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl shadow-sm border border-[#dec1af] transition-all cursor-pointer hover:shadow-md hover:-translate-y-1 ${onClick ? 'hover:border-[#f57c00]' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${bg} rounded-xl ${color} text-xl`}>{icon}</div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1 ${
            isUp === true ? "bg-green-50 text-green-600" :
            isUp === false ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"
          }`}>
            {isUp === true && <FiArrowUpRight />}
            {isUp === false && <FiArrowDownRight />}
            {trend}
          </span>
        )}
      </div>
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
}
