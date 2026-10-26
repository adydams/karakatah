import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getProducts, deleteProduct, getCategories } from "../../services/adminDashboard/apiProducts";

import AddProduct from "../../components/adminDashboard/AddProduct";
import Spinner from "../../components/Spinner";
import TableProductItem from "../../components/adminDashboard/TableProductItem";
import ProductViewModal from "../../components/adminDashboard/ProductViewModal";
import EditProductModal from "../../components/adminDashboard/EditProductModal";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";

const tableHeaders = [
  "Product Name & Size",
  "Price",
  "Stock",
  "Category",
  "Store Owner",
  "Rating",
  "Action",
];

type Product = {
  id: string;
  name: string;
  category: {
    name: string;
  };
  store: {
    owner: {
      name: string;
    };
  };
  price: number;
  stockQuantity: string;
  availableStock?: number;
  inventories?: {
    quantityOnHand: number;
    quantityReserved: number;
  }[];
  images: {
    url: string;
  }[];
};

interface ProductsResponse {
  products: Product[];
  total: number;
}

export default function Products() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [viewProductId, setViewProductId] = useState<string | undefined>(undefined);
  const [editProductId, setEditProductId] = useState<string | undefined>(undefined);

  // API State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [categoryId, setCategoryId] = useState("");

  // Local state for inputs
  const [tempSearch, setTempSearch] = useState("");
  const [tempCategoryId, setTempCategoryId] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const offset = (page - 1) * limit;

  const { data, isLoading: isFetchingProducts, isFetching, refetch } = useQuery<ProductsResponse>({
    queryKey: ["products", page, search, limit, categoryId],
    queryFn: () => getProducts({ limit, offset, search, categoryId }),
    placeholderData: keepPreviousData,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  useEffect(() => {
    setIsApplying(false);
  }, [data]);

  function handleShowProduct() {
    setShowAddProduct((prev) => !prev);
  }

  const products = data?.products ?? [];
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / limit);

  const applyFilters = () => {
    setIsApplying(true);
    setSearch(tempSearch);
    setCategoryId(tempCategoryId);
    setPage(1);
  };

  return (
    <div className="font-primary relative w-full min-w-0 max-w-full overflow-hidden">
      {/* Loading Overlay */}
      {(isFetching || isApplying) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity duration-200">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-6 rounded-full shadow-2xl border border-gray-100 animate-bounce">
              <Spinner />
            </div>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest animate-pulse">
              Fetching Products...
            </p>
          </div>
        </div>
      )}

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
          product={products.find(p => p.id === viewProductId)}
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

      <div className="my-10 flex min-w-0 w-full max-w-full flex-col rounded-xl bg-white px-3 py-3 shadow-sm/5">
        {/* Header */}
        <div className="flex w-full flex-col gap-4 py-2 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <h2 className="font-medium text-lg">All Product List</h2>

            {/* Pagination Info & Controls */}
            {totalProducts > 0 && (
              <div className="flex items-center gap-4 scale-90 origin-left">
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  <span>Total: <span className="font-bold text-gray-800">{totalProducts}</span></span>
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
            {!showAddProduct && (
              <button
                onClick={handleShowProduct}
                className="bg-orange-500 cursor-pointer rounded-md px-4 py-2 font-semibold text-white hover:bg-orange-600 transition-colors"
              >
                Add Product
              </button>
            )}

            {/* Category Filter */}
            <select
              value={tempCategoryId}
              onChange={(e) => setTempCategoryId(e.target.value)}
              className="border-gray-200 bg-gray-50 focus:bg-white focus:outline-none rounded-md border px-3 py-2 transition-all duration-300 focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="">All Categories</option>
              {categoriesData?.data?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Search Bar */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                placeholder="Search products..."
                className="border-gray-200 bg-gray-50 focus:bg-white focus:outline-none w-[150px] rounded-md border px-4 py-2 transition-all duration-300 focus:w-[220px] focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <button
              onClick={applyFilters}
              className="bg-orange-500 text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm"
            >
              Apply
            </button>

            {/* Items Per Page */}
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="border-gray-200 bg-gray-50 focus:bg-white focus:outline-none rounded-md border px-2 py-2 text-xs transition-all duration-300 focus:ring-2 focus:ring-orange-500/20"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        {/* Table wrapper for responsiveness */}
        <div
          className="horizontal-scrollbar mt-3 w-full max-w-full"
          style={{ overflowX: "scroll", overflowY: "hidden" }}
        >
          <div className="min-w-[1000px]" style={{ width: "1000px" }}>
            {/* Table header */}
            <div className="bg-light-gray/40 border-dark-gray/10 grid w-full grid-cols-[3fr_1fr_1fr_1fr_1fr_120px_120px] rounded-md border px-2 py-3 text-sm font-medium">
              {tableHeaders.map((item) => (
                <h3 key={item} className={item === "Action" ? "text-right" : ""}>{item}</h3>
              ))}
            </div>

            {/* Content */}
            {isFetchingProducts && !data ? (
              <div className="flex h-[300px] items-center justify-center">
                <Spinner type="big" />
              </div>
            ) : !products || products.length === 0 ? (
              <div className="flex h-[500px] flex-col items-center justify-center">
                <p>No products available</p>
                <button
                  onClick={handleShowProduct}
                  className="bg-orange-500 mt-3 rounded-lg px-10 py-4 font-bold text-white"
                >
                  Add Product
                </button>
              </div>
            ) : (
              <>
                {products.map((item) => (
                  <TableProductItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    image={item.images?.[0]?.url}
                    stock={item.availableStock ?? item.stockQuantity}
                    rating={3.5}
                    noReview={55}
                    category={item.category?.name}
                    storeOwner={item.store?.owner?.name}
                    price={item.price}
                    onView={(id) => setViewProductId(id)}
                    onEdit={(id) => setEditProductId(id)}
                    onDelete={async (id) => {
                      if (!id) return;
                      if (!window.confirm('Delete this product?')) return;
                      try {
                        await deleteProduct(id);
                        await refetch();
                        toast.success("Product deleted successfully");
                      } catch (err) {
                        console.error(err);
                        toast.error('Failed to delete product');
                      }
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
