import NavBar from "../../components/adminDashboard/NavBar";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/adminDashboard/apiProducts";
import Spinner from "../../components/adminDashboard/Spinner";
import AddCategory from "../../components/adminDashboard/AddCategory";
import { IoMdArrowDropdown } from "react-icons/io";
import TableCategoryItem from "../../components/adminDashboard/TableCategoryItem";

const tableHeaders = ["Categories", "ID", "Product Stock", "Action"];

export default function Categories() {
  const [showAddCat, setShowAddCat] = useState(false);

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

  console.log(categories);

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

  return (
    <div className="font-primary w-full">
      <NavBar title="Categories" />

      {isFetchingCategories ? (
        <div className="flex h-[300px] w-full items-center justify-center">
          <Spinner type="big" />
        </div>
      ) : (
        <div className="my-2 grid w-full grid-cols-2 gap-5 md:grid-cols-4 lg:mt-10 lg:mb-5">
          {/* {categoriesList.map((item) => ( */}
          {(categories?.data?.slice(0, 4) ?? [])(0, 4).map(
            (item: { id: string; name: string; categoryImage: string }) => (
              <div
                className="flex w-full flex-col items-center gap-3 rounded-lg bg-white p-3 shadow-sm/5"
                key={item.id}
              >
                <div className="h-[160px] w-full overflow-hidden rounded-md">
                  <img
                    className="h-full w-full object-cover"
                    src={item.categoryImage}
                    alt=""
                  />
                </div>
                <h2 className="text-sm font-semibold">{item.name}</h2>
              </div>
            ),
          )}
        </div>
      )}

      {/* Add Category */}
      {/* Add Category */}
      {showAddCat && (
        <AddCategory handleShowAddCategory={handleShowAddCategory} />
      )}

      {/* list */}
      {/* list */}
      <div className="flex w-full flex-col items-start justify-start rounded-xl bg-white px-3 py-3 shadow-sm/5 transition-all duration-1000">
        <div className="flex w-full items-center justify-between py-2 text-sm">
          <h2 className="font-medium">All Categories List</h2>

          <div className="flex items-center justify-end gap-4 text-xs">
            {!showAddCat && (
              <button
                onClick={handleShowAddCategory}
                className="bg-muted-green cursor-pointer rounded-md px-4 py-2 font-semibold text-white"
              >
                Add Category
              </button>
            )}
            <div className="border-dark-gray/40 flex cursor-pointer items-center justify-end gap-2 rounded-md border px-3 py-2">
              This Month <IoMdArrowDropdown size={18} />
            </div>
          </div>
        </div>

        {/* Table */}
        {/* Header */}
        <div className="bg-light-gray/40 border-dark-gray/10 mt-3 grid w-full grid-cols-[2fr_1fr_1fr_1fr] rounded-md border-t border-b px-2 py-3 text-sm font-medium">
          {tableHeaders.map((item) => (
            <h3 key={item}>{item}</h3>
          ))}
        </div>
        {isFetchingCategories ? (
          <div className="flex h-[300px] w-full items-center justify-center">
            <Spinner type="big" />
          </div>
        ) : categories?.data?.length > 0 ? (
          categories?.data?.map(
            (item: {
              id: string;
              name: string;
              totalProducts: number;
              categoryImage: string;
            }) => (
              <TableCategoryItem
                key={item.id}
                category={item.name}
                productStock={item.totalProducts}
                id={item.id}
                categoryImage={item.categoryImage}
              />
            ),
          )
        ) : (
          <div className="flex h-[600px] w-full flex-col items-center justify-center">
            <p>No Category </p>
            <button
              onClick={handleShowAddCategory}
              className="bg-muted-green mt-3 cursor-pointer rounded-lg px-10 py-4 font-bold text-white"
            >
              Add Category
            </button>
          </div>
        )}

        {/* Pagination */}
        <div className="border-dark-gray/20 text-dark-gray/80 mt-3 flex items-center justify-center self-end overflow-hidden rounded-full border text-xs font-semibold">
          <button className="hover:bg-dark-gray/5 cursor-pointer px-3 py-2">
            Previous
          </button>
          <button className="hover:bg-dark-gray/5 cursor-pointer px-3 py-2">
            1
          </button>
          <button className="hover:bg-dark-gray/5 cursor-pointer px-3 py-2">
            2
          </button>
          <button className="hover:bg-dark-gray/5 cursor-pointer px-3 py-2">
            3
          </button>
          <button className="hover:bg-dark-gray/5 cursor-pointer px-3 py-2">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
