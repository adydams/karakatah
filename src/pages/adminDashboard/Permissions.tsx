import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";
import { getPermissions, createPermission, deletePermission, assignPermissionsToRole } from "../../services/adminDashboard/apiPermissions";
import toast from "react-hot-toast";
import { IoMdArrowDropdown } from "react-icons/io";

export default function Permissions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const queryClient = useQueryClient();

  const [newPermission, setNewPermission] = useState({ name: "", description: "" });
  const [assignment, setAssignment] = useState({ roleId: "", permissionIds: [] as string[] });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["permissions", currentPage, search],
    queryFn: () => getPermissions({ name: search, page: currentPage, limit: 10 }),
  });

  if (isError) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p>{error instanceof Error ? error.message : "Failed to fetch permissions"}</p>
      </div>
    );
  }

  const permissionList = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleCreate = async () => {
    try {
      await createPermission(newPermission);
      toast.success("Permission created successfully");
      setNewPermission({ name: "", description: "" });
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to create permission");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this permission?")) return;
    try {
      await deletePermission(id);
      toast.success("Permission deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete permission");
    }
  };

  const handleAssign = async () => {
    try {
      await assignPermissionsToRole(assignment);
      toast.success("Permissions assigned to role successfully");
      setIsAssigning(false);
      setAssignment({ roleId: "", permissionIds: [] });
      setSelectedPermissions([]);
    } catch (err: any) {
      toast.error(err.message || "Failed to assign permissions");
    }
  };

  const togglePermissionSelection = (id: string) => {
    setSelectedPermissions(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="font-primary w-full">

      <div className="flex w-full flex-col rounded-xl bg-white px-3 py-3 shadow-sm border border-[#dec1af] mt-10">
        <div className="flex w-full items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <h2 className="font-medium text-[#574235]">All Permissions List</h2>
            <input
              type="text"
              placeholder="Search permissions..."
              className="rounded-md border border-[#dec1af] px-3 py-1 outline-none focus:border-[#f57c00]"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsAssigning(true)}
              className="bg-[#574235] rounded-md px-4 py-2 font-semibold text-white hover:bg-[#46342a] transition-colors"
            >
              Assign to Role
            </button>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-[#f57c00] rounded-md px-4 py-2 font-semibold text-white hover:bg-[#e67300] transition-colors"
            >
              Add Permission
            </button>
            <div className="border-[#dec1af] flex items-center gap-2 rounded-md border px-3 py-2 text-[#574235]">
              All Permissions
              <IoMdArrowDropdown size={18} />
            </div>
          </div>
        </div>

        {/* Add Permission Modal */}
        {isAdding && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md border border-[#dec1af]">
              <h3 className="text-lg font-bold mb-4 text-[#574235]">Create New Permission</h3>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Permission Name (e.g. users:view)"
                  className="border border-[#dec1af] p-2 rounded-md outline-none focus:border-[#f57c00]"
                  value={newPermission.name}
                  onChange={e => setNewPermission({...newPermission, name: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="border border-[#dec1af] p-2 rounded-md outline-none focus:border-[#f57c00]"
                  value={newPermission.description}
                  onChange={e => setNewPermission({...newPermission, description: e.target.value})}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                  <button onClick={handleCreate} className="bg-[#f57c00] text-white px-4 py-2 rounded-md hover:bg-[#e67300] transition-colors">Create</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assign Permission Modal */}
        {isAssigning && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-[#dec1af]">
              <h3 className="text-lg font-bold mb-4 text-[#574235]">Assign Permissions to Role</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#574235]">Role ID</label>
                  <input
                    type="text"
                    placeholder="Enter Role ID (e.g. 1)"
                    className="border border-[#dec1af] p-2 rounded-md outline-none focus:border-[#f57c00]"
                    value={assignment.roleId}
                    onChange={e => setAssignment({...assignment, roleId: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#574235]">Select Permissions</label>
                  <div className="border border-[#dec1af] rounded-md p-3 max-h-60 overflow-y-auto grid grid-cols-2 gap-2">
                    {permissionList.map((p: any) => (
                      <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer text-[#574235]">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(p.id)}
                          onChange={() => togglePermissionSelection(p.id)}
                          className="accent-[#f57c00]"
                        />
                        {p.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsAssigning(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                  <button
                    onClick={() => {
                      setAssignment({...assignment, permissionIds: selectedPermissions});
                      handleAssign();
                    }}
                    className="bg-[#574235] text-white px-4 py-2 rounded-md hover:bg-[#46342a] transition-colors"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#f4f2fd] border-[#dec1af] mt-3 grid w-full grid-cols-[2fr_2fr_1fr] rounded-md border px-2 py-3 text-sm font-medium text-[#574235]">
          <h3>Permission Name</h3>
          <h3>Description</h3>
          <h3>Actions</h3>
        </div>

        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Spinner type="big" />
          </div>
        ) : permissionList.length > 0 ? (
          <>
            {permissionList.map((p: any) => (
              <div key={p.id} className="grid w-full grid-cols-[2fr_2fr_1fr] border-b border-[#dec1af]/30 px-2 py-3 text-sm text-[#574235]">
                <span className="font-medium">{p.name}</span>
                <span className="text-[#574235]/70">{p.description}</span>
                <div className="flex gap-2">
                  <button className="text-blue-600 font-medium hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 font-medium hover:underline">Delete</button>
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
            <p className="text-[#574235]">No Permissions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
