import { useQuery } from "@tanstack/react-query";
import { getStores } from "../../services/adminDashboard/apiStore";
import Spinner from "../../components/adminDashboard/Spinner";
import { TiPlus } from "react-icons/ti";
import { Link } from "react-router";
import { MdEdit, MdDelete, MdSearch } from "react-icons/md";
import { useState } from "react";

export default function StoreHome() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: storeResponse, isLoading: isFetchingStore } = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
  });

  const stores = storeResponse?.data || [];

  const filteredStores = stores.filter((store: any) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isFetchingStore) {   
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner type="big" />
      </div>
      
    );
  }

  return (
    <div className="relative p-4">
      <div className="mb-10 flex w-full items-center justify-between">        

        <h1 className="text-lg font-bold sm:text-base md:text-lg lg:text-2xl">
          Store Management
        </h1>
        <Link
          to="/dashboard/stores/add"
          className="bg-orange flex h-10 items-center gap-2 px-4 rounded-md font-semibold text-white transition-all hover:bg-orange/90"
        >
          <TiPlus size={20} />
          <span className="text-xs">Add New Store</span>
        </Link>
        
      </div>

      <div className="mb-6 flex w-full items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by store name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-orange/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-50">
          Filters
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-50">
          Export
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-600">Store Name</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Owner</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Revenue</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Orders</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStores.length > 0 ? (
              filteredStores.map((store: any) => (
                <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        <Link
                          to={`/dashboard/stores/${store.id}`}
                          className="text-orange hover:underline"
                        >
                          {store.name}
                        </Link>
                      </td>
                  <td className="px-4 py-3 text-gray-600">
                    {store.ownerUserId ? "User ID: " + store.ownerUserId.substring(0, 8) : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">₦{store.revenue || "0.00"}</td>
                  <td className="px-4 py-3 text-gray-600">{store.orderCount || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      store.isDeleted ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                    }`}>
                      {store.isDeleted ? "Inactive" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/dashboard/stores/edit/${store.id}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <MdEdit size={16} />
                      </Link>
                      <button
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        onClick={() => {
                          if(confirm(`Are you sure you want to delete ${store.name}?`)) {
                            // Implement delete mutation here
                          }
                        }}
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                  No stores found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
