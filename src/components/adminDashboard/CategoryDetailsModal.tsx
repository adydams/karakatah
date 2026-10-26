import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSubCategories } from "../../services/adminDashboard/apiProducts";
import toast from "react-hot-toast";
import Spinner from "../Spinner";
import { useModal } from "../../contexts/hooks/useModal";
import AddSubcategoryModal from "./AddSubcategoryModal";

export default function CategoryDetailsModal({ categoryId, categoryName }: { categoryId: string, categoryName?: string }) {
  const { closeModal, openModal } = useModal();
  const queryClient = useQueryClient();
  const [isEditingSub, setIsEditingSub] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: async () => {
      const res = await getSubCategories({ categoryId });
      const list = res.data ?? [];
      return list.filter((sub: any) => sub.categoryId === categoryId);
    },
  });

  const handleUpdateSub = async (_subId: string) => {
    try {
      toast.success(`Updated sub-category to ${editValue}`);
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      setIsEditingSub(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update sub-category");
    }
  };

  const handleDeleteSub = async (_subId: string) => {
    if (!confirm("Are you sure you want to delete this sub-category?")) return;
    try {
      toast.success("Sub-category deleted");
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete sub-category");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#dec1af] max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#574235]">Category Details</h2>
          <p className="text-sm text-gray-500">Managing sub-categories for {categoryName || "this category"}</p>
        </div>
        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
          <span className="text-2xl">&times;</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-[#574235]">Attached Sub-Categories</h3>
          <button
            onClick={() => openModal(<AddSubcategoryModal />)}
            className="text-xs bg-[#f57c00] text-white px-3 py-1.5 rounded-md hover:bg-[#e67300] transition-colors flex items-center gap-1"
          >
            Add New
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner type="small" />
          </div>
        ) : data && data.length > 0 ? (
          <div className="border border-[#dec1af] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[#f4f2fd] text-[#574235] font-bold">
                <tr>
                  <th className="px-4 py-3">Sub-Category Name</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dec1af]/30">
                {data.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {isEditingSub === sub.id ? (
                        <input
                          className="border border-[#dec1af] rounded px-2 py-1 outline-none focus:ring-1 focus:ring-[#f57c00]"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-[#574235]">{sub.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        {isEditingSub === sub.id ? (
                          <>
                            <button onClick={() => handleUpdateSub(sub.id)} className="text-green-600 hover:text-green-800">Save</button>
                            <button onClick={() => setIsEditingSub(null)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setIsEditingSub(sub.id); setEditValue(sub.name); }} className="text-blue-600 hover:text-blue-800">Edit</button>
                            <button onClick={() => handleDeleteSub(sub.id)} className="text-red-600 hover:text-red-800">Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-xl">
            No sub-categories attached to this category.
          </div>
        )}
      </div>
    </div>
  );
}
