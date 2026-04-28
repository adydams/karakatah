import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../services/adminDashboard/apiProducts";
import NavBar from "../../components/adminDashboard/NavBar";
import AddProduct from "../../components/adminDashboard/AddProduct";
import Spinner from "../../components/adminDashboard/Spinner";
import TableProductItem from "../../components/adminDashboard/TableProductItem";

const tableHeaders = [
  "Product Name & Size",
  "Price",
  "Stock",
  "Category",
  "Rating",
  "Action",
];

export default function Products() {
  const [showAddProduct, setShowAddProduct] = useState(false);

  const { data: products, isLoading: isFetchingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  function handleShowProduct() {
    setShowAddProduct((cat) => !cat);
  }

  return (
    <div className="font-primary w-full">
      <NavBar title="Products" />

      {/* Add Category */}
      {/* Add Category */}
      {showAddProduct && (
        <AddProduct
          showProduct={showAddProduct}
          handleShowProduct={handleShowProduct}
        />
      )}

      {/* list */}
      {/* list */}
      <div className="my-10 flex w-full flex-col items-start justify-start rounded-xl bg-white px-3 py-3 shadow-sm/5 transition-all duration-1000">
        <div className="flex w-full items-center justify-between py-2 text-sm">
          <h2 className="font-medium">All Product List</h2>

          <div className="flex items-center justify-end gap-4 text-xs">
            {!showAddProduct && (
              <button
                onClick={handleShowProduct}
                className="bg-orange cursor-pointer rounded-md px-4 py-2 font-semibold text-white"
              >
                Add Product
              </button>
            )}
            <div className="border-dark-gray/40 flex cursor-pointer items-center justify-end gap-2 rounded-md border px-3 py-2">
              This Month <IoMdArrowDropdown size={18} />
            </div>
          </div>
        </div>

        {/* Table */}
        {/* Header */}
        <div className="bg-light-gray/40 border-dark-gray/10 mt-3 grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] rounded-md border-t border-b px-2 py-3 text-sm font-medium">
          {tableHeaders.map((item) => (
            <h3 key={item}>{item}</h3>
          ))}
        </div>
        {isFetchingProducts ? (
          <div className="flex h-[300px] w-full items-center justify-center">
            <Spinner type="big" />
          </div>
        ) : products.data.length > 0 ? (
          products.data.map(
            (items: {
              id: string;
              name: string;
              categoryId: string;
              price: number;
              stockQuantity: string;
              images: { url: string }[];
            }) => (
              <TableProductItem
                key={items.id}
                name={items.name}
                image={items.images[0].url}
                stock={items.stockQuantity}
                rating={3.5}
                noReview={55}
                category={items.categoryId}
                price={items.price}
              />
            ),
          )
        ) : (
          <div className="flex h-[600px] w-full flex-col items-center justify-center">
            <p>No products </p>
            <button
              onClick={handleShowProduct}
              className="bg-orange mt-3 cursor-pointer rounded-lg px-10 py-4 font-bold text-white"
            >
              Add Product
            </button>
          </div>
        )}

        {/* Pagination */}
        {products && products.data.length > 10 && (
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
        )}
      </div>
    </div>
  );
}
