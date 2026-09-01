import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { createSubCategory, getCategories } from "../../services/adminDashboard/apiProducts";
import Spinner from "../Spinner";
import { useModal } from "../../contexts/hooks/useModal";
import { normalizeListData } from "../../utils/utils";

type TSubCategorySchema = {
  name: string;
  description: string;
  categoryId: string;
};

export default function AddSubcategoryModal() {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const { data: categoriesData, isLoading: isLoadingCats } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = normalizeListData(categoriesData);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSubCategorySchema>();

  async function onSubmit(data: TSubCategorySchema) {
    try {
      const success = await createSubCategory({ ...data });

      if (success) {
        toast.success("Sub-Category Added Successfully");
        await queryClient.invalidateQueries({ queryKey: ["subcategories"] });
        closeModal();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add sub-category");
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-[#dec1af] max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#574235] mb-4">Add New Sub-Category</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#574235]/70">Sub-Category Name</label>
            <input
              type="text"
              placeholder="Enter name"
              className="rounded-md border border-[#dec1af] p-2 outline-none focus:border-[#f57c00]"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#574235]/70">Description</label>
            <textarea
              placeholder="Enter description"
              className="rounded-md border border-[#dec1af] p-2 outline-none focus:border-[#f57c00]"
              {...register("description", { required: "Description is required" })}
              rows={3}
            ></textarea>
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#574235]/70">Parent Category</label>
            <select
              className="rounded-md border border-[#dec1af] p-2 outline-none focus:border-[#f57c00] bg-white"
              {...register("categoryId", { required: "Category is required" })}
            >
              <option value="">Select Category</option>
              {isLoadingCats ? (
                <option disabled>Loading categories...</option>
              ) : (
                categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-red-500">{errors.categoryId.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#f57c00] px-4 py-2 text-sm font-semibold text-white rounded-md hover:bg-[#e67300] disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? <Spinner type="small" /> : "Create Sub-Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
