import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";
import { FaEdit, FaTrashAlt, FaDownload } from "react-icons/fa";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { getBrands } from "../../services/adminDashboard/apiProducts";
import toast from "react-hot-toast";
import { keepPreviousData } from "@tanstack/react-query";

const tableHeaders = [
  "Brand Name",
  "Brand ID",
  "Action",
];

export default function Brands() {
  const queryClient = useQueryClient();

  // API State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Local state for inputs
  const [tempSearch, setTempSearch] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const offset = (page - 1) * limit;

  const { data, isLoading: isFetching, isFetching: fetching } = useQuery({
    queryKey: ["brands", page, search],
    queryFn: () => getBrands({ limit, offset, search }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setIsApplying(false);
  }, [data]);

  const brandList = data?.data ?? [];
  const totalBrands = data?.total || brandList.length;
  const totalPages = Math.ceil(totalBrands / limit);

  const applyFilters = () => {
    setIsApplying(true);
    setSearch(tempSearch);
    setPage(1);
  };

  const handleExport = () => {
    toast.success("Exporting brands list...");
  };

  return (
    <div className="font-primary w-full relative">
      {/* Loading Overlay */}
      {(fetching || isApplying) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity duration-200">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-6 rounded-full shadow-2xl border border-gray-100 animate-bounce">
              <Spinner />
            </div>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest animate-pulse">
              Fetching Brands...
            </p>
          </div>
        </div>
      )}

      <div className="my-10 flex w-full flex-col rounded-xl bg-white px-3 py-3 shadow-sm/5">
        {/* Header */}
        <div className="flex w-full flex-col gap-4 py-2 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <h2 className="font-medium text-lg">All Brands List</h2>

            {/* Pagination Info & Controls */}
            {totalBrands > 0 && (
              <div className="flex items-center gap-4 scale-90 origin-left">
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  <span>Total: <span className="font-bold text-gray-800">{totalBrands}</span></span>
                  <span className="text-gray-300">|</span>
                  <span>Page <span className="font-bold text-gray-800">{page}</span> of {totalPages}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-600 transition-colors"
                    title="Previous Page"
                  >
                    <IoMdArrowBack size={18} />
                  </button>
                  <DashboardPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-600 transition-colors"
                    title="Next Page"
                  >
                    <IoMdArrowForward size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {}} // Implement AddBrandModal if available
              className="bg-orange-500 cursor-pointer rounded-md px-4 py-2 font-semibold text-white hover:bg-orange-600 transition-colors"
            >
              Add Brand
            </button>

            {/* Search Bar */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                placeholder="Search brands..."
                className="border-gray-200 bg-gray-50 focus:bg-white focus:outline-none w-[150px] rounded-md border px-4 py-2 transition-all duration-300 focus:w-[220px] focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <button
              onClick={applyFilters}
              className="bg-orange-500 text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Table wrapper for responsiveness */}
        <div className="overflow-x-auto mt-3">
          <div className="min-w-[1000px]">
            {/* Table header */}
            <div className="bg-light-gray/40 border-dark-gray/10 grid w-full grid-cols-[2fr_1fr_120px] rounded-md border px-2 py-3 text-sm font-medium">
              {tableHeaders.map((item) => (
                <h3 key={item} className={item === "Action" ? "text-right" : ""}>{item}</h3>
              ))}
            </div>

            {/* Content */}
            {isFetching && !data ? (
              <div className="flex h-[300px] items-center justify-center">
                <Spinner type="big" />
              </div>
            ) : !brandList || brandList.length === 0 ? (
              <div className="flex h-[500px] flex-col items-center justify-center">
                <p>No brands available</p>
              </div>
            ) : (
              <>
                {brandList.map((brand: any) => (
                  <div key={brand.id} className="grid w-full grid-cols-[2fr_1fr_120px] items-center border-b border-gray-100 px-2 py-3 text-sm hover:bg-gray-50 transition-colors">
                    <div className="text-gray-800 font-medium truncate">{brand.name}</div>
                    <div className="text-gray-600 truncate">{brand.id}</div>
                    <div className="flex justify-end gap-3">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit">
                        <FaEdit size={14} />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors" title="Delete">
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
