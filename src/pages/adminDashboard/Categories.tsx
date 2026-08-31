import React, { useState } from "react";
import Spinner from "../../components/Spinner";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";
import { FaEye, FaEdit, FaTrashAlt, FaDownload } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { getCategories, deleteCategory } from "../../services/adminDashboard/apiCategories";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const tableHeaders = [
  "Categories",
  "Starting Price",
  "ID",
  "Product Stock",
  "Action",
];

export default function Categories() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: categoryData, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = categoryData?.data ?? [];
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  async function handleDelete(id: string) {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory({ id });
        toast.success("Category deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } catch (err: any) {
        toast.error(err.message || "Failed to delete category");
      }
    }
  }

  return (
    <div className="font-primary w-full">

      <div className="my-5 flex w-full flex-col items-start justify-start rounded-xl bg-white py-2 shadow-sm/5 transition-all duration-1000">
        <div className="flex w-full items-center justify-between px-5 py-2 text-sm">
          <h2 className="font-medium">All Categories</h2>

          <div className="border-dark-gray/40 flex cursor-pointer items-center justify-end gap-2 rounded-md border px-3 py-2 text-xs">
            This Month <IoMdArrowDropdown size={18} />
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner type="big" />
          </div>
        ) : (
          <>
            <div className="bg-light-gray/40 border-dark-gray/10 mt-3 grid w-full grid-cols-5 gap-1 rounded-md border-t border-b px-2 py-3 text-sm font-medium">
              {tableHeaders.map((item) => (
                <h3 className="text-xs" key={item}>
                  {item}
                </h3>
              ))}
            </div>

            {paginatedCategories.map((category: any) => (
              <div key={category.id} className="grid w-full grid-cols-5 items-center border-b border-gray-100 px-2 py-3 text-sm hover:bg-gray-50 transition-colors">
                <div className="text-gray-800 font-medium truncate">{category.name}</div>
                <div className="text-gray-600">₦{category.lowestPrice || "N/A"}</div>
                <div className="text-gray-800 truncate">{category.id}</div>
                <div className="text-gray-600">{category.productStock || 0} items</div>
                <div className="flex justify-end gap-3">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors" title="View">
                    <FaEye size={14} />
                  </button>
                  <button className="text-orange-600 hover:text-orange-800 transition-colors" title="Edit">
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete"
                  >
                    <FaTrashAlt size={14} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {categories.length > itemsPerPage && (
          <div className="flex justify-center py-4">
            <DashboardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
