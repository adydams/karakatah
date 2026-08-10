import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";

import { getProducts, deleteProduct } from "../../services/adminDashboard/apiProducts";

import NavBar from "../../components/adminDashboard/NavBar";
import AddProduct from "../../components/adminDashboard/AddProduct";
import Spinner from "../../components/adminDashboard/Spinner";
import TableProductItem from "../../components/adminDashboard/TableProductItem";
import ProductViewModal from "../../components/adminDashboard/ProductViewModal";
import EditProductModal from "../../components/adminDashboard/EditProductModal";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";

const tableHeaders = [
  "Product Name & Size",
  "Price",
  "Stock",
  "Category",
  "Rating",
  "Action",
];

const PRODUCTS_PER_PAGE = 10;

type Product = {
  id: string;
  name: string;
  category: {
    name: string;
  };
  price: number;
  stockQuantity: string;
  images: {
    url: string;
  }[];
};

export default function Products() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [viewProductId, setViewProductId] = useState<string | undefined>(undefined);
  const [editProductId, setEditProductId] = useState<string | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState(1);

  const { data: products, isLoading: isFetchingProducts, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  function handleShowProduct() {
    setShowAddProduct((prev) => !prev);
  }

  const allProducts: Product[] = products?.data ?? [];

  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);

  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const paginatedProducts = allProducts.slice(start, start + PRODUCTS_PER_PAGE);

  return (
    <div className="font-primary w-full">
      <NavBar title="Products" />

      {showAddProduct && (
        <AddProduct
          showProduct={showAddProduct}
          handleShowProduct={handleShowProduct}
        />
      )}

      {viewProductId && (
        <ProductViewModal
          open={!!viewProductId}
          onClose={() => setViewProductId(undefined)}
          product={allProducts.find(p => p.id === viewProductId)}
        />
      )}

      {editProductId && (
        <EditProductModal
          open={!!editProductId}
          onClose={() => { setEditProductId(undefined); refetch(); }}
          productId={editProductId}
          onUpdated={() => { refetch(); }}
        />
      )}

      <div className="my-10 flex w-full flex-col rounded-xl bg-white px-3 py-3 shadow-sm/5">
        {/* Header */}
        <div className="flex w-full items-center justify-between py-2 text-sm">
          <h2 className="font-medium">All Product List</h2>

          <div className="flex items-center gap-4 text-xs">
            {!showAddProduct && (
              <button
                onClick={handleShowProduct}
                className="bg-orange cursor-pointer rounded-md px-4 py-2 font-semibold text-white"
              >
                Add Product
              </button>
            )}

            <div className="border-dark-gray/40 flex items-center gap-2 rounded-md border px-3 py-2">
              This Month <IoMdArrowDropdown size={18} />
            </div>
          </div>
        </div>

        {/* Table header */}
        <div className="bg-light-gray/40 border-dark-gray/10 mt-3 grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] rounded-md border px-2 py-3 text-sm font-medium">
          {tableHeaders.map((item) => (
            <h3 key={item}>{item}</h3>
          ))}
        </div>

        {/* Loading */}
        {isFetchingProducts ? (
          <div className="flex h-[300px] items-center justify-center">
            <Spinner type="big" />
          </div>
        ) : !products || allProducts.length === 0 ? (
          <div className="flex h-[500px] flex-col items-center justify-center">
            <p>No products available</p>

            <button
              onClick={handleShowProduct}
              className="bg-orange mt-3 rounded-lg px-10 py-4 font-bold text-white"
            >
              Add Product
            </button>
          </div>
        ) : (
          <>
            {paginatedProducts.map((item) => (
              <TableProductItem
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.images?.[0]?.url}
                stock={item.stockQuantity}
                rating={3.5}
                noReview={55}
                category={item.category?.name}
                price={item.price}
                onView={(id) => setViewProductId(id)}
                onEdit={(id) => setEditProductId(id)}
                onDelete={async (id) => {
                  if (!id) return;
                  if (!confirm('Delete this product?')) return;
                  try {
                                    await deleteProduct(id);
                    await refetch();
                  } catch (err) {
                    console.error(err);
                    alert('Failed to delete product');
                  }
                }}
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
        )}
      </div>
    </div>
  );
}
