import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getShippingAddress, deleteShippingAddress } from "../services/apiShipping";
import Spinner from "../components/Spinner";
import { normalizeListData } from "../utils/utils";
import { CiBookmarkPlus, CiEdit, CiTrash, CiLocationOn } from "react-icons/ci";
import { FiArrowLeft } from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router";
import AddAddressModal from "../components/AddAddressModal";
import toast from "react-hot-toast";

export default function CheckoutAddress() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: shippingAddress, isLoading: isFetchingAddress } = useQuery({
    queryKey: ["shippingAddress"],
    queryFn: getShippingAddress,
  });

  const addresses = normalizeListData<any>(shippingAddress);

  const openAddAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const openEditAddress = (address: any) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingAddress(null);
    setIsModalOpen(false);
  };

  async function handleDelete(addressId: string) {
    const ok = window.confirm("Are you sure you want to delete this address?");
    if (!ok) return;
    setDeletingId(addressId);
    try {
      const res = await deleteShippingAddress(addressId);
      if (res) {
        toast.success("Address deleted");
        await queryClient.invalidateQueries({ queryKey: ["shippingAddress"] });
      }
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-start justify-center bg-[#fbf8ff] px-4 py-10">
      <div className="w-full max-w-4xl">
        {/* Step Indicator - matches /checkout */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-orange-600">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-white">1</span>
            Shipping Address
          </div>
          <div className="h-px w-8 bg-gray-300" />
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-white">2</span>
            Shipping & Payment
          </div>
          <div className="h-px w-8 bg-gray-300" />
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-white">3</span>
            Confirmation
          </div>
        </div>

        {/* Address Book Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-primary text-lg font-semibold text-gray-800">Delivery Addresses</h1>
              <p className="text-sm text-gray-500">Manage your saved shipping addresses.</p>
            </div>
            <button
              type="button"
              onClick={openAddAddress}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange/90"
            >
              <CiBookmarkPlus size={18} />
              Add Address
            </button>
          </div>

          <div className="mt-5">
            {isFetchingAddress ? (
              <div className="flex h-48 w-full items-center justify-center">
                <Spinner size="big" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 px-6 py-12 text-center">
                <CiLocationOn className="mx-auto mb-3 text-gray-300" size={40} />
                <p className="text-sm font-medium text-gray-500">No addresses yet</p>
                <p className="mt-1 text-xs text-gray-400">Add a delivery address to continue with checkout.</p>
                <button
                  type="button"
                  onClick={openAddAddress}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange/90"
                >
                  <CiBookmarkPlus size={16} />
                  Add your first address
                </button>
              </div>
            ) : (
              <div className="grid max-h-[480px] gap-3 overflow-y-auto pr-2 custom-scrollbar sm:grid-cols-2">
                {addresses.map((address: any) => {
                  const line1 = address.line1 ?? address.addressLine1 ?? "";
                  const line2 = address.line2 ?? address.addressLine2 ?? "";
                  const hasCoords =
                    address.latitude != null &&
                    address.longitude != null &&
                    address.latitude !== "" &&
                    address.longitude !== "";
                  return (
                    <div
                      key={address.id}
                      className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-orange/40 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-gray-800">
                            {line1 || "Home Address"}
                          </span>
                          <p className="mt-1 text-xs text-gray-600">
                            {[line2, address.city, address.state].filter(Boolean).join(", ")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {[address.country, address.postalCode ?? address.postal_code].filter(Boolean).join(" · ")}
                          </p>
                          {address.email && (
                            <p className="mt-1 truncate text-xs text-gray-400">{address.email}</p>
                          )}
                          <span
                            className={
                              "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium " +
                              (hasCoords ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700")
                            }
                          >
                            <CiLocationOn size={12} />
                            {hasCoords ? "Location pinned" : "Location not pinned"}
                          </span>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditAddress(address)}
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-orange-200 hover:text-orange-500"
                            aria-label="Edit address"
                          >
                            <CiEdit size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(address.id)}
                            disabled={deletingId === address.id}
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-red-200 hover:text-red-500 disabled:opacity-50"
                            aria-label="Delete address"
                          >
                            {deletingId === address.id ? <Spinner size="small" /> : <CiTrash size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Back to checkout */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/checkout"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-orange/40 hover:text-orange"
          >
            <FiArrowLeft size={16} />
            Back to checkout
          </Link>
        </div>
      </div>

      <AddAddressModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={() => {}}
        editingAddress={editingAddress}
      />
    </main>
  );
}
