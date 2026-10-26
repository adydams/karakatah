import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingAddressSchema, type ShippingAddressFormValues } from "../types/formSchema";
import MapPicker from "../components/MapPicker";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { createShippingAddress, updateShippingAddress } from "../services/apiShipping";
import { useQueryClient } from "@tanstack/react-query";

type AddAddressModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingAddress?: any;
};

export default function AddAddressModal({ isOpen, onClose, onSuccess, editingAddress }: AddAddressModalProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddressFormValues>({
    resolver: zodResolver(shippingAddressSchema),
  });

  React.useEffect(() => {
    if (isOpen && editingAddress) {
      reset({
        line1: editingAddress.line1 ?? editingAddress.addressLine1 ?? '',
        line2: editingAddress.line2 ?? editingAddress.addressLine2 ?? '',
        city: editingAddress.city ?? '',
        state: editingAddress.state ?? '',
        country: editingAddress.country ?? '',
        postalCode: editingAddress.postalCode ?? editingAddress.postal_code ?? '',
        latitude: editingAddress.latitude != null ? (editingAddress.latitude as any) : undefined,
        longitude: editingAddress.longitude != null ? (editingAddress.longitude as any) : undefined,
      });
    } else if (isOpen) {
      reset({});
    }
  }, [isOpen, editingAddress, reset]);

  async function onSubmit(data: ShippingAddressFormValues) {
    try {
      if (editingAddress) {
        const res = await updateShippingAddress(editingAddress.id, data);
        if (res) {
          toast.success('Address updated');
          await queryClient.invalidateQueries({ queryKey: ['shippingAddress'] });
          onSuccess();
          onClose();
        }
      } else {
        const success = await createShippingAddress(data);
        if (success) {
          toast.success("Address Added Successfully");
          await queryClient.invalidateQueries({ queryKey: ["shippingAddress"] });
          onSuccess();
          onClose();
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast("An unexpected error occurred");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full z-[25]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-base font-medium text-gray-700">
              {editingAddress ? "EDIT ADDRESS" : "ADD AN ADDRESS"}
            </h1>
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800">Close</button>
          </div>

          <div className="font-primary mt-3 flex w-full flex-col items-start justify-center gap-1.5 text-sm">
            <label className="text-xs font-medium tracking-wider" htmlFor="line1">Street</label>
            <input
              className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 focus:outline-0"
              type="text"
              id="line1"
              {...register("line1")}
              data-autofocus
            />
            {errors.line1 && <p className="text-xs text-red-500">{`${errors.line1.message}`}</p>}
          </div>

          <div className="font-primary mt-3 flex w-full flex-col items-start justify-center gap-1.5 text-sm">
            <label className="text-xs font-medium tracking-wider" htmlFor="line2">Bus-Stop</label>
            <input
              className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 focus:outline-0"
              type="text"
              id="line2"
              {...register("line2")}
            />
            {errors.line2 && <p className="text-xs text-red-500">{`${errors.line2.message}`}</p>}
          </div>

          <div className="grid w-full grid-cols-2 gap-3">
            <div className="font-primary mt-3 flex w-full flex-col items-start justify-center gap-1.5 text-sm">
              <label className="text-xs font-medium tracking-wider" htmlFor="city">City</label>
              <input
                className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 focus:outline-0"
                type="text"
                id="city"
                {...register("city")}
              />
              {errors.city && <p className="text-xs text-red-500">{`${errors.city.message}`}</p>}
            </div>
            <div className="font-primary mt-3 flex w-full flex-col items-start justify-center gap-1.5 text-sm">
              <label className="text-xs font-medium tracking-wider" htmlFor="state">State</label>
              <input
                className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 focus:outline-0"
                type="text"
                id="state"
                {...register("state")}
              />
              {errors.state && <p className="text-xs text-red-500">{`${errors.state.message}`}</p>}
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-3">
            <div className="font-primary mt-3 flex w-full flex-col items-start justify-center gap-1.5 text-sm">
              <label className="text-xs font-medium tracking-wider" htmlFor="country">Country</label>
              <input
                className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 focus:outline-0"
                type="text"
                id="country"
                {...register("country")}
              />
              {errors.country && <p className="text-xs text-red-500">{`${errors.country.message}`}</p>}
            </div>
            <div className="font-primary mt-3 flex w-full flex-col items-start justify-center gap-1.5 text-sm">
              <label className="text-xs font-medium tracking-wider" htmlFor="postalCode">Postal Code</label>
              <input
                className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 focus:outline-0"
                type="text"
                id="postalCode"
                {...register("postalCode")}
              />
              {errors.postalCode && <p className="text-xs text-red-500">{`${errors.postalCode.message}`}</p>}
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-xs font-medium tracking-wider" htmlFor="latitude">Latitude</label>
              <input readOnly className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 bg-gray-50 focus:outline-0 cursor-not-allowed" id="latitude" type="number" step="any" {...register('latitude')} />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wider" htmlFor="longitude">Longitude</label>
              <input readOnly className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 bg-outline-0 cursor-not-allowed" id="longitude" type="number" step="any" {...register('longitude')} />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div className="w-full">
              <label className="text-xs font-medium tracking-wider">Select location on map</label>
              <div className="mt-2 rounded-lg border border-gray-200 overflow-hidden">
                <MapPicker
                  initialLat={Number(getValues('latitude')) || undefined}
                  initialLng={Number(getValues('longitude')) || undefined}
                  onSelect={(res) => {
                    setValue('latitude', res.latitude);
                    setValue('longitude', res.longitude);
                    if (res.formattedAddress) {
                      setValue('line1', res.formattedAddress);
                    }
                    toast.success('Location selected from map');
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex w-full items-center justify-end gap-3 border-t border-dotted border-gray-400 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer border border-gray-400/80 px-6 py-3 text-sm transition-all duration-500 hover:bg-gray-400/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange hover:bg-orange/80 cursor-pointer rounded-lg px-6 py-3 font-semibold tracking-wider text-white"
            >
              {isSubmitting ? <Spinner size="small" /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}