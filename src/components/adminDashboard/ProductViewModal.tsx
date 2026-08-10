import { useQuery } from "@tanstack/react-query";
import { FaTimes } from "react-icons/fa";
import { getBrands, getCategories, getSubCategories } from "../../services/adminDashboard/apiProducts";
import { formatPrice, normalizeListData } from "../../utils/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  product: any;
};

export default function ProductViewModal({ open, onClose, product }: Props) {
  const { data: categoriesResponse } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: subcategoriesResponse } = useQuery({ queryKey: ["subcategories"], queryFn: getSubCategories });
  const { data: brandsResponse } = useQuery({ queryKey: ["brands"], queryFn: getBrands });

  const categoriesList = normalizeListData<{ id: string; name: string }>(categoriesResponse);
  const subcategoriesList = normalizeListData<{ id: string; name: string }>(subcategoriesResponse);
  const brandsList = normalizeListData<{ id: string; name: string }>(brandsResponse);

  const categoryName = (product?.category?.name as string | undefined) || categoriesList.find((item) => item.id === product?.categoryId)?.name || "—";
  const subcategoryName = (product?.subCategory?.name as string | undefined) || subcategoriesList.find((item) => item.id === product?.subCategoryId)?.name || "—";
  const brandName = (product?.brand?.name as string | undefined) || brandsList.find((item) => item.id === product?.brandId)?.name || "—";

  if (!open || !product) return null;

  const formatDimensionValue = (value: unknown): string => (value === null || value === undefined || value === "" ? "—" : String(value));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-4xl rounded-[32px] bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Product</p>
            <h2 className="text-2xl font-semibold text-slate-900">{product.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
            <FaTimes />
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 p-3">
              <img src={product.images?.[0]?.url} alt={product.name} className="h-72 w-full rounded-[20px] object-cover" />
            </div>

            {product.images?.length > 1 && (
              <div className="grid gap-3 sm:grid-cols-3">
                {product.images.slice(1).map((image: any, index: number) => (
                  <img key={image.id || `${image.url}-${index}`} src={image.url} alt={`${product.name}-${index + 2}`} className="h-24 w-full rounded-[16px] object-cover" />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <p className="text-sm leading-6 text-slate-600">{product.description}</p>

            <div className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Price</span>
                <span className="font-semibold text-slate-900">₦{formatPrice(product.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Stock</span>
                <span className="font-semibold text-slate-900">{product.stockQuantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Category</span>
                <span className="font-semibold text-slate-900">{categoryName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Subcategory</span>
                <span className="font-semibold text-slate-900">{subcategoryName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Brand</span>
                <span className="font-semibold text-slate-900">{brandName}</span>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-semibold text-slate-900">Pickup Stations</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {product.inventories?.length > 0 ? (
                  product.inventories.map((inventory: any) => (
                    <li key={inventory.id} className="rounded-2xl bg-slate-50 px-3 py-2">
                      {inventory.productPickupStation?.station?.name || inventory.pickupStation?.name} — {inventory.quantityOnHand} items
                    </li>
                  ))
                ) : (
                  <li className="rounded-2xl bg-slate-50 px-3 py-2 text-slate-500">No stations assigned</li>
                )}
              </ul>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-semibold text-slate-900">Dimensions</h4>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm text-slate-600">
                <div>Weight: {formatDimensionValue(product.weightKg)}</div>
                <div>Length: {formatDimensionValue(product.lengthCm)}</div>
                <div>Width: {formatDimensionValue(product.widthCm)}</div>
                <div>Height: {formatDimensionValue(product.heightCm)}</div>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={onClose} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
