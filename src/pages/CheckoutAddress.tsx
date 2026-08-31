import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createShippingAddress,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} from "../services/apiShipping";
import Spinner from "../components/Spinner";
import { normalizeListData } from "../utils/utils";
import { getCart } from "../services/apiCarts";
import { getProducts } from "../services/apiProducts";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

import { CiBookmarkPlus, CiEdit, CiTrash } from "react-icons/ci";
import { FaArrowLeft, FaRegUserCircle, FaShippingFast, FaSignOutAlt, FaHeart, FaClipboardList } from "react-icons/fa";
import { useState } from "react";
import MapPicker from "../components/MapPicker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  shippingAddressSchema,
  type ShippingAddressFormValues,
} from "../types/formSchema";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useUser } from "../contexts/hooks/useUser";

export default function CheckoutAddress() {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { user } = useUser();

  const customerName = user?.name || (() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return "Customer";
      const parsed = JSON.parse(raw);
      const storedName = parsed?.name || parsed?.fullName;
      if (storedName) return storedName;
      const names = [parsed?.firstName, parsed?.lastName].filter(Boolean);
      return names.length ? names.join(" ") : "Customer";
    } catch {
      return "Customer";
    }
  })();

  const openAddAddress = () => {
    setEditingAddress(null);
    setIsAddingAddress(true);
  };

  const { data: shippingAddress, isLoading: IsFetchingAddress } = useQuery({
    queryKey: ["shippingAddress"],
    queryFn: getShippingAddress,
  });

  // Suggested Products Logic
  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!localStorage.getItem("token"),
  });

  const { data: productsData } = useQuery({
    queryKey: ["allProducts"],
    queryFn: getProducts,
    enabled: !!cartData,
  });

  const suggestedProducts = (() => {
    const items = cartData?.data?.items ?? [];
    const allProducts = normalizeListData<any>(productsData);
    if (items.length === 0 || allProducts.length === 0) return [];

    const cartCategories = new Set(items.map((it: any) => it.product?.categoryId).filter(Boolean));
    const cartProductIds = new Set(items.map((it: any) => it.productId));

    return allProducts.filter(
      (p: any) => cartCategories.has(p.categoryId) && !cartProductIds.has(p.id)
    ).slice(0, 10);
  })();

  const addresses = normalizeListData<any>(shippingAddress);

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

  const closeAddAddress = () => {
    reset();
    setEditingAddress(null);
    setIsAddingAddress(false);
  };

  async function onSubmit(data: ShippingAddressFormValues) {
    try {
      if (editingAddress) {
        const res = await updateShippingAddress(editingAddress.id, data);
        if (res) {
          toast.success('Address updated');
          await queryClient.invalidateQueries({ queryKey: ['shippingAddress'] });
          closeAddAddress();
        }
      } else {
        const success = await createShippingAddress(data);

        if (success) {
          toast.success("Address Added Successfully");
          await queryClient.invalidateQueries({ queryKey: ["shippingAddress"] });
          closeAddAddress();
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast("An unexpected error occurred");
      }
    }
  }

  async function handleDelete(addressId: string) {
    const ok = window.confirm('Are you sure you want to delete this address?');
    if (!ok) return;
    try {
      const res = await deleteShippingAddress(addressId);
      if (res) {
        toast.success('Address deleted');
        await queryClient.invalidateQueries({ queryKey: ['shippingAddress'] });
      }
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error('Failed to delete address');
    }
  }

  function openEdit(address: any) {
    setEditingAddress(address);
    reset({
      line1: address.line1 ?? address.addressLine1 ?? '',
      line2: address.line2 ?? address.addressLine2 ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      country: address.country ?? '',
      postalCode: address.postalCode ?? address.postal_code ?? '',
    });
    setIsAddingAddress(true);
  }

  return (
    <main className="flex min-h-screen w-full items-start justify-center bg-[#f5f5f5] px-4 py-10">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-md">
        <aside className="hidden w-[260px] border-r border-gray-200 bg-[#f9f9f9] p-6 md:flex md:flex-col md:items-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#d1d5db] to-[#f4f4f5] ring-4 ring-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold text-gray-800">{customerName}</h2>
            <p className="text-xs text-gray-500">146 Total Likes!</p>
          </div>

          <nav className="mt-8 w-full space-y-3 text-sm text-gray-700">
            <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-white hover:text-orange-500">
              <FaRegUserCircle className="text-base" />
              Orders History
            </button>
            <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-white hover:text-orange-500">
              <FaClipboardList className="text-base" />
              Saved Items
            </button>
            <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-orange-500 bg-white shadow-sm">
              <FaShippingFast className="text-base" />
              Shipping Address
            </button>
            <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-white hover:text-orange-500">
              <FaHeart className="text-base" />
              Account Settings
            </button>
            <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-red-500 hover:bg-white hover:text-red-600">
              <FaSignOutAlt className="text-base" />
              Logout
            </button>
          </nav>
        </aside>

        <div className="flex-1 bg-white p-5 md:p-8">
          <div className="flex items-center justify-between pb-4">
            <button type="button" onClick={() => navigate("/checkout")} className="flex items-center gap-2 text-lg text-gray-700 hover:text-orange-500">
              <FaArrowLeft className="text-base" />
              <span className="font-medium">Shipping Address</span>
            </button>

            <button
              type="button"
              onClick={openAddAddress}
              className="inline-flex items-center gap-2 rounded-md bg-orange px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-orange/90"
            >
              <CiBookmarkPlus size={18} />
              Add Address
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {IsFetchingAddress ? (
              <div className="flex h-48 w-full items-center justify-center">
                <Spinner size="big" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-orange/30 bg-orange/5 px-6 py-8 text-center text-xs font-medium tracking-widest text-gray-500">
                <p>NO ADDRESS AVAILABLE</p>
              </div>
            ) : (
              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-2">
                {addresses.map((address: any) => (
                  <div key={address.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-orange/40 hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address-book"
                          value={address.id}
                          className="mt-1"
                          style={{ accentColor: '#f97316' }}
                        />

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-semibold text-gray-800 truncate max-w-[150px]">
                              {address.name || address.addressLine1 || address.line1 || "Home Address"}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            <p>{[address.line1 ?? address.addressLine1, address.line2 ?? address.addressLine2].filter(Boolean).join(', ')}</p>
                            <p>{[address.city, address.state, address.country].filter(Boolean).join(', ')}</p>
                            <p>{address.postalCode ?? address.postal_code ?? ''}</p>
                            <p className="mt-1 text-xs text-gray-500">{address.email || 'alexandramcherson@email.com'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => openEdit(address)} className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-orange-200 hover:text-orange-500">
                          <CiEdit size={18} />
                        </button>
                        <button type="button" onClick={() => handleDelete(address.id)} className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-red-200 hover:text-red-500">
                          <CiTrash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggested Products Section */}
          {suggestedProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-bold text-gray-800 mb-4">You can also get this</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {suggestedProducts.map((product: any) => (
                  <div key={product.id} className="min-w-[200px] max-w-[200px]">
                    <ProductCard
                      id={product.id}
                      name={product.name || "Unnamed Product"}
                      image={product.images?.[0]?.url}
                      price={product.price}
                      isDiscounted={product.isDiscounted}
                      currentPrice={product.currentPrice || product.price}
                      discounts={product.discounts}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {isAddingAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full z-[25]">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-base font-medium text-gray-700">
                  {editingAddress ? "EDIT ADDRESS" : "ADD AN ADDRESS"}
                </h1>
                <button type="button" onClick={closeAddAddress} className="text-gray-500 hover:text-gray-800">Close</button>
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
                  <input readOnly className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 bg-gray-50 focus:outline-0 cursor-not-allowed" id="longitude" type="number" step="any" {...register('longitude')} />
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
                  onClick={closeAddAddress}
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
      )}
    </main>
  );
}