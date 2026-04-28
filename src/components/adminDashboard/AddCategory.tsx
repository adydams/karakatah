import { FaCloudUploadAlt } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";

import Spinner from "./Spinner";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useLogin } from "../../contexts/hooks/useLogin";
import { categorySchema, type TCategorySchema } from "../../libs/formSchema";
import { createCategory } from "../../services/adminDashboard/apiProducts";
// import { createCategory } from "../services/apiProducts";

type AddCategoryProp = {
  handleShowAddCategory: () => void;
};

export default function AddCategory({
  handleShowAddCategory,
}: AddCategoryProp) {
  const [fileName, setFileName] = useState("");

  const { token } = useLogin();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TCategorySchema>({
    resolver: zodResolver(categorySchema),
  });

  async function onSubmit(data: TCategorySchema) {
    const { name, description, image } = data;

    try {
      const success = await createCategory({ name, description, image }, token);

      if (success) {
        toast.success("Category Added Successfully");

        // 🔥 Force refetch of products list
        await queryClient.invalidateQueries({ queryKey: ["categories"] });

        handleShowAddCategory();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        // console.log(err.message);
        toast.error(err.message);
      } else {
        // console.log("An unexpected error occurred");
        toast("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="relative my-10 flex w-full flex-col items-start justify-start gap-3 rounded-md bg-white px-4 py-5 text-sm shadow-sm/5 transition-all duration-1000">
      <MdOutlineCancel
        onClick={handleShowAddCategory}
        size={30}
        className="text-orange/60 hover:text-orange absolute top-5 right-4 cursor-pointer transition-all duration-500 md:right-10"
      />
      <h2 className="border-orange mb-3 border-l-4 px-2 text-lg font-medium">
        Add a new category
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start justify-start gap-3"
      >
        <div className="grid w-full grid-cols-1 gap-5">
          <div className="flex w-1/2 flex-col items-start justify-start gap-1.5">
            <label className="text-xs font-semibold" htmlFor="name">
              Category Title
            </label>
            <input
              type="text"
              placeholder="Enter title"
              id="name"
              className="border-dark-gray/40 focus:border-orange/20 focus:text-orange w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{`${errors.name.message}`}</p>
            )}
          </div>
          <div className="flex w-full flex-col items-start justify-start gap-1.5">
            <label className="text-xs font-semibold" htmlFor="description">
              Description
            </label>
            <textarea
              placeholder="Enter Description"
              id="description"
              className="border-dark-gray/40 focus:border-orange/20 focus:text-orange h-20 w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
              {...register("description")}
            ></textarea>
            {errors.description && (
              <p className="text-xs text-red-500">{`${errors.description.message}`}</p>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-1.5">
          {/* <label className="w-full gap-2 text-xs" htmlFor="banner">
            <p className="py-3 font-semibold"> Add thumbnail photo</p>
            <div className="border-dark-gray/40 flex h-[250px] w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-10">
              <FaCloudUploadAlt size={40} className="text-orange" />
              <h2 className="mt-10 text-xl font-medium">
                Drop your images here, or{" "}
                <span className="text-orange font-semibold">
                  click to browse
                </span>
              </h2>
              <p className="mt-1 text-xs">
                1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are
                allowed
              </p>
            </div>
            <input
              type="file"
              hidden
              // placeholder="Enter title"
              id="banner"
              {...register("display")}
              //   className="border-dark-gray/40 focus:border-orange/20 focus:text-orange w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
            />
          </label> */}
          <label className="w-full gap-2 text-xs" htmlFor="banner">
            <p className="py-3 font-semibold">Add thumbnail photo</p>

            <div className="border-dark-gray/40 flex h-[250px] w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-10">
              <FaCloudUploadAlt size={40} className="text-orange" />

              <h2 className="mt-10 text-xl font-medium">
                Drop your images here, or{" "}
                <span className="text-orange font-semibold">
                  click to browse
                </span>
              </h2>

              <p className="mt-1 text-xs">
                1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are
                allowed
              </p>

              {fileName && (
                <p className="text-orange mt-3 text-xs font-medium">
                  {fileName}
                </p>
              )}
            </div>

            <input
              type="file"
              hidden
              id="banner"
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
          </label>
          {errors.image && (
            <p className="text-xs text-red-500">{`${errors.image.message}`}</p>
          )}
        </div>
        <button
          className="bg-orange hover:bg-orange/90 disabled:bg-orange/70 h-[40px] w-[150px] cursor-pointer self-end rounded-md text-xs font-semibold text-white transition-all duration-100 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner type="small" /> : "Add a Category"}
        </button>
      </form>
    </div>
  );
}
