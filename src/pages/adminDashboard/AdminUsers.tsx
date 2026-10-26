import React, { useState } from "react";
import { FaUserShield, FaUserPlus, FaUserEdit, FaUserMinus } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdmins, onboardAdmin, updateAdmin, deleteAdmin, updateAdminRole } from "../../services/apiAdmin";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);

  const { data: adminsData, isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => getAdmins(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdmin(id),
    onSuccess: () => {
      toast.success("Admin deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete admin"),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => updateAdminRole(id, role),
    onSuccess: () => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to update role"),
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="big" />
      </div>
    );
  }

  const admins = adminsData?.data || [];

  return (
    <div className="font-primary w-full bg-[#f8f9ff] min-h-screen pb-10 px-6 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system administrators, access levels, and operational roles.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white shadow-md hover:bg-orange-600 transition-all text-xs font-semibold"
        >
          <FaUserPlus size={14} />
          Onboard New Admin
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <FaUserShield className="text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">System Administrator Registry</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-6 font-semibold">Admin Name</th>
                  <th className="py-3 px-6 font-semibold">Email Address</th>
                  <th className="py-3 px-6 font-semibold">Operational Role</th>
                  <th className="py-3 px-6 font-semibold">Status</th>
                  <th className="py-3 px-6 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {admins.length > 0 ? (
                  admins.map((admin: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-4 px-6 font-semibold text-gray-900">{admin.fullName}</td>
                      <td className="py-4 px-6 text-gray-600">{admin.email}</td>
                      <td className="py-4 px-6">
                        <select
                          value={admin.role}
                          onChange={(e) => roleMutation.mutate({ id: admin.id, role: e.target.value })}
                          className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        >
                          <option value="SuperAdmin">SuperAdmin</option>
                          <option value="SystemAdmin">SystemAdmin</option>
                          <option value="Admin">Admin</option>
                          <option value="LogisticsManager">Logistics Manager</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          admin.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {admin.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingAdmin(admin)}
                            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                            title="Edit"
                          >
                            <FaUserEdit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if(window.confirm("Are you sure you want to remove this admin?")) {
                                deleteMutation.mutate(admin.id);
                              }
                            }}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <FaUserMinus size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-400 italic">
                      No administrators found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Simple Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Onboard New Admin</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
                <input type="text" className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Adeyemi O." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address</label>
                <input type="email" className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="admin@karakata.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Role</label>
                <select className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500">
                  <option value="Admin">Admin</option>
                  <option value="SystemAdmin">SystemAdmin</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-all">Cancel</button>
              <button className="flex-1 py-2 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-all shadow-md">Create Admin</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
