import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { getPickupStations, getPickupStationsByStore, assignProductToStation } from "../../services/adminDashboard/apiPickupStation";

type Props = {
  open: boolean;
  onClose: () => void;
  productId: string | undefined;
  storeId?: string | null;
  onAssigned?: () => void;
};

export default function AssignToStationModal({ open, onClose, productId, storeId, onAssigned }: Props) {
  const [stations, setStations] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [initialStock, setInitialStock] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetch = async () => {
      try {
        let res;
        if (storeId) {
          res = await getPickupStationsByStore(storeId);
          setStations(res.data || []);
        } else {
          res = await getPickupStations();
          setStations(res.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [open, storeId]);

  if (!open) return null;

  const handleAssign = async () => {
    if (!productId || !selected) return;
    setLoading(true);
    try {
      await assignProductToStation(productId, selected, initialStock);
      setLoading(false);
      onAssigned && onAssigned();
      onClose();
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      alert(err?.message || "Failed to assign product to station");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] max-w-xl rounded-xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Assign product to pickup station</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FaTimes />
          </button>
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium">Select Station</label>
          <select className="mt-2 w-full border px-3 py-2 text-sm" value={selected || ""} onChange={(e) => setSelected(e.target.value)}>
            <option value="">-- Select Station --</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — {s.address}</option>
            ))}
          </select>

          <label className="text-xs font-medium mt-3">Initial stock</label>
          <input type="number" className="mt-2 w-full border px-3 py-2 text-sm" value={initialStock} onChange={(e) => setInitialStock(Number(e.target.value))} />

          <div className="mt-4 flex justify-end gap-2">
            <button onClick={onClose} className="border border-gray-200 px-4 py-2 rounded-md text-sm">Cancel</button>
            <button onClick={handleAssign} disabled={loading} className="bg-orange text-white px-4 py-2 rounded-md text-sm">{loading ? 'Assigning...' : 'Assign'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
