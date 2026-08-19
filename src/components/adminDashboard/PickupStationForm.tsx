import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import MapPicker from "../MapPicker";
import Spinner from "./Spinner";
import { createPickupStation, updatePickupStation, getPickupStationById } from "../../services/adminDashboard/apiPickupStation";

type Props = {
  open: boolean;
  onClose: () => void;
  stationId?: string | undefined;
  onSaved?: () => void;
};

export default function PickupStationForm({ open, onClose, stationId, onSaved }: Props) {
  const { register, handleSubmit, reset, setValue, getValues, formState: { isSubmitting } } = useForm<any>();

  useEffect(() => {
    if (!open) return;
    if (stationId) {
      async function loadStation() {
        try {
          const res = await getPickupStationById(stationId);
          if (res && res.success && res.data) {
            const data = res.data;
            reset({
              name: data.name,
              address: data.address,
              contactPerson: data.contactPerson,
              phone: data.phone,
              email: data.email,
              latitude: data.latitude,
              longitude: data.longitude,
            });
          }
        } catch (err) {
          console.error("Failed to load station data:", err);
        }
      }
      loadStation();
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

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="text-xs">Latitude</label>
              <input
                readOnly
                {...register('latitude')}
                className="w-full border px-3 py-2 bg-gray-50 cursor-not-allowed text-xs"
              />
            </div>
            <div>
              <label className="text-xs">Longitude</label>
              <input
                readOnly
                {...register('longitude')}
                className="w-full border px-3 py-2 bg-gray-50 cursor-not-allowed text-xs"
              />
            </div>
          </div>

          <div className="mt-4 w-full">
            <label className="text-xs font-medium">Select location on map</label>
            <div className="mt-2 rounded-lg border border-gray-200 overflow-hidden">
              <MapPicker
                initialLat={Number(getValues('latitude')) || undefined}
                initialLng={Number(getValues('longitude')) || undefined}
                onSelect={(res) => {
                  setValue('latitude', res.latitude);
                  setValue('longitude', res.longitude);
                  if (res.formattedAddress) {
                    setValue('address', res.formattedAddress);
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs">Contact Person</label>
              <input {...register('contactPerson')} className="w-full border px-3 py-2" />
            </div>
            <div>
              <label className="text-xs">Phone Number</label>
              <input {...register('phone')} className="w-full border px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="text-xs">Email Address (Optional)</label>
            <input {...register('email')} className="w-full border px-3 py-2" />
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
