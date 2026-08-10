import { useQuery } from "@tanstack/react-query";
import { getPickupStations } from "../../services/adminDashboard/apiPickupStation";
import Spinner from "../../components/adminDashboard/Spinner";
import PickupStationForm from "../../components/adminDashboard/PickupStationForm";
import { MdSearch, MdEdit, MdAddLocation } from "react-icons/md";
import { useState } from "react";

export default function PickupStations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editStationId, setEditStationId] = useState<string | undefined>(undefined);

  const { data: response, isLoading: isFetching, refetch } = useQuery({
    queryKey: ["pickupStations"],
    queryFn: getPickupStations,
  });

  const stations = response?.data || [];
  const filteredStations = stations.filter((s: any) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isFetching) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner type="big" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#fbf8ff] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pickup Stations</h1>
          <p className="text-sm text-gray-500">Manage and monitor physical pickup locations across your coverage network.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-orange text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 hover:bg-orange/90 transition-all">
          <MdAddLocation size={18} />
          Add New Station
        </button>
      </div>

      {showForm && (
        <PickupStationForm open={showForm} onClose={() => { setShowForm(false); refetch(); }} onSaved={() => refetch()} />
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <div className="relative flex-grow w-full max-w-md">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by station name or address..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-orange/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-orange/50 bg-white">
            <option value="">All Districts</option>
            <option value="lekk">Lekki</option>
            <option value="ikeja">Ikeja</option>
            <option value="surulere">Surulere</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-orange/50 bg-white">
            <option value="">All Regions</option>
            <option value="lagos">Lagos</option>
            <option value="abuja">Abuja</option>
            <option value="ph">Port Harcourt</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStations.length > 0 ? (
          filteredStations.map((station: any) => (
            <div key={station.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <h3 className="font-bold text-gray-800 text-sm mb-2">{station.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{station.address}</p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-semibold">Mon-Fri:</span> 9:00 AM - 6:00 PM
                </div >
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-semibold">Sat:</span> 10:00 AM - 4:00 PM
                </div >
              </div >

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  <span className="font-semibold">Contact:</span> {station.contactPerson || "Admin"}
                </div >
                <button className="text-xs font-semibold text-orange hover:underline flex items-center gap-1">
                  <MdEdit size={14} /> Edit Details
                </button>
              </div >
            </div >
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500 text-sm">
            No pickup stations found.
          </div >
        )}

        {/* "New Location?" Placeholder Card */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-center hover:border-orange hover:bg-orange/5 transition-all cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-orange/20 transition-colors">
            <MdAddLocation className="text-gray-400 group-hover:text-orange" size={24} />
          </div >
          <h3 className="font-bold text-gray-700 text-sm mb-1">New Location?</h3>
          <p className="text-xs text-gray-500">Click here to add a new pickup station to the network</p>
        </div >
      </div >
    </div >
  );
}
