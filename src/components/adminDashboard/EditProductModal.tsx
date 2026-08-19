import { useEffect, useState, type ChangeEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import toast from "react-hot-toast";
import type { ProductPayload } from "../../libs/types";
import { productEditSchema, type TProductEditSchema } from "../../libs/formSchema";
import { getProductById, getBrands, getCategories, getLogisticsCategories, getSubCategories, updateProduct } from "../../services/adminDashboard/apiProducts";
import { getBoxSizes } from "../../services/apiLogistics";
import { assignProductToStation, getPickupStations, updateStationStock } from "../../services/adminDashboard/apiPickupStation";
import PickupStationForm from "./PickupStationForm";
import Spinner from "./Spinner";
import ImagePreviewList from "./ImagePreviewList";
import { normalizeListData } from "../../utils/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  productId: string | undefined;
  onUpdated?: () => void;
};

type StationRow = {
  stationId?: string;
  stock: string;
  productPickupStationId?: string;
};

type ExistingImage = {
  id?: string;
  url: string;
  name?: string;
};

type ApiProductInventory = {
  productPickupStation?: { id?: string; station?: { id?: string } };
  pickupStation?: { id?: string };
  quantityOnHand?: number;
  productPickupStationId?: string;
};

type EditProductFormValues = {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
  categoryId: string;
  subCategoryId: string;
  brandId: string;
  storeId?: string;
  logisticsCategoryId?: string;
  boxSizeId?: string;
  images?: File[];
};

type ApiProduct = {
  name?: string;
  description?: string;
  price?: string | number;
  stockQuantity?: string | number;
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  logisticsCategoryId?: string;
  weightKg?: string | number;
  lengthCm?: string | number;
  widthCm?: string | number;
  heightCm?: string | number;
  images?: Array<{ id?: string; url: string; name?: string; filename?: string }>;
  inventories?: ApiProductInventory[];
};

type SelectOption = {
  id: string;
  name: string;
};

type PickupStationOption = {
  id: string;
  name?: string;
  address?: string;
};

export default function EditProductModal({ open, onClose, productId, onUpdated }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [stations, setStations] = useState<StationRow[]>([]);
  const [showStationForm, setShowStationForm] = useState(false);
  const [dimensions, setDimensions] = useState({ weight: "", length: "", width: "", height: "" });
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<EditProductFormValues>({ resolver: zodResolver(productEditSchema) });

  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

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
  const { data: logisticsCategories, isLoading: isFetchingLogisticsCategories } = useQuery({
    queryKey: ["logisticsCategories"],
    queryFn: getLogisticsCategories,
  });
  const { data: boxSizes, isLoading: isFetchingBoxSizes } = useQuery({
    queryKey: ["boxSizes"],
    queryFn: getBoxSizes,
  });
  const { data: pickupStationResponse, isLoading: isFetchingStations } = useQuery({
    queryKey: ["pickupStations"],
    queryFn: getPickupStations,
  });
  const pickupStations = normalizeListData<PickupStationOption>(pickupStationResponse);
  const categoriesList = normalizeListData<SelectOption>(categories);
  const subcategoriesList = normalizeListData<SelectOption>(subcategories);
  const brandsList = normalizeListData<SelectOption>(brands);
  const logisticsCategoryList = normalizeListData(logisticsCategories).map((cat: any) => ({
    id: String(cat.category_id),
    name: cat.category,
  }));
  const boxSizesList = normalizeListData(boxSizes).map((box: any, index: number) => ({
    id: String(box.box_size_id ?? box.id ?? index),
    name: box.box_size_name || box.name || `Box ${index + 1}`,
    weight: box.max_weight ?? box.weight,
    length: box.length,
    width: box.width,
    height: box.height,
    maxWeight: box.max_weight,
    description_image_url: box.description_image_url,
  }));

  const totalStock = stations.reduce((acc, station) => acc + (Number(station.stock) || 0), 0);

  useEffect(() => {
    if (!open || !productId) return;

    const fetchProduct = async () => {
      try {
        const res = await getProductById(productId);
        const productData = res.data?.data || res.data;
 
        reset({
         name: productData.name ?? "",
         description: productData.description ?? "",
         price: String(productData.price ?? ""),
         stockQuantity: String(productData.stockQuantity ?? "0"),
         categoryId: productData.categoryId || "",
         subCategoryId: productData.subCategoryId || "",
         brandId: productData.brandId || "",
         logisticsCategoryId: String(productData.logisticsCategoryId ?? ""),
         boxSizeId: String(productData.boxSizeId ?? ""),
         images: [],
        });
 
        setSelectedFiles([]);
        setPreviewUrls([]);
        setRemovedImageIds([]);
        setExistingImages((productData.images ?? []).map((image: any) => ({
         id: image.id,
         url: image.url,
         name: image.name || image.filename || "Product image",
        })));
        setDimensions({
          weight: String(productData.weightKg ?? ""),
          length: String(productData.lengthCm ?? ""),
          width: String(productData.widthCm ?? ""),
          height: String(productData.heightCm ?? ""),
        });

        const initialStations = (productData.inventories ?? []).map((inventory: any) => ({
          stationId: inventory?.productPickupStation?.station?.id || inventory?.pickupStation?.id || "",
          stock: String(inventory?.quantityOnHand ?? 0),
          productPickupStationId: inventory?.productPickupStationId || inventory?.productPickupStation?.id || "",
        }));

        setStations(initialStations.length > 0 ? initialStations : [{ stationId: "", stock: "0" }]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product details");
      }
    };

    fetchProduct();
  }, [open, productId, reset]);

  useEffect(() => {
    setValue("stockQuantity", String(totalStock));
  }, [setValue, totalStock]);

  const removePreviewItem = (index: number, kind: "file" | "url") => {
    if (kind === "url") {
      const targetImage = existingImages[index];
      const nextTotal = existingImages.length + selectedFiles.length - 1;

      if (nextTotal < 1) {
        toast.error("Please keep at least one product image.");
        return;
      }

      setExistingImages((current) => current.filter((_, itemIndex) => itemIndex !== index));
      setRemovedImageIds((current) =>
        targetImage?.id && !current.includes(targetImage.id) ? [...current, targetImage.id] : current,
      );
      return;
    }

    const nextTotal = existingImages.length + selectedFiles.length - 1;
    if (nextTotal < 1) {
      toast.error("Please keep at least one product image.");
      return;
    }

    setSelectedFiles((current) => {
      const nextFiles = current.filter((_, itemIndex) => itemIndex !== index);
      setValue("images", nextFiles, {
        shouldValidate: true,
        shouldDirty: true,
      });
      return nextFiles;
    });
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;

    const totalImages = existingImages.length + selectedFiles.length;
    const remainingSlots = Math.max(0, 3 - totalImages);
    if (remainingSlots <= 0) {
      toast.error("You can upload up to 3 images.");
      event.currentTarget.value = "";
      return;
    }

    const filesToAdd = selected.slice(0, remainingSlots);
    const nextFiles = [...selectedFiles, ...filesToAdd];
    setSelectedFiles(nextFiles);
    setValue("images", nextFiles, {
      shouldValidate: true,
      shouldDirty: true,
    });
    event.currentTarget.value = "";

    if (selected.length > remainingSlots) {
      toast.error("You can upload up to 3 images.");
    }
  };

  const handleBoxSizeChange = (boxSizeId: string) => {
    setValue("boxSizeId", boxSizeId);
    const selectedBox = boxSizesList.find((box) => box.id === boxSizeId);
    if (selectedBox) {
      setDimensions({
        weight: selectedBox.weight?.toString() || "",
        length: selectedBox.length?.toString() || "",
        width: selectedBox.width?.toString() || "",
        height: selectedBox.height?.toString() || "",
      });
    }
  };

  const updateDimension = (field: keyof typeof dimensions, value: string) => {
    setDimensions((current) => ({ ...current, [field]: value }));
  };

  const previewItems = [
    ...existingImages.map((image, index) => ({
      id: image.id || image.url,
      kind: "url" as const,
      url: image.url,
      name: image.name || "Existing image",
      sourceIndex: index,
    })),
    ...selectedFiles.map((file, index) => ({
      id: `${file.name}-${index}`,
      kind: "file" as const,
      name: file.name,
      previewUrl: previewUrls[index],
      sourceIndex: index,
    })),
  ];

  if (!open) return null;

  async function onSubmit(data: EditProductFormValues) {
    if (!productId) return;

    if (existingImages.length + selectedFiles.length < 1) {
      toast.error("Please keep at least one product image.");
      return;
    }

    try {
      const nextStock = String(totalStock);
      setValue("stockQuantity", nextStock);

      const payload: Partial<ProductPayload> & { images: File[]; removedImageIds: string[] } = {
        ...data,
        price: data.price,
        stockQuantity: nextStock,
        logisticsCategoryId: data.logisticsCategoryId,
        boxSizeId: data.boxSizeId,
        weightKg: dimensions.weight || undefined,
        lengthCm: dimensions.length || undefined,
        widthCm: dimensions.width || undefined,
        heightCm: dimensions.height || undefined,
        images: selectedFiles,
        removedImageIds,
      };

      await updateProduct(productId, payload);

      for (const station of stations) {
        if (!station.stationId) continue;

        const stockValue = Number(station.stock) || 0;
        if (station.productPickupStationId) {
          await updateStationStock(station.productPickupStationId, stockValue);
        } else {
          await assignProductToStation(productId, station.stationId, stockValue);
        }
      }

      toast.success("Product updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["pickupStations"] });
      onUpdated?.();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 pt-10 pb-6 sm:pt-14 sm:pb-8" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="relative my-4 w-full max-w-5xl rounded-[32px] bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-100" aria-label="Close modal">
          <MdOutlineCancel size={22} />
        </button>
        <div className="mb-6 flex items-center justify-between pr-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Products</p>
            <h2 className="text-2xl font-semibold text-slate-900">Edit Product</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <section className="rounded-[28px] bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900">General Information</h3>
            </div>
            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600" htmlFor="edit-name">Product Name</label>
                <input id="edit-name" {...register("name")} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600" htmlFor="edit-description">Description</label>
                <textarea id="edit-description" {...register("description")} className="h-32 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10" />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900">Product Media</h3>
              <p className="mt-1 text-sm text-slate-500">Upload additional images or keep the existing ones.</p>
            </div>

            <div className="group relative rounded-[24px] border border-dashed border-slate-300 bg-white p-8 text-center transition hover:border-orange/80 hover:bg-slate-100" onClick={() => document.getElementById("edit-images")?.click()}>
              <FaCloudUploadAlt size={34} className="mx-auto text-orange transition group-hover:text-orange/90" />
              <p className="mt-6 text-sm font-semibold text-slate-900">Click to upload or drag & drop</p>
              <p className="mt-2 text-xs text-slate-500">Up to 3 images total.</p>
              <input id="edit-images" type="file" hidden accept="image/*" multiple onChange={handleImageSelection} />
            </div>

            {previewItems.length > 0 && (
              <ImagePreviewList
                items={previewItems}
                onRemoveFile={removePreviewItem}
              />
            )}
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-[28px] bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-slate-900">Pricing & Inventory</h3>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-600" htmlFor="edit-price">Price</label>
                  <input id="edit-price" type="text" {...register("price")} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10" />
                  {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-600" htmlFor="edit-stock">Stock Quantity</label>
                  <input id="edit-stock" type="text" {...register("stockQuantity")} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10" readOnly />
                  <p className="text-xs text-slate-500">Stock quantity is the sum of the pickup station inventory.</p>
                  {errors.stockQuantity && <p className="text-xs text-red-500">{errors.stockQuantity.message}</p>}
                </div>
              </div>
            </section>

            <section className="rounded-[28px] bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-slate-900">Logistics & Dimensions</h3>
              </div>
              <div className="mb-6">
                <label className="text-xs font-semibold text-slate-600" htmlFor="edit-boxSizeId">
                  Standard Box Size
                </label>
                <select
                  id="edit-boxSizeId"
                  value={watch("boxSizeId") || ""}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                  {...register("boxSizeId")}
                  onChange={(e) => {
                    const val = e.target.value;
                    setValue("boxSizeId", val);
                    handleBoxSizeChange(val);
                  }}
                >
                  <option value="">Custom Dimensions</option>
                  {isFetchingBoxSizes ? (
                    <option disabled>Loading box sizes...</option>
                  ) : (
                    boxSizesList.map((box) => (
                      <option key={box.id} value={box.id}>
                        {box.name} {box.maxWeight ? `(Max ${box.maxWeight}kg)` : ""}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-xs font-semibold text-slate-600">Box Reference Guide</p>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {boxSizesList.map((box) => (
                    <div
                      key={box.id}
                      onClick={() => {
                        setValue("boxSizeId", box.id);
                        handleBoxSizeChange(box.id);
                      }}
                      className={`flex-shrink-0 cursor-pointer rounded-2xl border-2 p-3 transition-all ${
                        watch("boxSizeId") === box.id
                          ? "border-orange bg-orange/5 ring-2 ring-orange/20"
                          : "border-slate-200 bg-white hover:border-orange/50"
                      }`}
                    >
                      <img
                        src={box.description_image_url || "https://via.placeholder.com/60?text=Box"}
                        alt={box.name}
                        className="h-12 w-12 object-contain"
                      />
                      <p className="mt-2 text-center text-[10px] font-medium text-slate-900">{box.name}</p>
                      <p className="text-center text-[9px] text-slate-500">Max {box.maxWeight}kg</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-600" htmlFor="edit-weight">Weight</label>
                  <input id="edit-weight" type="text" value={dimensions.weight} onChange={(e) => updateDimension("weight", e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10" placeholder="0.0 kg" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-600" htmlFor="edit-length">Length</label>
                  <input id="edit-length" type="text" value={dimensions.length} onChange={(e) => updateDimension("length", e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10" placeholder="0.0 cm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-600" htmlFor="edit-width">Width</label>
                  <input id="edit-width" type="text" value={dimensions.width} onChange={(e) => updateDimension("width", e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10" placeholder="0.0 cm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-600" htmlFor="edit-height">Height</label>
                  <input id="edit-height" type="text" value={dimensions.height} onChange={(e) => updateDimension("height", e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10" placeholder="0.0 cm" />
                </div>
                <div className="mt-4 w-full">
                  <label className="text-xs font-semibold text-slate-600" htmlFor="logisticsCategoryId">Shipping fee profile (internal)</label>
                  <p className="mt-1 text-xs text-slate-500">Used for logistics and shipping-fee calculations only. Your main product category remains for display.</p>
                  <select id="logisticsCategoryId" {...register("logisticsCategoryId")} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10">
                    <option value="">Select a shipping category</option>
                    {isFetchingLogisticsCategories ? (
                      <option disabled>Loading categories...</option>
                    ) : (
                      logisticsCategoryList.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)
                    )}
                  </select>
                  {errors.logisticsCategoryId && <p className="text-xs text-red-500">{errors.logisticsCategoryId.message}</p>}
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-[28px] bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900">Organization</h3>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600" htmlFor="edit-category">Category</label>
                <select id="edit-category" {...register("categoryId")} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10">
                  <option value="">Select category</option>
                {isFetchingCategories ? <option disabled>Loading categories...</option> : categoriesList.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600" htmlFor="edit-subcategory">Subcategory</label>
                <select id="edit-subcategory" {...register("subCategoryId")} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10">
                  <option value="">Select subcategory</option>
                  {isFetchingSubCategories ? <option disabled>Loading subcategories...</option> : subcategoriesList.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                {errors.subCategoryId && <p className="text-xs text-red-500">{errors.subCategoryId.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600" htmlFor="edit-brand">Brand</label>
                <select id="edit-brand" {...register("brandId")} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10">
                  <option value="">Select brand</option>
                  {isFetchingBrand ? <option disabled>Loading brands...</option> : brandsList.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                {errors.brandId && <p className="text-xs text-red-500">{errors.brandId.message}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Pickup Stations</h3>
                <p className="mt-1 text-sm text-slate-500">Manage station inventory from the edit form.</p>
              </div>
              <button type="button" onClick={() => setShowStationForm(true)} className="rounded-full border border-orange/20 bg-orange/10 px-3 py-2 text-sm font-semibold text-orange transition hover:bg-orange/20">
                + Create new pickup station
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium">Total stock</p>
              <p className="text-xs text-slate-500">(Sum of all pickup inventory count)</p>
              <div className="mt-2 text-lg font-semibold">{totalStock}</div>
            </div>

            {stations.map((station, index) => (
              <div key={`${station.stationId || "new"}-${index}`} className="mb-3 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Pickup Station #{index + 1}</p>
                  <button type="button" onClick={() => setStations((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-sm text-red-500">
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-600">Pickup Station</label>
                    <select value={station.stationId || ""} onChange={(e) => setStations((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, stationId: e.target.value } : item))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10">
                      <option value="">Select a pickup station</option>
                      {isFetchingStations ? <option disabled>Loading stations...</option> : pickupStations.map((item) => <option key={item.id} value={item.id}>{item.name} — {item.address}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-600">Station Stock</label>
                    <input type="number" min={0} value={station.stock} onChange={(e) => setStations((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, stock: e.target.value } : item))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10" placeholder="0" />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" onClick={() => setStations((current) => [...current, { stationId: "", stock: "0" }])} className="rounded-full border border-orange/20 bg-orange/10 px-3 py-2 text-sm font-semibold text-orange transition hover:bg-orange/20">
              + Add Station Row
            </button>
          </section>

          {showStationForm && (
            <PickupStationForm
              open={showStationForm}
              onClose={() => setShowStationForm(false)}
              onSaved={() => {
                setShowStationForm(false);
                queryClient.invalidateQueries({ queryKey: ["pickupStations"] });
              }}
            />
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="rounded-xl bg-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange/90 disabled:cursor-not-allowed disabled:bg-orange/70">
              {isSubmitting ? <Spinner type="small" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
