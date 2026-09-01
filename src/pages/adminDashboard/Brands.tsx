import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";
import { IoMdArrowDropdown } from "react-icons/io";

// Mock API call - in a real app, this would be imported from services
const getBrands = async () => {
  // This is a placeholder. You should implement the actual api call to /api/brands
  return {
    data: [
      { id: "1", name: "Brand A" },
      { id: "2", name: "Brand B" },
      { id: "3", name: "Brand C" },
    ],
    totalRecords: 3,
  };
};

export default function Brands() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  if (isError) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p>{error instanceof Error ? error.message : "Failed to fetch brands"}</p>
      </div>
    );
  }

  const brandList = data?.data ?? [];
  const totalPages = Math.ceil(brandList.length / 10);
  const start = (currentPage - 1) * 10;
  const paginatedBrands = brandList.slice(start, start + 10);

  return (
    <div className="font-primary w-full">

      <div className="flex w-full flex-col rounded-xl bg-white px-3 py-3 shadow-sm/5 mt-10">
        <div className="flex w-full items-center justify-between py-2 text-sm">
          <h2 className="font-medium">All Brands List</h2>
          <div className="flex items-center gap-4 text-xs">
            <button className="bg-muted-green rounded-md px-4 py-2 font-semibold text-white">
              Add Brand
            </button>
            <div className="border-dark-gray/40 flex items-center gap-2 rounded-md border px-3 py-2">
              All Brands
              <IoMdArrowDropdown size={18} />
            </div>
          </div>
        </div>

        <div className="bg-light-gray/40 border-dark-gray/10 mt-3 grid w-full grid-cols-[2fr_1fr_1fr] rounded-md border px-2 py-3 text-sm font-medium">
          <h3>Brand Name</h3>
          <h3>ID</h3>
          <h3>Actions</h3>
        </div>

        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Spinner type="big" />
          </div>
        ) : paginatedBrands.length > 0 ? (
          <>
            {paginatedBrands.map((brand: any) => (
              <div key={brand.id} className="grid w-full grid-cols-[2fr_1fr_1fr] border-b border-gray-100 px-2 py-3 text-sm">
                <span>{brand.name}</span>
                <span>{brand.id}</span>
                <div className="flex gap-2">
                  <button className="text-blue-600 font-medium">Edit</button>
                  <button className="text-red-600 font-medium">Delete</button>
                </div>
              </div>
            ))}
            {totalPages > 1 && (
              <DashboardPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="flex h-[600px] flex-col items-center justify-center">
            <p>No Brands found</p>
          </div>
        )}
      </div>
    </div>
  );
}

