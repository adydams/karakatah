import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";
import { getSubCategories, getCategories } from "../../services/adminDashboard/apiProducts";
import { useModal } from "../../contexts/hooks/useModal";
import AddSubcategoryModal from "../../components/adminDashboard/AddSubcategoryModal";
import { FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Subcategories() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { openModal } = useModal();

  const { data: subData, isLoading, isError, error } = useQuery({
    queryKey: ["subcategories"],
    queryFn: getSubCategories,
  });

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isError) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p>{error instanceof Error ? error.message : "Failed to fetch subcategories"}</p>
      </div>
    );
  }

  const subCategoryList = subData?.data ?? [];
  const categories = catData?.data ?? [];

  const getParentCategoryName = (catId: string) => {
    const cat = categories.find((c: any) => c.id === catId);
    return cat ? cat.name : "Unknown";
  };

  const filteredSubCategories = selectedCategory
    ? subCategoryList.filter((sub: any) => sub.categoryId === selectedCategory)
    : subCategoryList;

  const sortedSubCategories = [...filteredSubCategories].sort((a, b) => {
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  const totalPages = Math.ceil(sortedSubCategories.length / 10);
  const start = (currentPage - 1) * 10;
  const paginatedSubCategories = sortedSubCategories.slice(start, start + 10);

  const handleExport = () => {
    toast.success("Exporting sub-categories list...");
  };

  return (
    <div className="font-primary w-full bg-[#f4f2fd] min-h-screen pb-10">

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-10">
        <div className="bg-white rounded-xl shadow-sm border border-[#dec1af] overflow-hidden">
          {/* Card Header */}
          <div className="p-6 border-b border-[#dec1af] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-[#574235]">Manage Sub-Categories</h2>
                <p className="text-sm text-gray-500 mt-1">Organize and structure your product catalog.</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-[#574235]">Filter by Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs rounded-lg border border-[#dec1af] px-2 py-1 outline-none focus:border-[#f57c00] bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                <FaDownload size={14} />
                Export
              </button>
              <button
                onClick={() => openModal(<AddSubcategoryModal />)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#f57c00] rounded-lg hover:bg-[#e67300] transition-all shadow-sm"
              >
                + Add Sub-Category
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f4f2fd] text-[#574235] text-xs uppercase font-bold border-b border-[#dec1af]">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Parent Category</th>
                  <th className="px-6 py-4">Products Count</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dec1af]/30">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <Spinner type="big" />
                    </td>
                  </tr>
                ) : paginatedSubCategories.length > 0 ? (
                  paginatedSubCategories.map((sub: any) => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors text-sm text-[#574235]">
                      <td className="px-6 py-4 font-medium">{sub.name}</td>
                      <td className="px-6 py-4">{getParentCategoryName(sub.categoryId)}</td>
                      <td className="px-6 py-4">{sub.productsCount || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          sub.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {sub.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Edit</button>
                          <button className="text-red-600 hover:text-red-800 font-medium transition-colors">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-gray-500">
                      No Sub-Categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-[#dec1af] bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              Showing {start + 1} to {Math.min(start + 10, sortedSubCategories.length)} of {sortedSubCategories.length} entries
            </p>
            {totalPages > 1 && (
              <DashboardPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

