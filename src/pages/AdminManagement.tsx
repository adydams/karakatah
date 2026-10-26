import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  MdDashboard,
  MdShoppingBag,
  MdInventory2,
  MdLocalShipping,
  MdSettings,
  MdLogout,
  MdSearch,
  MdFilterList,
  MdDownload,
  MdEdit,
  MdBlock,
  MdDelete,
  MdAdd,
  MdCheckCircle,
  MdGroup,
  MdVerifiedUser,
  MdEditDocument,
  MdWarning,
  MdShield,
  MdClose
} from "react-icons/md";
import { getAdmins, onboardAdmin, updateAdmin, deleteAdmin, updateAdminRole, updateAdminStatus } from "../services/apiAdmin";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router";
import PasswordField from "../components/ui/PasswordField";


interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: {
    id: string;
    role: string;
    description: string;
  };
  isActive: boolean;
  createdAt: string;
  lastLogin?: {
    date: string;
    ip: string;
  };
}

export default function AdminManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admins", filters],
    queryFn: () => getAdmins(filters),
    refetchInterval: 5000,
  });

  const onboardMutation = useMutation({
    mutationFn: onboardAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setIsModalOpen(false);
    },
  });

  const updateAdminMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => updateAdmin(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setIsModalOpen(false);
      setEditingAdmin(null);
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const statusUpdateMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => updateAdminStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const roleUpdateMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => updateAdminRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const admins: Admin[] = data?.admins || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <>
      <main className="flex-1 p-10 min-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#1a1b22]">Admin Management</h2>
            <p className="text-base text-[#574235]">Manage platform administrators and their access permissions.</p>
          </div>
          <button
            onClick={() => {
              setEditingAdmin(null);
              setIsModalOpen(true);
            }}
            className="bg-[#f57c00] text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
          >
            <MdAdd size={20} />
            Add New Admin
          </button>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl border border-[#dec1af] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <MdGroup className="text-[#964900]" size={24} />
              <span className="text-sm font-semibold text-[#574235]">Total Admins</span>
            </div>
            <div className="text-2xl font-bold text-[#1a1b22]">{data?.totalAdmins || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#dec1af] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <MdCheckCircle className="text-[#00639c]" size={24} />
              <span className="text-sm font-semibold text-[#574235]">Active Now</span>
            </div>
            <div className="text-2xl font-bold text-[#1a1b22]">
              {admins.filter((a: Admin) => a.isActive).length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#dec1af] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <MdShield className="text-[#8b7263]" size={24} />
              <span className="text-sm font-semibold text-[#574235]">Super Admins</span>
            </div>
            <div className="text-2xl font-bold text-[#1a1b22]">
              {admins.filter((a: Admin) => a.role.role === "SuperAdmin").length}
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="relative flex-grow w-full">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#574235]" size={20} />
            <input
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#dec1af] bg-white focus:ring-2 focus:ring-[#f57c00] focus:outline-none transition-all"
              placeholder="Search by name, email, or phone..."
              type="text"
              value={filters.name}
              onChange={(e) => setFilters(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-[#dec1af] rounded-lg text-sm font-semibold text-[#574235] hover:bg-[#eeedf7] transition-colors">
              <MdFilterList /> Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-[#dec1af] rounded-lg text-sm font-semibold text-[#574235] hover:bg-[#eeedf7] transition-colors">
              <MdDownload /> Export
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-[#dec1af] shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="big" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#dec1af] bg-[#f4f2fd]">
                    <th className="px-6 py-4 text-sm font-semibold text-[#574235] uppercase tracking-wider">Admin</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#574235] uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#574235] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#574235] uppercase tracking-wider">Permissions</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#574235] uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#574235] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dec1af]">
                  {admins.length > 0 ? (
                    admins.map((admin: Admin) => (
                      <tr key={admin.id} className="hover:bg-[#f4f2fd] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-300 border border-[#dec1af] flex items-center justify-center text-xs font-bold">
                              {admin.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-[#1a1b22]">{admin.name}</div>
                              <div className="text-xs text-[#574235]">{admin.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            admin.role.role === "SuperAdmin" ? "bg-orange-100 text-orange-700" :
                            admin.role.role === "Manager" ? "bg-yellow-100 text-yellow-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {admin.role.role === "SuperAdmin" ? "SUPER ADMIN" :
                             admin.role.role === "Manager" ? "MANAGER" : "SUPPORT"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-[#00639c]">
                            <div className={`w-2 h-2 rounded-full ${admin.isActive ? "bg-[#00639c]" : "bg-[#dec1af]"}`}></div>
                            <span className="text-xs font-medium">{admin.isActive ? "Active" : "Inactive"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {admin.role.role === "SuperAdmin" ? (
                              <>
                                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">All Access</span>
                                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">Financials</span>
                              </>
                            ) : admin.role.role === "Manager" ? (
                              <>
                                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">Products</span>
                                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">Users</span>
                              </>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">Tickets</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-[#1a1b22]">Recently</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingAdmin(admin);
                                setIsModalOpen(true);
                              }}
                              className="p-2 hover:bg-[#e3e1ec] rounded-lg transition-colors text-[#574235]"
                              title="Edit Admin"
                            >
                              <MdEdit size={20} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to ${admin.isActive ? 'deactivate' : 'activate'} ${admin.name}?`)) {
                                  statusUpdateMutation.mutate({ id: admin.id, isActive: !admin.isActive });
                                }
                              }}
                              className="p-2 hover:bg-[#e3e1ec] rounded-lg transition-colors text-[#574235]"
                              title={admin.isActive ? "Deactivate Admin" : "Activate Admin"}
                            >
                              <MdBlock size={20} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${admin.name}? This action cannot be undone.`)) {
                                  deleteAdminMutation.mutate(admin.id);
                                }
                              }}
                              className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors text-red-500"
                              title="Delete Admin"
                            >
                              <MdDelete size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-[#574235]">
                        No admins found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-[#f4f2fd] border-t border-[#dec1af] flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm text-[#574235]">
            Showing {admins.length} of {data?.totalAdmins || 0} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-2 rounded-lg hover:bg-[#e3e1ec] text-[#574235] disabled:opacity-30"
            >
              <FaArrowLeftLong size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg font-semibold ${page === currentPage ? "bg-[#964900] text-white" : "hover:bg-[#e3e1ec] text-[#574235]"}`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-2 rounded-lg hover:bg-[#e3e1ec] text-[#574235] disabled:opacity-30"
            >
              <FaArrowLeftLong size={16} className="rotate-180" />
            </button>
          </div>
        </div>

        {/* Security Logs */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-[#dec1af] shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-[#1a1b22]">Recent Security Logs</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#f4f2fd] transition-colors">
                <MdVerifiedUser className="text-[#00639c] p-2 bg-[#cee5ff] rounded-lg" size={32} />
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-[#1a1b22]">Successful Login</span>
                    <span className="text-xs text-[#574235]">2 mins ago</span>
                  </div>
                  <p className="text-sm text-[#574235]">Admin logged in from Chrome (macOS).</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#f4f2fd] transition-colors">
                <MdEditDocument className="text-[#964900] p-2 bg-[#ffdcc6] rounded-lg" size={32} />
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-[#1a1b22]">Role Modification</span>
                    <span className="text-xs text-[#574235]">1 hour ago</span>
                  </div>
                  <p className="text-sm text-[#574235]">Super Admin changed role from Support to Manager.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#f4f2fd] transition-colors">
                <MdWarning className="text-red-500 p-2 bg-red-100 rounded-lg" size={32} />
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-[#1a1b22]">Failed Login Attempt</span>
                    <span className="text-xs text-[#574235]">5 hours ago</span>
                  </div>
                  <p className="text-sm text-[#574235]">3 failed attempts detected. Account locked.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 bg-[#964900] text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">Admin Safety Tips</h3>
              <ul className="space-y-4 text-sm opacity-90">
                <li className="flex items-start gap-2">
                  <MdCheckCircle size={18} /> Always enable 2FA for all Super Admin accounts.
                </li>
                <li className="flex items-start gap-2">
                  <MdCheckCircle size={18} /> Audit permission summaries every 30 days.
                </li>
                <li className="flex items-start gap-2">
                  <MdCheckCircle size={18} /> Deactivate inactive accounts after 90 days.
                </li>
              </ul>
              <button className="mt-6 px-4 py-2 bg-white text-[#964900] rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all">
                View Security Policy
              </button>
            </div>
            <MdShield className="absolute -bottom-8 -right-8 text-[160px] opacity-10 pointer-events-none" />
          </div>
        </section>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Add New Admin</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <MdClose size={24} />
              </button>
            </div>
            <form
              className="p-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onboardMutation.mutate({
                  name: formData.get("name") as string,
                  email: formData.get("email") as string,
                  phone: formData.get("phone") as string,
                  password: formData.get("password") as string,
                });
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f57c00] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input name="email" type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f57c00] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input name="phone" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f57c00] outline-none" />
              </div>
              <div className="flex flex-col items-start">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <PasswordField
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f57c00] outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={onboardMutation.isPending}
                  className="px-4 py-2 text-sm font-semibold bg-[#f57c00] text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  {onboardMutation.isPending ? "Adding..." : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}