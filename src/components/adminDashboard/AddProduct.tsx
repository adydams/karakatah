import { useQuery, useQueryClient } from "@tanstack/react-query";

import Spinner from "./Spinner";
import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useLogin } from "../../contexts/hooks/useLogin";
import { productSchema, type TProductSchema } from "../../libs/formSchema";
import {
  createProduct,
  getBrands,
  getCategories,
  getSubCategories,
} from "../../services/adminDashboard/apiProducts";

type AddProductProp = {
  handleShowProduct: () => void;
  showProduct: boolean;
};

export default function AddProduct({
  handleShowProduct,
  showProduct,
}: AddProductProp) {
  //   const [fileName, setFileName] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const { token } = useLogin();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<TProductSchema>({
    resolver: zodResolver(productSchema),
  });

  const { data: categories, isLoading: isFetchingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { data: subcategories, isLoading: isFetchingSubCategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: getSubCategories,
  });
  const { data: brands, isLoading: isFetchingBrand } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  async function onSubmit(data: TProductSchema) {
    const {
      name,
      description,
      price,
      stockQuantity,
      categoryId,
      subCategoryId,
      brandId,
      images,
    } = data;
    try {
      const success = await createProduct(
        {
          name,
          description,
          price,
          stockQuantity,
          categoryId,
          subCategoryId,
          brandId,
          images,
        },
        token,
      );

      if (success) {
        toast.success("Category Added Successfully");

        // 🔥 Force refetch of products list
        await queryClient.invalidateQueries({ queryKey: ["products"] });

        handleShowProduct();
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
      {showProduct && (
        <MdOutlineCancel
          onClick={handleShowProduct}
          size={30}
          className="text-orange/60 hover:text-orange absolute top-5 right-4 cursor-pointer transition-all duration-500 md:right-10"
        />
      )}
      <h2 className="border-orange mb-3 border-l-4 px-2 text-lg font-medium">
        Add a new product
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start justify-start gap-3"
      >
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-5">
          <div className="flex flex-col items-start justify-start gap-1.5 md:w-1/2">
            <label className="text-xs font-semibold" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              id="name"
              className="border-dark-gray/40 focus:border-orange/20 focus:text-orange w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{`${errors.name.message}`}</p>
            )}
          </div>
          <div className="flex flex-col items-start justify-start gap-1.5 md:w-1/2">
            <label className="text-xs font-semibold" htmlFor="price">
              Price
            </label>
            <input
              type="number"
              placeholder="Enter price"
              id="price"
              className="border-dark-gray/40 focus:border-orange/20 focus:text-orange w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
              {...register("price")}
            />
            {errors.price && (
              <p className="text-xs text-red-500">{`${errors.price.message}`}</p>
            )}
          </div>
        </div>

        {/* Second Row */}
        <div className="mt-2 flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-5">
          <div className="flex flex-col items-start justify-start gap-1.5 md:w-1/2">
            <label className="text-xs font-semibold" htmlFor="stockQuantity">
              Stock Quantity
            </label>
            <input
              type="number"
              placeholder="Enter number of products"
              id="stockQuantity"
              className="border-dark-gray/40 focus:border-orange/20 focus:text-orange w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
              {...register("stockQuantity")}
            />
            {errors.stockQuantity && (
              <p className="text-xs text-red-500">{`${errors.stockQuantity.message}`}</p>
            )}
          </div>
          <div className="flex flex-col items-start justify-start gap-1.5 md:w-1/2">
            <label className="text-xs font-semibold" htmlFor="categoryId">
              Category
            </label>

            <select
              className="border-dark-gray/40 focus:border-orange/20 focus:text-orange w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
              id="categoryId"
              {...register("categoryId")}
            >
              <option value="nil">--Select Category--</option>
              {isFetchingCategories ? (
                <Spinner type="small" />
              ) : (
                categories.data.map((item: { id: string; name: string }) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))
              )}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-red-500">{`${errors.categoryId.message}`}</p>
            )}
          </div>
        </div>

        {/* Third Row */}
        <div className="mt-2 flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-5">
          <div className="flex flex-col items-start justify-start gap-1.5 md:w-1/2">
            <label className="text-xs font-semibold" htmlFor="subCategoryId">
              Sub Category
            </label>
            <select
              className="border-dark-gray/40 focus:border-orange/20 focus:text-orange w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
              id="subCategoryId"
              {...register("subCategoryId")}
            >
              <option value="nil">--Select Sub-Category--</option>
              {isFetchingSubCategories ? (
                <Spinner type="small" />
              ) : (
                subcategories.data.map((item: { id: string; name: string }) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))
              )}
            </select>
            {errors.subCategoryId && (
              <p className="text-xs text-red-500">{`${errors.subCategoryId.message}`}</p>
            )}
          </div>
          <div className="flex flex-col items-start justify-start gap-1.5 md:w-1/2">
            <label className="text-xs font-semibold" htmlFor="brandId">
              Brand
            </label>

            <select
              className="border-dark-gray/40 focus:border-orange/20 focus:text-orange w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
              id="brandId"
              {...register("brandId")}
            >
              <option value="nil">--Select Brand--</option>
              {isFetchingBrand ? (
                <Spinner type="small" />
              ) : (
                brands.brands.map((item: { id: string; name: string }) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))
              )}
              {/* {isFetchingBrand ? (
                <Spinner type="small" />
              ) : brands.data.length >= 0 ? (
                brands.data.map((item: { id: string; name: string }) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))
              ) : (
                "No brands, create a new brand"
              )} */}
            </select>
            {errors.brandId && (
              <p className="text-xs text-red-500">{`${errors.brandId.message}`}</p>
            )}
          </div>
        </div>

        {/* Fourth Row */}
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

        {/* Fifth Row */}

        <div className="flex w-full flex-col items-start justify-start gap-1.5">
          <label className="w-full gap-2 text-xs" htmlFor="images">
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

              {files.length > 0 && (
                <div className="mt-3 flex flex-col gap-1">
                  {files.map((file, index) => (
                    <p key={index} className="text-orange text-xs font-medium">
                      {file.name}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* <input
                      type="file"
                      hidden
                      id="images"
                      {...register("display_picture")}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFileName(e.target.files[0].name);
                        }
                      }}
                    /> */}

            <input
              type="file"
              hidden
              id="images"
              accept="image/*"
              multiple
              {...register("images")}
              //   {...register("image")}
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files || []);

                if (selectedFiles.length > 0) {
                  setFiles(selectedFiles);

                  setValue("images", selectedFiles, {
                    // ✅ use selectedFiles
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
            />
          </label>
          {/* {errors.image && (
            <p className="text-xs text-red-500">{`${errors.image.message}`}</p>
          )} */}
          {errors.images && (
            <p className="text-xs text-red-500">{`${errors.images.message}`}</p>
          )}
        </div>
        <button
          className="bg-orange hover:bg-orange/90 disabled:bg-orange/70 h-[40px] w-[150px] cursor-pointer self-end rounded-md text-xs font-semibold text-white transition-all duration-100 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner type="small" /> : "Add a Product"}
        </button>
      </form>
    </div>
  );
}
