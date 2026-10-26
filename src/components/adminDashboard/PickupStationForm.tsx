import React, { useState, useEffect } from "react";
import { createPickupStation, getPickupStationById, updatePickupStation } from "../../services/adminDashboard/apiPickupStation";
import { getStores } from "../../services/adminDashboard/apiStore";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Spinner from "../Spinner";
import MapPicker from "../MapPicker";

type Props = {
  open: boolean;
  stationId?: string;
  storeId?: string;
  onClose: () => void;
  onSaved: () => void;
};

export default function PickupStationForm({ open, stationId, storeId, onClose, onSaved }: Props) {
  const safeStationId = typeof stationId === "string" && stationId.trim() ? stationId : undefined;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    contactPerson: "",
    latitude: "",
    longitude: "",
  });
  const [selectedStoreId, setSelectedStoreId] = useState(storeId || "");

  const { data: storesResponse } = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
    enabled: open && !safeStationId,
  });
  const stores: any[] = storesResponse?.data || [];

  useEffect(() => {
    if (!safeStationId && !selectedStoreId && stores.length > 0) {
      setSelectedStoreId(storeId || stores[0].id);
    }
  }, [stores, safeStationId, storeId, selectedStoreId]);

  useEffect(() => {
    if (safeStationId) {
      const stationKey = safeStationId || "";
      async function loadStation() {
        try {
          setLoading(true);
          const res = await getPickupStationById(stationKey);
          if (res.data) {
            setFormData({
              name: res.data.name || "",
              address: res.data.address || "",
              phone: res.data.phone || "",
              email: res.data.email || "",
              contactPerson: res.data.contactPerson || "",
              latitude: res.data.latitude != null ? String(res.data.latitude) : "",
              longitude: res.data.longitude != null ? String(res.data.longitude) : "",
            });
          }
        } catch (err: any) {
          toast.error(err.message || "Failed to load station details");
        } finally {
          setLoading(false);
        }
      }
      loadStation();
    } else {
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        contactPerson: "",
        latitude: "",
        longitude: "",
      });
    }
  }, [stationId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!safeStationId && !selectedStoreId) {
      toast.error("Please select the store this station belongs to.");
      return;
    }
    setLoading(true);
    try {
      const payload: any = { ...formData };
      if (payload.latitude === "") delete payload.latitude;
      if (payload.longitude === "") delete payload.longitude;
      if (safeStationId) {
        await updatePickupStation(safeStationId, payload);
        toast.success("Station updated successfully");
      } else {
        payload.storeId = selectedStoreId || storeId || undefined;
        await createPickupStation(payload);
        toast.success("Station created successfully");
      }
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "An error occurred while saving the station");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {safeStationId ? "Edit Pickup Station" : "Add New Pickup Station"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {!safeStationId && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Owning Store</label>
              {stores.length === 0 ? (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-md p-2">
                  No stores available. Create a store first — stations must belong to a store.
                </p>
              ) : (
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-orange/50 text-sm bg-white"
                >
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Station Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-orange/50 text-sm"
              placeholder="e.g. Lekki Hub"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Full Address</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-orange/50 text-sm"
              placeholder="Enter complete street address"
              rows={3}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-orange/50 text-sm"
                placeholder="080..."
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-orange/50 text-sm"
                placeholder="hub@karakata.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Contact Person</label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-orange/50 text-sm"
              placeholder="Name of station manager"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-orange/50 text-sm"
                placeholder="e.g. 6.5244"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-orange/50 text-sm"
                placeholder="e.g. 3.3792"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Pin location on map</label>
            <p className="text-[11px] text-gray-400 -mt-0.5">
              Required for accurate fleet delivery pricing and inter-station transport fees.
            </p>
            <div className="rounded-lg border border-gray-200 overflow-hidden h-[320px]">
              <MapPicker
                initialLat={formData.latitude ? Number(formData.latitude) : undefined}
                initialLng={formData.longitude ? Number(formData.longitude) : undefined}
                onSelect={(res) => {
                  setFormData((current) => ({
                    ...current,
                    latitude: String(res.latitude),
                    longitude: String(res.longitude),
                  }));
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-orange/90 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Spinner size="small" /> : (safeStationId ? "Update Station" : "Create Station")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
