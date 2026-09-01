import React, { useState, useEffect } from "react";
import { getDriversSummary, getActiveDeliveries } from "../../services/apiAdmin";
import Spinner from "../../components/Spinner";

type DriverSummary = {
  name: string;
  email: string;
  status: string;
  activeTasks: number;
  completedTasks: number;
};

type DeliveryShipment = {
  id: string;
  driver?: { name?: string };
  order?: { user?: { name?: string } };
  events?: Array<{ location?: string }>;
};

export default function Shipment() {
  const [drivers, setDrivers] = useState<DriverSummary[]>([]);
  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryShipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, deliveriesRes] = await Promise.all([
          getDriversSummary(),
          getActiveDeliveries(),
        ]);
        setDrivers(summaryRes.data || []);
        setActiveDeliveries(deliveriesRes.data || []);
      } catch (err) {
        console.error("Error fetching fleet data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="font-primary w-full p-5 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-medium">
          + Add New Shipment
        </button>
      </div>

      <p className="text-gray-600 mb-6">Manage driver workload and track active shipments in real-time.</p>

      {/* Driver Workload Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {drivers.map((driver, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-gray-800">{driver.name}</h3>
                <p className="text-xs text-gray-500">{driver.email}</p>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                driver.status === "Overloaded" ? "bg-red-100 text-red-600" :
                driver.status === "Active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
              }`}>
                {driver.status}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-xs text-gray-500">
                Tasks: <span className="font-bold text-gray-800">{driver.activeTasks}</span>
              </div>
              <div className="text-xs text-gray-500">
                Completed: <span className="font-bold text-gray-800">{driver.completedTasks}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Deliveries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Active Deliveries</h3>
          <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                <th className="px-6 py-3 border-b">Shipment ID</th>
                <th className="px-6 py-3 border-b">Assigned Driver</th>
                <th className="px-6 py-3 border-b">Customer</th>
                <th className="px-6 py-3 border-b">Last Location</th>
                <th className="px-6 py-3 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {activeDeliveries.length > 0 ? activeDeliveries.map((shipment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition border-b last:border-0">
                  <td className="px-6 py-4 font-medium text-blue-600">#{shipment.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200" />
                      {shipment.driver?.name || "Unassigned"}
                    </div>
                  </td>
                  <td className="px-6 py-4">{shipment.order?.user?.name || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {shipment.events?.[0]?.location || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 mr-3">Edit</button>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">Track</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No active deliveries at the moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
