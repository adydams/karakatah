import { FaOpencart } from "react-icons/fa6";
import { GiCash } from "react-icons/gi";
import { PiUsersFourFill } from "react-icons/pi";
import { GrTransaction } from "react-icons/gr";
import { LuSettings2 } from "react-icons/lu";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import RangeInfo from "../../components/adminDashboard/RangeInfo";
import Table from "../../components/adminDashboard/Table";
import { useQuery } from "@tanstack/react-query";
import { apiFinance } from "../../services/adminDashboard/apiFinance";
import { getTopProducts, getCustomerStats } from "../../services/apiAdmin";
import Spinner from "../../components/Spinner";
import { formatPrice } from "../../utils/utils";

const storeData = [
  {
    title: "Men",
    color: "#f97316",
    percent: "60",
  },
  {
    title: "Girl",
    color: "#10b981",
    percent: "20",
  },
  {
    title: "Dress",
    color: "#0f172a",
    percent: "80",
  },
];

export default function Overview() {
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

  const views = [
    {
      title: "Platform Revenue",
      icon: <GiCash size={20} />,
      val: `₦${formatPrice(stats?.totalPlatformRevenue || 0)}`,
    },
    {
      title: "Store Earnings",
      icon: <FaOpencart size={20} />,
      val: `₦${formatPrice(stats?.totalStoreEarnings || 0)}`,
    },
    {
      title: "Pending Balance",
      icon: <GrTransaction size={20} />,
      val: `₦${formatPrice(stats?.totalPendingBalance || 0)}`,
    },
    {
      title: "Available Balance",
      icon: <PiUsersFourFill size={20} />,
      val: `₦${formatPrice(stats?.totalAvailableBalance || 0)}`,
    },
  ];

  if (loadingOverview || loadingChart || loadingProducts || loadingCustomers) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="big" />
      </div>
    );
  }

  // Calculate percentages for customers
  const totalC = customerStats?.total || 0;
  const newC = customerStats?.new || 0;
  const retargetedC = customerStats?.retargeted || 0;

  const currentCustomersPercent = totalC > 0 ? Math.round((totalC / totalC) * 100) : 0; // This is always 100%
  const newCustomersPercent = totalC > 0 ? Math.round((newC / totalC) * 100) : 0;
  const retargetedCustomersPercent = totalC > 0 ? Math.round((retargetedC / totalC) * 100) : 0;

  const pieCustomerData = [
    { name: "Current Customers", value: totalC, color: "#f97316" },
    { name: "New Customers", value: newC, color: "#10b981" },
    { name: "Retargeted Customers", value: retargetedC, color: "#0f172a" },
  ];

  return (
    <div className="font-primary w-full">
      <div className="font-primary my-2 grid w-full grid-cols-2 gap-3 rounded-2xl py-5 px-5 bg-white shadow-sm/5 lg:mt-10 lg:mb-5 lg:grid-cols-4 lg:py-0">
        {views.map((view, index) => (
          <div
            key={index}
            className="flex w-full items-center justify-start gap-3 rounded-2xl bg-white px-3 py-2 text-sm shadow-sm/5 lg:my-0 lg:rounded-none lg:px-0 lg:py-0 lg:shadow-none"
          >
            <div className="bg-orange/10 text-orange flex h-[40px] w-[40px] items-center justify-center rounded-2xl lg:h-[50px] lg:w-[50px]">
              {view.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-medium sm:text-sm truncate">{view.title}</h3>
              <p className="text-lg font-bold truncate">{view.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Infographic */}

      <div className="grid w-full grid-cols-1 gap-5 text-xs lg:grid-cols-[2fr_1fr]">
        <div className="w-full rounded-lg bg-white p-5">
          <p className="font-primary text-sm font-medium">Revenue Trend</p>
          <h2 className="mb-5 text-xl font-bold">
            ₦{formatPrice(stats?.totalPlatformRevenue || 0)}
          </h2>

          <ResponsiveContainer height={300} width="100%">
            <AreaChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3" />
              <XAxis dataKey="date" />
              <YAxis unit="₦" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="totalRevenue"
                stroke="#02114d"
                fill="#c7d2fe"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Store visits */}
        <div className="w-full rounded-lg bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="">
              <h2 className="font-primary text-sm font-semibold">
                Store visits
              </h2>
              <p className="text-xs">Details about your store visits</p>
            </div>
            <LuSettings2 size={20} className="text-dark-gray/60" />
          </div>
          <div className="mt-5">
            {storeData.map((item, index) => (
              <RangeInfo
                key={index}
                title={item.title}
                percent={item.percent}
                color={item.color}
              />
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="w-full rounded-lg bg-white py-5">
          <div className="flex items-center justify-between px-5">
            <div className="">
              <h2 className="font-primary text-sm font-semibold">
                Top Products
              </h2>
              <p className="text-xs">Best selling products in your store</p>
            </div>
            <LuSettings2 size={20} className="text-dark-gray/60" />
          </div>

          <div className="mt-3 w-full">
            <Table data={topProducts} />
          </div>
        </div>

        {/* Customers */}
        <div className="w-full rounded-lg bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="">
              <h2 className="font-primary text-sm font-semibold">Customers</h2>
              <p className="text-xs">
                Information about your store's customers
              </p>
            </div>
            <LuSettings2 size={20} className="text-dark-gray/60" />
          </div>

          <div className="mt-5 flex flex-col items-center justify-center">
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="flex items-start justify-start gap-3">
                <div className="bg-orange mt-1 h-2 w-2 rounded-full"></div>
                <div className="font-semibold">
                  <p className="font-light">Current customers</p>
                  <p>{currentCustomersPercent}%</p>
                </div>
              </div>
              <div className="flex items-start justify-start gap-3">
                <div className="bg-muted-green mt-1 h-2 w-2 rounded-full"></div>
                <div className="font-semibold">
                  <p className="font-light">New customers</p>
                  <p>{newCustomersPercent}%</p>
                </div>
              </div>
              <div className="flex items-start justify-start gap-3">
                <div className="bg-deep-blue mt-1 h-2 w-2 rounded-full"></div>
                <div className="font-semibold">
                  <p className="font-light">Retargeted customers</p>
                  <p>{retargetedCustomersPercent}%</p>
                </div>
              </div>
            </div>

            <div className="w-full h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieCustomerData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={110}
                    paddingAngle={3}
                  >
                    {pieCustomerData.map((entry, index) => (
                      <Cell
                        fill={entry.color}
                        stroke={entry.color}
                        key={index}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
