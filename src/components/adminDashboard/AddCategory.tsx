import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { categorySchema, type TCategorySchema } from "../../libs/formSchema";
import { createCategory } from "../../services/adminDashboard/apiProducts";
import Spinner from "../Spinner";
import { useModal } from "../../contexts/hooks/useModal";

export default function AddCategory() {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TCategorySchema>({
    resolver: zodResolver(categorySchema),
  });

  async function onSubmit(data: TCategorySchema) {
    const { name, description } = data;

    try {
      const success = await createCategory({ name, description, image: undefined });

      if (success) {
        toast.success("Category Added Successfully");
        await queryClient.invalidateQueries({ queryKey: ["categories"] });
        closeModal();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="relative bg-white rounded-xl p-6 shadow-lg border border-[#dec1af] max-w-md mx-auto">
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FaTimes size={20} />
      </button>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#574235] mb-4">Add New Category</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#574235]/70">Category Title</label>
            <input
              type="text"
              placeholder="Enter title"
              className="rounded-md border border-[#dec1af] p-2 outline-none focus:border-[#f57c00]"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{`${errors.name.message}`}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#574235]/70">Description</label>
            <textarea
              placeholder="Enter Description"
              className="rounded-md border border-[#dec1af] p-2 outline-none focus:border-[#f57c00]"
              {...register("description")}
              rows={3}
            ></textarea>
            {errors.description && (
              <p className="text-xs text-red-500">{`${errors.description.message}`}</p>
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
            {isSubmitting ? <Spinner type="small" /> : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
