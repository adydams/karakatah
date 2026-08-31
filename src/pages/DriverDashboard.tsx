import React, { useState, useEffect } from "react";
import { getDriverTasks, updateShipmentStatus } from "../services/apiDriver";
import Spinner from "../components/Spinner";

export default function DriverDashboard() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getDriverTasks();
        setTasks(res.data || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleStatusUpdate = async (shipmentId, status) => {
    try {
      await updateShipmentStatus(shipmentId, {
        status,
        location: "Current GPS Location",
        note: `Shipment marked as ${status}`
      });
      // Refresh tasks
      const res = await getDriverTasks();
      setTasks(res.data || []);
      if (selectedTask?.id === shipmentId) {
        setSelectedTask(prev => ({ ...prev, status }));
      }
      alert(`Shipment updated to ${status}`);
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="font-primary w-full min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Task List (Left Side) */}
      <div className="w-full lg:w-1/3 bg-white border-r border-gray-200 h-screen overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Today's Deliveries</h2>
          <p className="text-xs text-gray-500">{tasks.length} tasks assigned to you</p>
        </div>

        <div className="divide-y divide-gray-100">
          {tasks.length > 0 ? tasks.map((task, index) => (
            <div
              key={index}
              onClick={() => setSelectedTask(task)}
              className={`p-4 cursor-pointer transition hover:bg-blue-50 ${selectedTask?.id === task.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-gray-800">#{task.id.slice(0, 8)}...</span>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                  task.status === 'delivered' ? 'bg-green-100 text-green-600' :
                  task.status === 'in_transit' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {task.status || 'pending'}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">{task.order?.user?.name || "Customer"}</p>
              <p className="text-xs text-gray-400 truncate">{task.order?.shippingAddress?.addressLine1 || "No address provided"}</p>
            </div>
          )) : (
            <div className="p-10 text-center text-gray-500">No tasks for today. Take a break!</div>
          )}
        </div>
      </div>

      {/* Detail View (Right Side) */}
      <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
        {selectedTask ? (
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-gray-800">{selectedTask.order?.user?.name}</h2>
              <p className="text-gray-500 text-sm">{selectedTask.order?.user?.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-8 text-left border border-gray-200">
              <p className="text-xs uppercase font-bold text-gray-400 mb-2">Destination</p>
              <p className="text-gray-800 font-medium mb-4">
                {selectedTask.order?.shippingAddress?.addressLine1},<br />
                {selectedTask.order?.shippingAddress?.city}, {selectedTask.order?.shippingAddress?.state}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
                  Call Customer
                </button>
                <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-bold hover:bg-gray-300 transition">
                  View on Map
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleStatusUpdate(selectedTask.id, 'picked_up')}
                className="w-full py-3 rounded-xl font-bold border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
              >
                Mark as Picked Up
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedTask.id, 'in_transit')}
                className="w-full py-3 rounded-xl font-bold border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
              >
                Mark as In Transit
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedTask.id, 'delivered')}
                className="w-full py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 transition shadow-lg"
              >
                Mark as Delivered
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 000 4h12a2 2 0 000-4M9 5a2 2 0 012-2h6a2 2 0 012 2m-3 7h3m-3 4h3m-6 0h3" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">No Task Selected</h3>
            <p className="text-gray-500">Select a delivery from the left list to manage it.</p>
          </div>
        )}
      </div>
    </div>
  );
}
