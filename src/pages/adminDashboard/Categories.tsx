import NavBar from "../../components/adminDashboard/NavBar";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/adminDashboard/apiProducts";

import Spinner from "../../components/adminDashboard/Spinner";
import AddCategory from "../../components/adminDashboard/AddCategory";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";

import { IoMdArrowDropdown } from "react-icons/io";
import TableCategoryItem from "../../components/adminDashboard/TableCategoryItem";

const tableHeaders = ["Categories", "ID", "Product Stock", "Action"];

const CATEGORY_PER_PAGE = 10;

type Category = {
  id: string;
  name: string;
  totalProducts: number;
  categoryImage: string;
};

export default function Categories() {
  const [showAddCat, setShowAddCat] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: categories,
    isLoading: isFetchingCategories,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  function handleShowAddCategory() {
    setShowAddCat((cat) => !cat);
  }

  if (isError) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p>
          {error instanceof Error
            ? error.message
            : "Failed to fetch categories"}
        </p>
      </div>
    );
  }

  const categoryList: Category[] = categories?.data ?? [];

  // Pagination
  const totalPages = Math.ceil(
    categoryList.length / CATEGORY_PER_PAGE,
  );

  const start = (currentPage - 1) * CATEGORY_PER_PAGE;

  const paginatedCategories = categoryList.slice(
    start,
    start + CATEGORY_PER_PAGE,
  );

  return (
    <div className="font-primary w-full">
      <NavBar title="Categories" />

      {/* Top cards */}
      {isFetchingCategories ? (
        <div className="flex h-[300px] items-center justify-center">
          <Spinner type="big" />
        </div>
      ) : (
        <div className="my-2 grid w-full grid-cols-2 gap-5 md:grid-cols-4 lg:mt-10 lg:mb-5">
          {categoryList.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center gap-3 rounded-lg bg-white p-3 shadow-sm/5"
            >
              <div className="h-[160px] w-full overflow-hidden rounded-md">
                <img
                  className="h-full w-full object-cover"
                  src={item.categoryImage}
                  alt={item.name}
                />
              </div>

              <h2 className="text-sm font-semibold">
                {item.name}
              </h2>
            </div>
          ))}
        </div>
      )}

      {/* Add category modal */}
      {showAddCat && (
        <AddCategory handleShowAddCategory={handleShowAddCategory} />
      )}

      {/* Table */}
      <div className="flex w-full flex-col rounded-xl bg-white px-3 py-3 shadow-sm/5">

        <div className="flex w-full items-center justify-between py-2 text-sm">
          <h2 className="font-medium">
            All Categories List
          </h2>

          <div className="flex items-center gap-4 text-xs">
            {!showAddCat && (
              <button
                onClick={handleShowAddCategory}
                className="bg-muted-green rounded-md px-4 py-2 font-semibold text-white"
              >
                Add Category
              </button>
            )}

            <div className="border-dark-gray/40 flex items-center gap-2 rounded-md border px-3 py-2">
              This Month
              <IoMdArrowDropdown size={18} />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-light-gray/40 border-dark-gray/10 mt-3 grid w-full grid-cols-[2fr_1fr_1fr_1fr] rounded-md border px-2 py-3 text-sm font-medium">
          {tableHeaders.map((item) => (
            <h3 key={item}>{item}</h3>
          ))}
        </div>

        {/* Content */}
        {isFetchingCategories ? (
          <div className="flex h-[300px] items-center justify-center">
            <Spinner type="big" />
          </div>
        ) : paginatedCategories.length > 0 ? (
          <>
            {paginatedCategories.map((item) => (
              <TableCategoryItem
                key={item.id}
                category={item.name}
                productStock={item.totalProducts}
                id={item.id}
                categoryImage={item.categoryImage}
              />
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
            <p>No Category</p>

            <button
              onClick={handleShowAddCategory}
              className="bg-muted-green mt-3 rounded-lg px-10 py-4 font-bold text-white"
            >
              Add Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
}