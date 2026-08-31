import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";
import { getCustomers, getCustomerById, updateCustomer, deleteCustomer } from "../../services/adminDashboard/apiCustomers";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";

export default function Customers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["customers", currentPage, search],
    queryFn: () => getCustomers({ name: search, page: currentPage, limit: 10 }),
  });

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setEditForm({ name: user.name, email: user.email, phone: user.phone });
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      await updateCustomer(selectedUser.id, editForm);
      toast.success("Customer updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to update customer");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteCustomer(id);
      toast.success("Customer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete customer");
    }
  };

  if (isError) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p>{error instanceof Error ? error.message : "Failed to fetch customers"}</p>
      </div>
    );
  }

  const customerList = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="font-primary w-full">

      <div className="flex w-full flex-col rounded-xl bg-white px-3 py-3 shadow-sm border border-[#dec1af] mt-10">
        <div className="flex w-full items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <h2 className="font-medium text-[#574235]">All Customers List</h2>
            <input
              type="text"
              placeholder="Search customers..."
              className="rounded-md border border-[#dec1af] px-3 py-1 outline-none focus:border-[#f57c00]"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              className="bg-[#f57c00] rounded-md px-4 py-2 font-semibold text-white hover:bg-[#e67300] transition-colors"
            >
              Add Customer
            </button>
          </div>
        </div>

        {/* Edit Customer Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md border border-[#dec1af]">
              <h3 className="text-lg font-bold mb-4 text-[#574235]">Edit Customer Details</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#574235]">Full Name</label>
                  <input
                    type="text"
                    className="border border-[#dec1af] p-2 rounded-md outline-none focus:border-[#f57c00]"
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#574235]">Email</label>
                  <input
                    type="email"
                    className="border border-[#dec1af] p-2 rounded-md outline-none focus:border-[#f57c00]"
                    value={editForm.email}
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#574235]">Phone Number</label>
                  <input
                    type="text"
                    className="border border-[#dec1af] p-2 rounded-md outline-none focus:border-[#f57c00]"
                    value={editForm.phone}
                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                  <button onClick={handleUpdate} className="bg-[#f57c00] text-white px-4 py-2 rounded-md hover:bg-[#e67300] transition-colors">Update</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#f4f2fd] border-[#dec1af] mt-3 grid w-full grid-cols-[1fr_1fr_1fr_1fr] rounded-md border px-2 py-3 text-sm font-medium text-[#574235]">
          <h3>Name</h3>
          <h3>Email</h3>
          <h3>Phone</h3>
          <h3 className="text-right">Actions</h3>
        </div>

        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Spinner type="big" />
          </div>
        ) : customerList.length > 0 ? (
          <>
            {customerList.map((c: any) => (
              <div key={c.id} className="grid w-full grid-cols-[1fr_1fr_1fr_1fr] border-b border-[#dec1af]/30 px-2 py-3 text-sm text-[#574235]">
                <span className="font-medium">{c.name}</span>
                <span className="text-[#574235]/70">{c.email}</span>
                <span className="text-[#574235]/70">{c.phone}</span>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleEditClick(c)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Edit"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
            {totalPages > 1 && (
              <DashboardPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="flex h-[600px] flex-col items-center justify-center">
            <p className="text-[#574235]">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
