import { FaOpencart } from "react-icons/fa6";
import { GiCash } from "react-icons/gi";
import { PiUsersFourFill } from "react-icons/pi";
import { GrTransaction } from "react-icons/gr";
import { LuSettings2 } from "react-icons/lu";

import NavBar from "../../components/adminDashboard/NavBar";
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


const views = [
  {
    title: "Orders Completed",
    icon: <FaOpencart size={20} />,
    val: "1.24k",
  },
  {
    title: "Total revenue",
    icon: <GiCash size={20} />,
    val: "$168k",
  },
  {
    title: "No of Customers",
    icon: <PiUsersFourFill size={20} />,
    val: "2.5m",
  },
  {
    title: "Total sales made",
    icon: <GrTransaction size={20} />,
    val: "52,712",
  },
];

const weeklyRevenueData = [
  { day: "Monday", revenue: 1200 },
  { day: "Tuesday", revenue: 1850 },
  { day: "Wednesday", revenue: 1600 },
  { day: "Thursday", revenue: 2100 },
  { day: "Friday", revenue: 2750 },
  { day: "Saturday", revenue: 3200 },
  { day: "Sunday", revenue: 2400 },
];

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

const customerData = [
  { name: "Current Customers", value: 520, color: "#f97316" },
  { name: "New Customers", value: 310, color: "#10b981" },
  { name: "Retargeted Customers", value: 170, color: "#0f172a" },
];

export default function Overview() {
  return (
    <div className="font-primary w-full">
      <NavBar title="Dashboard" />

      <div className="font-primary my-2 grid w-full grid-cols-2 gap-3 rounded-2xl py-5 lg:mt-10 lg:mb-5 lg:grid-cols-4 lg:bg-white lg:px-5 lg:shadow-sm/5">
        {views.map((view, index) => (
          <div
            key={index}
            className="flex w-full items-center justify-start gap-3 rounded-2xl bg-white px-3 py-2 text-sm shadow-sm/5 lg:my-0 lg:rounded-none lg:px-0 lg:py-0 lg:shadow-none"
          >
            <div className="bg-orange/10 text-orange flex h-[40px] w-[40px] items-center justify-center rounded-2xl lg:h-[50px] lg:w-[50px]">
              {view.icon}
            </div>
            <div>
              <h3 className="text-xs font-medium sm:text-sm">{view.title}</h3>
              <p className="text-lg font-bold">{view.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Infographic */}

      <div className="grid w-full grid-cols-1 gap-5 text-xs lg:grid-cols-[2fr_1fr]">
        <div className="w-full rounded-lg bg-white p-5">
          <p className="font-primary text-sm font-medium">Revenue this week</p>
          <h2 className="mb-5 text-xl font-bold">$8,792</h2>

          <ResponsiveContainer height={300} width="100%">
            <AreaChart data={weeklyRevenueData}>
              <CartesianGrid strokeDasharray="3" />
              <XAxis dataKey="day" />
              <YAxis unit="₦" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#02114d"
                fill="#c7d2fe"
                // fill="#fde68a"
                // strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Store visits */}
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
            <Table />
          </div>
        </div>

        {/* Customers */}
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
            <div className="flex items-start justify-evenly gap-4 lg:gap-1">
              <div className="flex items-start justify-start gap-3">
                <div className="bg-orange mt-1 h-2 w-2 rounded-full"></div>
                <div className="font-semibold">
                  <p className="font-light">Current customers</p>
                  <p>66%</p>
                </div>
              </div>
              <div className="flex items-start justify-start gap-3">
                <div className="bg-muted-green mt-1 h-2 w-2 rounded-full"></div>
                <div className="font-semibold">
                  <p className="font-light">New customers</p>
                  <p>50%</p>
                </div>
              </div>
              <div className="flex items-start justify-start gap-3">
                <div className="bg-deep-blue mt-1 h-2 w-2 rounded-full"></div>
                <div className="font-semibold">
                  <p className="font-light">Retargeted customers</p>
                  <p>30%</p>
                </div>
              </div>
            </div>

            <div style={{ width: "300px", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerData}
                    dataKey="value"
                    nameKey="name"
                    cx="40%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={110}
                    paddingAngle={3}
                  >
                    {customerData.map((entry) => (
                      <Cell
                        fill={entry.color}
                        stroke={entry.color}
                        key={entry.value}
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
