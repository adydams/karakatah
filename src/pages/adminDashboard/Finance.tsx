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
import TransactionDetailsModal from "../../components/adminDashboard/TransactionDetailsModal";

export default function Finance() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  // --- Global Ledger State ---
  const [ledgerFilters, setLedgerFilters] = useState({
    search: "",
    type: "All Types",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    type: "All Types",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const filteredTransactions = transactions?.data?.filter((txn: any) => {
    const matchesSearch =
      !appliedFilters.search ||
      txn.id.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
      txn.store?.name?.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
      txn.orderId?.toLowerCase().includes(appliedFilters.search.toLowerCase());

    const matchesType = appliedFilters.type === "All Types" || txn.type === appliedFilters.type;

    return matchesSearch && matchesType;
  }) || [];

  const handleApplyFilters = () => {
    setAppliedFilters(ledgerFilters);
    setIsFilterOpen(false);
  };

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
    try {
      await apiFinance.triggerGlobalPayout();
      toast.success("Global settlement triggered successfully");
      queryClient.invalidateQueries({ queryKey: ["adminFinanceOverview"] });
      queryClient.invalidateQueries({ queryKey: ["adminFinanceWallets"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to trigger global payout");
    }
  };

  const handleVerifyPayment = async (paymentId: string) => {
    try {
      await apiFinance.verifyPayment(paymentId);
      toast.success("Payment status synchronized successfully");
      queryClient.invalidateQueries({ queryKey: ["adminGlobalTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["adminFinanceOverview"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to verify payment");
    }
  };

  const handleSettleWallet = async (walletId: string, storeName: string) => {
    try {
      await apiFinance.settleWallet(walletId);
      toast.success(`Settlement authorized for ${storeName}`);
      queryClient.invalidateQueries({ queryKey: ["adminFinanceWallets"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to authorize settlement");
    }
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

  const calcPercent = (num: number, den: number) => {
    const result = ((num / (den || 1)) * 100).toFixed(1);
    return result === "NaN" ? "0.0" : result;
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
      {/* Operational Status Bar */}
      <div className="bg-[#574235] text-white py-2 px-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Core Engine: Online</span>
          </div>
          <div className="flex items-center gap-1 border-l border-white/20 pl-4">
            <span>SLA: 99.98%</span>
          </div>
          <div className="flex items-center gap-1 border-l border-white/20 pl-4">
            <span>Settlement Window: Open</span>
          </div>
        </div>
        <div className="hidden md:block opacity-60">
          System Clock: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl text-white shadow-lg">
              <FiPieChart size={28} />
            </div>
            <div className="min-w-0 relative z-10">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight truncate">Financial Intelligence</h1>
              <p className="text-gray-500 text-sm truncate">Real-time liquidity monitoring and global revenue orchestration.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 relative z-10">
            <button
              onClick={handleExportReport}
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all text-sm font-bold shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto group"
            >
              <FiList size={16} className="group-hover:text-orange-600 transition-colors" />
              Export Ledger
            </button>
            <button
              onClick={handleGlobalPayout}
              className="px-5 py-2.5 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition-all text-sm font-bold shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <FiSend size={16} />
              Settle All Funds
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
            active={activeTab === "settlement"}
            onClick={() => setActiveTab("settlement")}
            icon={<FiSend />}
            label="Settlement Review"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                  title="Platform Revenue"
                  value={`₦${Number(stats.totalPlatformRevenue || 0).toLocaleString()}`}
                  icon={<FiTrendingUp />}
                  color="text-blue-600"
                  bg="bg-blue-50"
                  trend="+12.5%"
                  isUp={true}
                />
                <StatCard
                  title="Store Earnings"
                  value={`₦${Number(stats.totalStoreEarnings || 0).toLocaleString()}`}
                  icon={<FiShoppingBag />}
                  color="text-green-600"
                  bg="bg-green-50"
                  trend="+8.2%"
                  isUp={true}
                />
                <StatCard
                  title="Pending Balance"
                  value={`₦${Number(stats.totalPendingBalance || 0).toLocaleString()}`}
                  icon={<FiWalletIcon />}
                  color="text-amber-600"
                  bg="bg-amber-50"
                  trend="Awaiting settlement"
                  isUp={null}
                />
                <StatCard
                  title="Available for Payout"
                  value={`₦${Number(stats.totalAvailableBalance || 0).toLocaleString()}`}
                  icon={<FiCreditCard />}
                  color="text-purple-600"
                  bg="bg-purple-50"
                  trend="Ready to transfer"
                  isUp={null}
                  onClick={() => setActiveTab("wallets")}
                />
                <StatCard
                  title="VAT Collected"
                  value={`₦${Number(stats.totalVatCollected || 0).toLocaleString() || "0"}`}
                  icon={<FiPieChart />}
                  color="text-red-600"
                  bg="bg-red-50"
                  trend="Tax Liability"
                  isUp={null}
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
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0, 0 / 0.1)' }}
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
                          {calcPercent(stats.totalPlatformRevenue, stats.totalPlatformRevenue + stats.totalStoreEarnings)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#f57c00] h-2 rounded-full"
                          style={{ width: `${calcPercent(stats.totalPlatformRevenue, stats.totalPlatformRevenue + stats.totalStoreEarnings)}%` }}
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Pending Balance</span>
                        <span className="font-bold text-amber-600">
                          ₦{Number(stats.totalPendingBalance || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full"
                          style={{ width: `${calcPercent(stats.totalPendingBalance, stats.totalPendingBalance + stats.totalAvailableBalance)}%` }}
                        />
                      </div>
                      {Number(stats.totalPendingBalance || 0) > Number(stats.totalAvailableBalance || 0) && (
                        <p className="text-[10px] text-amber-600 mt-2 font-medium flex items-center gap-1">
                          ⚠️ High pending ratio: Review settlement windows
                        </p>
                      )}
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">VAT Contribution</span>
                        <span className="font-bold text-gray-800">
                          {calcPercent(stats.totalVatCollected, stats.totalPlatformRevenue + stats.totalStoreEarnings + stats.totalVatCollected)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${calcPercent(stats.totalVatCollected, stats.totalPlatformRevenue + stats.totalStoreEarnings + stats.totalVatCollected)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tax Liability Breakdown</h4>
                    <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-xs font-medium text-gray-700">Current VAT Period</span>
                      </div>
                      <span className="text-sm font-bold text-red-600">₦{Number(stats.totalVatCollected || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Health Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topStores.map((store: any) => {
                  const available = Number(store.availableBalance || 0);
                  const pending = Number(store.pendingBalance || 0);
                  const total = available + pending;
                  const availablePercent = total > 0 ? (available / total) * 100 : 0;

                  return (
                    <div key={store.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                            {store.store?.name?.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-sm font-bold text-gray-800 truncate max-w-[100px]">{store.store?.name}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          availablePercent > 80 ? 'bg-green-100 text-green-600' :
                          availablePercent > 40 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {availablePercent > 80 ? 'Liquid' : availablePercent > 40 ? 'Moderate' : 'At Risk'}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Available Balance</span>
                          <span className="font-bold text-gray-800">₦{available.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              availablePercent > 80 ? 'bg-green-500' :
                              availablePercent > 40 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${availablePercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Pending Balance</span>
                          <span className="font-bold text-amber-600">₦{pending.toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => openModal(<WalletDetailsModal walletId={store.id} />)}
                        className="w-full mt-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
                      >
                        View Full Ledger
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Global Ledger */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#dec1af] overflow-hidden">
                <div className="p-4 md:p-5 border-b border-[#dec1af] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-[#574235]">Global Transaction Ledger</h3>
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className={`p-2 rounded-lg transition-all ${isFilterOpen ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      <FiList size={16} />
                    </button>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Quick search..."
                      className="text-xs border border-[#dec1af] rounded px-2 py-1 outline-none w-full sm:w-48"
                      value={appliedFilters.search}
                      onChange={(e) => setAppliedFilters({...appliedFilters, search: e.target.value})}
                    />
                    <select
                      className="text-xs border border-[#dec1af] rounded px-2 py-1 outline-none w-full sm:w-auto"
                      value={appliedFilters.type}
                      onChange={(e) => setAppliedFilters({...appliedFilters, type: e.target.value})}
                    >
                      <option>All Types</option>
                      <option>SALE_CREDIT</option>
                      <option>PAYOUT_DEBIT</option>
                      <option>ADJUSTMENT</option>
                    </select>
                  </div>
                </div>
                {isFilterOpen && (
                  <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Search Term</label>
                      <input
                        type="text"
                        className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-orange-500"
                        value={ledgerFilters.search}
                        onChange={(e) => setLedgerFilters({...ledgerFilters, search: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Transaction Type</label>
                      <select
                        className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-orange-500"
                        value={ledgerFilters.type}
                        onChange={(e) => setLedgerFilters({...ledgerFilters, type: e.target.value})}
                      >
                        <option>All Types</option>
                        <option>SALE_CREDIT</option>
                        <option>PAYOUT_DEBIT</option>
                        <option>ADJUSTMENT</option>
                      </select>
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        onClick={() => setLedgerFilters({ search: "", type: "All Types", startDate: "", endDate: "", minAmount: "", maxAmount: "" })}
                        className="flex-1 px-3 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        Reset
                      </button>
                      <button
                        onClick={handleApplyFilters}
                        className="flex-1 px-3 py-2 text-xs font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition shadow-sm"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
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
                      {filteredTransactions.map((txn: any) => (
                        <tr
                          key={txn.id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => openModal(<TransactionDetailsModal transaction={txn} />)}
                        >
                          <td className="px-6 py-4 font-medium text-gray-700">#{txn.id.slice(0, 8)}</td>
                          <td className="px-6 py-4 text-gray-500">{new Date(txn.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-800">{txn.store?.name || 'System'}</div>
                            <div className="text-xs text-gray-400">Order: {txn.orderId?.slice(0, 8) || 'N/A'}</div>
                            {txn.order?.payment && (
                              <div className="text-[10px] font-mono text-orange-600">Ref: {txn.order.payment.reference?.slice(0, 12)}...</div>
                            )}
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
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                txn.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                              }`}>
                                {txn.status}
                              </span>
                              {txn.status !== 'COMPLETED' && txn.order?.payment && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVerifyPayment(txn.order.payment.id);
                                  }}
                                  className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-100 transition"
                                >
                                  Verify
                                </button>
                              )}
                            </div>
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
                        <td className="px-6 py-4 font-bold text-green-600">₦{Number(wallet.availableBalance || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold text-amber-600">₦{Number(wallet.pendingBalance || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-600">₦{Number(wallet.lifetimeEarnings || 0).toLocaleString()}</td>
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
          {activeTab === "settlement" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-[#dec1af] overflow-hidden">
                <div className="p-4 md:p-5 border-b border-[#dec1af] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-[#574235]">Settlement Review Queue</h3>
                    <p className="text-xs text-gray-400">Review and authorize funds transfers to vendor wallets.</p>
                  </div>
                  <button
                    onClick={handleGlobalPayout}
                    className="px-4 py-2 bg-[#f57c00] text-white rounded-xl font-bold text-sm hover:bg-[#e67300] transition-all shadow-sm"
                  >
                    Settle All Eligible
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                      <tr className="border-b">
                        <th className="px-6 py-3">Store Name</th>
                        <th className="px-6 py-3">Pending Balance</th>
                        <th className="px-6 py-3">Available Balance</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {wallets?.data?.filter((w: any) => w.pendingBalance > 0).map((wallet: any) => (
                        <tr key={wallet.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-800">{wallet.store?.name || 'Unknown Store'}</div>
                            <div className="text-xs text-gray-400">{wallet.store?.email}</div>
                          </td>
                          <td className="px-6 py-4 font-bold text-amber-600">₦{Number(wallet.pendingBalance || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 text-gray-600">₦{Number(wallet.availableBalance || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleSettleWallet(wallet.id, wallet.store?.name || 'Unknown Store')}
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                            >
                              Authorize
                            </button>
                          </td>
                        </tr>
                      ))}
                      {wallets?.data?.filter((w: any) => w.pendingBalance > 0).length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center text-gray-400 italic">
                            No pending settlements found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
                        <td className="px-6 py-4 font-bold text-gray-800">₦{Number(payout.amount || 0).toLocaleString()}</td>
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
                          Net: ₦{Number(txn.netAmount || 0).toLocaleString()} | Gross: ₦{Number(txn.grossAmount || 0).toLocaleString()}
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
          <div className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${
            isUp === true ? "bg-green-50 text-green-600" :
            isUp === false ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"
          }`}>
            {isUp === true && <FiArrowUpRight size={10} />}
            {isUp === false && <FiArrowDownRight size={10} />}
            {trend}
          </div>
        )}
      </div>
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
}
