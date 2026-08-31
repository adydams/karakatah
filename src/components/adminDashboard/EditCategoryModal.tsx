import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useLogin } from "../../contexts/hooks/useLogin";
import { categorySchema, type TCategorySchema } from "../../libs/formSchema";
import { updateCategory } from "../../services/adminDashboard/apiProducts";
import Spinner from "../Spinner";
import { useModal } from "../../contexts/hooks/useModal";
import { FaCloudUploadAlt } from "react-icons/fa";

type Props = {
  category: any;
};

export default function EditCategoryModal({ category }: Props) {
  const { closeModal } = useModal();
  const [fileName, setFileName] = useState(category.categoryImage ? "Image already uploaded" : "");
  const { token } = useLogin();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TCategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      description: category.description,
    },
  });

  async function onSubmit(data: TCategorySchema) {
    try {
      const success = await updateCategory(category.id, { ...data, image: data.image || category.categoryImage }, token);

      if (success) {
        toast.success("Category Updated Successfully");
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
    <div className="bg-white rounded-xl p-6 shadow-lg border border-[#dec1af] max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#574235] mb-4">Edit Category</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#574235]/70">Category Title</label>
            <input
              type="text"
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
              className="rounded-md border border-[#dec1af] p-2 outline-none focus:border-[#f57c00]"
              {...register("description")}
              rows={3}
            ></textarea>
            {errors.description && (
              <p className="text-xs text-red-500">{`${errors.description.message}`}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#574235]/70">Thumbnail Photo</label>
            <div className="border-dark-gray/40 flex h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-10">
              {category.categoryImage ? (
                <img src={category.categoryImage} className="h-32 w-32 object-cover rounded-md mb-2" alt="Current" />
              ) : (
                <FaCloudUploadAlt size={40} className="text-orange" />
              )}
              <h2 className="mt-2 text-sm font-medium">
                {category.categoryImage ? "Change image" : "Drop your images here, or "}
                <span className="text-orange font-semibold">click to browse</span>
              </h2>
              {fileName && (
                <p className="text-orange mt-3 text-xs font-medium">{fileName}</p>
              )}
            </div>
            <input
              type="file"
              hidden
              accept="image/*"
              {...register("image")}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFileName(file.name);
                  setValue("image", file, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
            />
            {errors.image && (
              <p className="text-xs text-red-500">{`${errors.image.message}`}</p>
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
            {isSubmitting ? <Spinner type="small" /> : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
