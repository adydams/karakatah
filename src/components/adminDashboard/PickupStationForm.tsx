import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Spinner from "./Spinner";
import { createPickupStation, updatePickupStation } from "../../services/adminDashboard/apiPickupStation";

type Props = {
  open: boolean;
  onClose: () => void;
  stationId?: string | undefined;
  onSaved?: () => void;
};

export default function PickupStationForm({ open, onClose, stationId, onSaved }: Props) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<any>();

  useEffect(() => {
    if (!open) return;
    if (stationId) {
      // Could fetch station by id if endpoint exists; using placeholder for now
      // For now, no prefill
    } else {
      reset({});
    }
  }, [open, stationId, reset]);

  if (!open) return null;

  async function onSubmit(data: any) {
    try {
      if (stationId) {
        await updatePickupStation(stationId, data);
      } else {
        await createPickupStation(data);
      }
      onSaved && onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to save pickup station");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] max-w-lg rounded-xl bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{stationId ? 'Edit' : 'Add'} Pickup Station</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Close</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs">Name</label>
            <input {...register('name')} className="w-full border px-3 py-2" />
          </div>

          <div>
            <label className="text-xs">Address</label>
            <input {...register('address')} className="w-full border px-3 py-2" />
          </div>

          <div>
            <label className="text-xs">Contact Person</label>
            <input {...register('contactPerson')} className="w-full border px-3 py-2" />
          </div>

          <div>
            <label className="text-xs">Phone</label>
            <input {...register('phone')} className="w-full border px-3 py-2" />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="border px-4 py-2">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-orange text-white px-4 py-2">{isSubmitting ? <Spinner type="small" /> : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
