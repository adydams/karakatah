import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../../services/adminDashboard/apiProducts";
import Spinner from "../Spinner";
import { FaTimes } from "react-icons/fa";

type Props = {
  open: boolean;
  onClose: () => void;
  product: any;
};

export default function ProductViewModal({ open, onClose, product }: Props) {
  const { data: productData, isLoading } = useQuery({
    queryKey: ["productView", product?.id],
    queryFn: () => getProductById(product?.id),
    enabled: !!product?.id,
  });

  const displayProduct = productData?.data || product;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl">&times;</button>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner type="big" />
          </div>
        ) : displayProduct ? (
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <div className="aspect-square rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={displayProduct.images?.[0]?.url || "https://via.placeholder.com/300"}
                    alt={displayProduct.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#574235]">{displayProduct.name}</h3>
                  <p className="text-sm text-gray-500">{displayProduct.category?.name || 'No Category'}</p>
                </div>

                <div className="text-3xl font-black text-orange-600">
                  ₦{displayProduct.price?.toLocaleString()}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Stock</p>
                    <p className="text-sm font-bold text-gray-800">{displayProduct.stockQuantity}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Status</p>
                    <p className="text-sm font-bold text-gray-800">{displayProduct.isPublished ? "Published" : "Draft"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{displayProduct.description || "No description available."}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
               <button
                 onClick={onClose}
                 className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
               >
                 Close Details
               </button>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">Product not found.</div>
        )}
      </div>
    </div>
  );
}
