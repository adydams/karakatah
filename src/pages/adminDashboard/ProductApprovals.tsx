import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { decideProductApproval, getPendingProductApprovals } from "../../services/apiAdmin";
import Spinner from "../../components/Spinner";
import DashboardPagination from "../../components/adminDashboard/DashboardPagination";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { MdSearch } from "react-icons/md";

type Product = {
  id: string;
  name: string;
  price: number;
  approvalDeadline?: string;
  store?: { name: string };
  category?: { name: string };
};

interface ProductApprovalsResponse {
  products: Product[];
  total: number;
}

export default function ProductApprovals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [rejecting, setRejecting] = useState<Product | null>(null);
  const [reason, setReason] = useState("");

  // API & Pagination State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const offset = (page - 1) * limit;

  const load = async () => {
    setIsLoading(true);
    try {
      // Note: Ideally the backend should support search/pagination for approvals.
      // If not, we filter locally, but the UI is built to support it.
      const response = await getPendingProductApprovals();
      const data = response.data || [];

      if (Array.isArray(data)) {
        // If backend doesn't support search/pagination yet, we simulate it locally
        const filtered = data.filter((p: any) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.store?.name.toLowerCase().includes(search.toLowerCase())
        );

        setTotalProducts(filtered.length);
        const start = offset;
        const end = offset + limit;
        setProducts(filtered.slice(start, end));
      } else {
        setProducts([]);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load product approvals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, search]);

  const decide = async (product: Product, decision: "approved" | "rejected", rejectionReason?: string) => {
    if (decision === "rejected" && !rejectionReason?.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      await decideProductApproval(product.id, decision, rejectionReason);
      toast.success(`Product ${decision === "approved" ? "approved" : "rejected"}`);
      await load();
      setRejecting(null);
      setReason("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not update product approval");
    }
  };

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="font-primary relative w-full min-w-0 max-w-full overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity duration-200">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-6 rounded-full shadow-2xl border border-gray-100 animate-bounce">
              <Spinner />
            </div>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest animate-pulse">
              Fetching Approvals...
            </p>
          </div>
        </div>
      )}

      <div className="my-10 flex min-w-0 w-full max-w-full flex-col rounded-xl bg-white px-3 py-3 shadow-sm/5">
        {/* Header */}
        <div className="flex w-full flex-col gap-4 py-2 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <h2 className="font-medium text-lg">Pending Product Approvals</h2>

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
                  >
                    <IoMdArrowForward size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search product or store..."
                className="border-gray-200 bg-gray-50 focus:bg-white focus:outline-none w-[150px] rounded-md border px-4 py-2 transition-all duration-300 focus:w-[220px] focus:ring-2 focus:ring-orange-500/20"
              />
              <div className="absolute right-3 text-gray-400">
                <MdSearch size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Table wrapper for responsiveness */}
        <div
          className="horizontal-scrollbar mt-3 w-full max-w-full"
          style={{ overflowX: "scroll", overflowY: "hidden" }}
        >
          <div className="min-w-[1000px]" style={{ width: "1000px" }}>
            {/* Table header */}
            <div className="bg-light-gray/40 border-dark-gray/10 grid w-full grid-cols-[3fr_2fr_2fr_200px] rounded-md border px-2 py-3 text-sm font-medium">
              <h3>Product Name</h3>
              <h3>Store</h3>
              <h3>SLA Deadline</h3>
              <h3 className="text-right">Actions</h3>
            </div>

            {/* Content */}
            {isLoading && !products.length ? (
              <div className="flex h-[300px] items-center justify-center">
                <Spinner type="big" />
              </div>
            ) : !products || products.length === 0 ? (
              <div className="flex h-[500px] flex-col items-center justify-center text-gray-500">
                <p>No products awaiting review.</p>
              </div>
            ) : (
              <>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border-dark-gray/10 grid w-full grid-cols-[3fr_2fr_2fr_200px] items-center px-2 py-3 text-sm border-b last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-800">{product.name}</div>
                    <div className="text-gray-600">{product.store?.name || "Unknown Store"}</div>
                    <div className="text-gray-500">
                      {product.approvalDeadline
                        ? new Date(product.approvalDeadline).toLocaleString()
                        : "Not enabled"}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        className="bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-green-700 transition-colors"
                        onClick={() => decide(product, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-red-700 transition-colors"
                        onClick={() => setRejecting(product)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejecting && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="mb-3 text-lg font-bold text-gray-800">Reject Product Approval</h2>
            <p className="mb-4 text-sm text-gray-500">
              You are rejecting <span className="font-bold text-gray-800">{rejecting.name}</span>. Please provide a reason.
            </p>
            <textarea
              className="mb-4 w-full rounded-lg border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
              rows={4}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="e.g. Image quality too low, incorrect category, etc."
            />
            <div className="flex justify-end gap-3">
              <button
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => { setRejecting(null); setReason(""); }}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-md"
                onClick={() => decide(rejecting, "rejected", reason)}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
