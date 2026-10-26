import React from "react";
import NavBar from "../../components/NavBar";
import { FaTruck, FaBox, FaClock, FaRoute, FaCheckCircle } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { apiFinance } from "../../services/adminDashboard/apiFinance"; // reusing some finance/overview calls if applicable
import Spinner from "../../components/Spinner";

export default function Logistics() {
  const { data: logisticsData, isLoading: loading } = useQuery({
    queryKey: ["adminLogisticsOverview"],
    queryFn: async () => {
      // In a real app, this would call a specific /api/admin/logistics/overview endpoint
      // Simulating the response based on the Enterprise design
      return {
        data: {
          activeShipments: 124,
          avgDeliveryTime: "4.2 Hours",
          fleetUtilization: "78%",
          successRate: "99.2%",
          providers: [
            { name: "Karakata Internal", shipments: 85, status: "Operational", performance: "High" },
            { name: "ShipBubble", shipments: 39, status: "Connected", performance: "Medium" },
          ]
        }
      };
    }
  });

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="big" />
      </div>
    );
  }

  const stats = logisticsData?.data;

  return (
    <div className="font-primary w-full bg-gray-50 min-h-screen pb-10">
      <NavBar title="Logistics Orchestration" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Logistics KPI Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
              <FaTruck size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Shipments</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.activeShipments}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <FaClock size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Delivery Time</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.avgDeliveryTime}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
              <FaRoute size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fleet Utilization</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.fleetUtilization}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <FaCheckCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Delivery Success</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.successRate}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Provider Performance */}
          <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Provider Distribution</h3>
                <p className="text-sm text-gray-500">Shipment allocation between internal and external providers</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-400 text-[10px] uppercase font-bold tracking-widest bg-gray-50">
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4">Provider Name</th>
                    <th className="px-6 py-4">Active Shipments</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Performance Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {stats?.providers.map((provider: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-2">
                        <MdLocalShipping className="text-orange-500" />
                        {provider.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{provider.shipments}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-[10px] font-bold uppercase">
                          {provider.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${provider.performance === 'High' ? 'bg-green-500' : 'bg-orange-400'}`} style={{ width: provider.performance === 'High' ? '90%' : '60%' }}></div>
                          </div>
                          <span className="text-xs font-bold text-gray-500">{provider.performance}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Logistics Quick Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Operations Center</h3>
            <div className="space-y-3">
              <button className="w-full p-4 rounded-xl bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-all text-left flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm text-orange-600">
                    <FaBox size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Manage Shipments</p>
                    <p className="text-[10px] text-gray-500">Assign drivers & track flow</p>
                  </div>
                </div>
                <FaRoute className="text-gray-300 group-hover:text-orange-500 transition-colors" size={14} />
              </button>
              <button className="w-full p-4 rounded-xl bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-all text-left flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm text-orange-600">
                    <MdLocalShipping size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Pickup Stations</p>
                    <p className="text-[10px] text-gray-500">Manage hub capacity</p>
                  </div>
                </div>
                <FaRoute className="text-gray-300 group-hover:text-orange-500 transition-colors" size={14} />
              </button>
              <button className="w-full p-4 rounded-xl bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-all text-left flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm text-orange-600">
                    <FaCheckCircle size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">SLA Monitoring</p>
                    <p className="text-[10px] text-gray-500">Verify delivery deadlines</p>
                  </div>
                </div>
                <FaRoute className="text-gray-300 group-hover:text-orange-500 transition-colors" size={14} />
              </button>
            </div>
            <div className="mt-auto pt-6">
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <FaTruck size={14} />
                  <span className="text-xs font-bold uppercase">Fleet Alert</span>
                </div>
                <p className="text-[11px] text-orange-700 leading-relaxed">
                  3 Captains are currently overloaded in the Lekki region. Consider rerouting shipments to the Surulere Hub.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
