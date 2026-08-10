import { useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "./Spinner";
import { useEffect, useState, type ChangeEvent, type MouseEvent } from "react";
import { normalizeListData } from "../../utils/utils";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { productSchema, type TProductSchema } from "../../libs/formSchema";
import {
  createProduct,
  getBrands,
  getCategories,
  getSubCategories,
} from "../../services/adminDashboard/apiProducts";
import {
  getPickupStations,
  assignProductToStation,
} from "../../services/adminDashboard/apiPickupStation";
import PickupStationForm from "./PickupStationForm";
import ImagePreviewList from "./ImagePreviewList";

type AddProductProp = {
  handleShowProduct: () => void;
  showProduct: boolean;
};

export default function AddProduct({
  handleShowProduct,
  showProduct,
}: AddProductProp) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(true);
  const [dimensions, setDimensions] = useState({
    weight: "",
    length: "",
    width: "",
    height: "",
  });

  // Stations assigned to this product in the form. Each entry has stationId and stock
  const [stations, setStations] = useState<Array<{ stationId?: string; stock: string }>>([]);
  const [showStationForm, setShowStationForm] = useState(false);

  // computed total stock is the sum of all station stocks
  const totalStock = stations.reduce((acc, s) => acc + (Number(s.stock) || 0), 0);

  const queryClient = useQueryClient();

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleShowProduct();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleShowProduct]);

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

  const { data: pickupStationResponse, isLoading: isFetchingStations } = useQuery({
    queryKey: ["pickupStations"],
    queryFn: getPickupStations,
  });
  const pickupStations = normalizeListData<any>(pickupStationResponse);
  const categoriesList = normalizeListData<{ id: string; name: string }>(categories);
  const subcategoriesList = normalizeListData<{ id: string; name: string }>(subcategories);
  const brandsList = normalizeListData<{ id: string; name: string }>(brands);

  const handleAddTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    setTags((current) => (current.includes(value) ? current : [...current, value]));
    setTagInput("");
  };

  const removeImage = (index: number, _kind: "file" | "url") => {
    setFiles((current) => {
      const nextFiles = current.filter((_, itemIndex) => itemIndex !== index);
      setValue("images", nextFiles, {
        shouldValidate: true,
        shouldDirty: true,
      });
      return nextFiles;
    });
  };

  const removeTag = (tag: string) => {
    setTags((current) => current.filter((item) => item !== tag));
  };

  const updateDimension = (field: keyof typeof dimensions, value: string) => {
    setDimensions((current) => ({ ...current, [field]: value }));
  };

  async function onSubmit(data: TProductSchema, draftMode = false) {
    console.log("AddProduct form submit", data);
    const {
      name,
      description,
      price,
      categoryId,
      subCategoryId,
      brandId,
      images,
    } = data;

    try {
      // ensure stockQuantity reflects station totals for validation and backend expectations
      setValue("stockQuantity", String(totalStock));

      const createdProduct = await createProduct({
        name,
        description,
        price,
        stockQuantity: String(totalStock),
        categoryId,
        subCategoryId,
        brandId,
        weightKg: dimensions.weight || undefined,
        lengthCm: dimensions.length || undefined,
        widthCm: dimensions.width || undefined,
        heightCm: dimensions.height || undefined,
        images,
        isPublished: !draftMode,
        draft: draftMode,
      });

      const productId = createdProduct?.data?.id || createdProduct?.id || createdProduct?._id;

      if (productId && stations.length > 0) {
        let assignErrors = 0;
        for (const s of stations) {
          if (!s.stationId) continue; // skip empty rows
          try {
            await assignProductToStation(productId, s.stationId, Number(s.stock) || 0);
          } catch (assignError: unknown) {
            console.error('Failed to assign station', s, assignError);
            assignErrors++;
          }
        }

        if (assignErrors === 0) {
          toast.success(draftMode ? "Draft saved and pickup stations updated" : "Product and pickup stations saved successfully");
        } else {
          toast.success(draftMode ? "Draft saved; some stations failed to assign" : "Product saved; some stations failed to assign");
        }
      } else {
        toast.success(draftMode ? "Draft saved successfully" : "Product added successfully");
      }

      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["pickupStations"] });
      handleShowProduct();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast("An unexpected error occurred");
      }
    }
  }

  const onSubmitSaveProduct = handleSubmit((data) => onSubmit(data, false), (errors) => {
    console.warn("Product form validation errors:", errors);
    toast.error("Please complete all required product fields before saving.");
  });

  const onSubmitDraft = handleSubmit((data) => onSubmit(data, true), (errors) => {
    console.warn("Draft form validation errors:", errors);
    toast.error("Please complete all required product fields before saving as a draft.");
  });

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) handleShowProduct();
  };

  if (!showProduct) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-16 sm:py-20"
      onClick={handleBackdropClick}
    >
      <div
        className="relative mx-auto mt-6 w-full max-w-6xl rounded-[32px] bg-slate-50 p-6 shadow-xl ring-1 ring-slate-200 sm:mt-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 "> 
          <MdOutlineCancel
          onClick={handleShowProduct}
          size={28}
          className="text-orange/70 hover:text-orange absolute top-6 right-6 cursor-pointer transition-all duration-300"
        /> 
        </div>
        {/* <buttonadydamsGIG
        commented
        1 hour ago
        Added Ingress.yaml file to fix
        image
        
        adydams added 7 commits 2 weeks ago
        @adydams
        cleaned the time for the cron job
        201a42b
        @adydams
        just commit
        be163e0
        @adydams
        Merge branch 'develop' of https://github.com/giglogistics/GIGL.Blackbook 
        eb8e112
        @adydams
        fixed duplicate cron job entries
        6092f25
        @adydams
        added yaml files
        0fd0490
        @adydams
        Merge branch 'develop' of https://github.com/giglogistics/GIGL.Blackbook 
        67eea33
        @adydams
        added ingress.yaml file
        343bd86
        @adydamsGIG
        adydamsGIG requested a review from gigl-devops as a code owner 1 hour ago
        sundayoladejo
        sundayoladejo reviewed 1 hour ago
        GIGL.Blackbook.Api/k8s/prod/ingress.yaml
            #cert-manager.io/cluster-issuer: "letsencrypt-prod"  
            #kubernetes.io/tls-acme: "true"
        
        spec:
        @sundayoladejo
        sundayoladejo
        1 hour ago
        adding this on develop. are you sure?
        
        @adydamsGIG
        adydamsGIG
        1 hour ago
        Author
        That was the recommended solution by devops, then the devlop branch will be deployed to production
        
        @adydamsGIG	Reply...
        sundayoladejo
        sundayoladejo approved these changes 1 hour ago
        @adydamsGIG
        Merge branch 'develop' into Damilola/add-prod-k8-ingress
        1472736
        This branch has not been deployed
        No deployments
        Merge info
        Changes approved
        1 approving review by reviewers with write access.
        
        
        Some checks haven't completed yet
        1 expected, 1 successful checks
        
        
        pending checks
        protected-paths
        protected-pathsExpected — Waiting for status to be reported
        Required
        successful checks
        PR Checks (Sonar · Build · Security) / sonarqube-scan (pull_request)
        PR Checks (Sonar · Build · Security) / sonarqube-scan (pull_request)Successful in 54s
        Merging is blocked
        All comments must be resolved.
        You can also merge this with the command line. 
        
            type="button"
            onClick={handleShowProduct}
            aria-label="Close"
            className="absolute right-4 top-4 z-50 rounded-full p-3 text-orange/70 transition-all duration-300 hover:bg-orange/10 hover:text-orange"
          >
            <MdOutlineCancel size={28} />
        </button> */}

      <form onSubmit={onSubmitSaveProduct} className="space-y-6" onClick={(event) => event.stopPropagation()}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Products</p>
            <h2 className="text-2xl font-semibold text-slate-900">Create New Product</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleShowProduct}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={onSubmitDraft}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {isSubmitting ? <Spinner type="small" /> : "Save Draft"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange/90 disabled:cursor-not-allowed disabled:bg-orange/70"
            >
              {isSubmitting ? <Spinner type="small" /> : "Save Product"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">General Information</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Fill in the details below to add a new item to your catalog.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-600" htmlFor="name">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Premium Chic Double Door"
                    id="name"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                    {...register("name")}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
              </div>

              <div className="mt-5">
                <label className="text-xs font-semibold text-slate-600" htmlFor="description">
                  Description
                </label>
                <textarea
                  placeholder="Describe the product's features, material, and unique selling points."
                  id="description"
                  className="mt-2 h-32 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                  {...register("description")}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
              </div>
            </section>

            <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-slate-900">Product Media</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Upload product images to give customers a preview of this listing.
                </p>
              </div>

              <div
                className="group relative rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-orange/80 hover:bg-slate-100"
                onClick={() => document.getElementById("images")?.click()}
              >
                <FaCloudUploadAlt size={34} className="mx-auto text-orange transition group-hover:text-orange/90" />
                <p className="mt-6 text-sm font-semibold text-slate-900">Click to upload or drag & drop</p>
                <p className="mt-2 text-xs text-slate-500">1600 x 1200 (4:3) recommended. PNG, JPG or GIF. Up to 3 images.</p>

                <input
                  type="file"
                  hidden
                  id="images"
                  accept="image/*"
                  multiple
                  {...register("images")}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const selectedFiles = Array.from(e.target.files || []);
                    if (selectedFiles.length === 0) return;

                    const remainingSlots = 3 - files.length;
                    if (remainingSlots <= 0) {
                      toast.error("You can upload up to 3 images.");
                      return;
                    }

                    const filesToAdd = selectedFiles.slice(0, remainingSlots);
                    const nextFiles = [...files, ...filesToAdd].slice(0, 3);
                    setFiles(nextFiles);
                    setValue("images", nextFiles, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    e.currentTarget.value = "";

                    if (selectedFiles.length > remainingSlots) {
                      toast.error("You can upload up to 3 images.");
                    }
                  }}
                />
              </div>

              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => document.getElementById("images")?.click()}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Add images
                </button>
              </div>

              {files.length > 0 && (
                <ImagePreviewList
                  items={files.map((file, index) => ({
                    id: `${file.name}-${index}`,
                    kind: "file",
                    name: file.name,
                    previewUrl: previewUrls[index],
                  }))}
                  onRemoveFile={removeImage}
                />
              )}
              {errors.images && <p className="mt-3 text-xs text-red-500">{errors.images.message}</p>}
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-slate-900">Pricing & Inventory</h3>
                  <p className="mt-1 text-sm text-slate-500">Set the product price and available stock.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-600" htmlFor="price">
                      Price
                    </label>
                    <input
                      type="text"
                      placeholder="0.00"
                      id="price"
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                      {...register("price")}
                    />
                    {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-600" htmlFor="stockQuantity">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      id="stockQuantity"
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                      {...register("stockQuantity")}
                    />
                    {errors.stockQuantity && <p className="text-xs text-red-500">{errors.stockQuantity.message}</p>}
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-slate-900">Logistics & Dimensions</h3>
                  <p className="mt-1 text-sm text-slate-500">Capture the product's size and shipping dimensions.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-600" htmlFor="weight">
                      Weight
                    </label>
                    <input
                      type="text"
                      id="weight"
                      value={dimensions.weight}
                      onChange={(e) => updateDimension("weight", e.target.value)}
                      placeholder="0.0 kg"
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-600" htmlFor="length">
                      Length
                    </label>
                    <input
                      type="text"
                      id="length"
                      value={dimensions.length}
                      onChange={(e) => updateDimension("length", e.target.value)}
                      placeholder="0.0 cm"
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-600" htmlFor="width">
                      Width
                    </label>
                    <input
                      type="text"
                      id="width"
                      value={dimensions.width}
                      onChange={(e) => updateDimension("width", e.target.value)}
                      placeholder="0.0 cm"
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-600" htmlFor="height">
                      Height
                    </label>
                    <input
                      type="text"
                      id="height"
                      value={dimensions.height}
                      onChange={(e) => updateDimension("height", e.target.value)}
                      placeholder="0.0 cm"
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                    />
                  </div>
                </div>
              </section>
            </div>

            <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Pickup Stations</h3>
                  <p className="mt-1 text-sm text-slate-500">Add station inventory once the product is saved.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStationForm(true)}
                  className="rounded-full border border-orange/20 bg-orange/10 px-3 py-2 text-sm font-semibold text-orange transition hover:bg-orange/20"
                >
                  + Add Station
                </button>
              </div>

              <div className="grid gap-4">
                <div className="mb-4">
                  <p className="text-sm font-medium">Total stock</p>
                  <p className="text-xs text-slate-500">(Sum of all pickup inventory count)</p>
                  <div className="mt-2 text-lg font-semibold">{totalStock}</div>
                </div>

                {stations.map((s, idx) => (
                  <div key={idx} className="grid gap-3 rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Pickup Station #{idx + 1}</p>
                      <button
                        type="button"
                        onClick={() => setStations((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-600">Pickup Station</label>
                        <select
                          value={s.stationId || ''}
                          onChange={(e) => setStations((prev) => prev.map((p, i) => i === idx ? { ...p, stationId: e.target.value } : p))}
                          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                        >
                          <option value="">Select a pickup station</option>
                          {isFetchingStations ? (
                            <option disabled>Loading stations...</option>
                          ) : (
                            pickupStations.map((station: any) => (
                              <option key={station.id} value={station.id}>
                                {station.name} — {station.address}
                              </option>
                            ))
                          )}
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-600">Station Stock</label>
                        <input
                          type="number"
                          min={0}
                          value={s.stock}
                          onChange={(e) => setStations((prev) => prev.map((p, i) => i === idx ? { ...p, stock: e.target.value } : p))}
                          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStations((prev) => [...prev, { stationId: '', stock: '0' }])}
                    className="rounded-full border border-orange/20 bg-orange/10 px-3 py-2 text-sm font-semibold text-orange transition hover:bg-orange/20"
                  >
                    + Add Station Row
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowStationForm(true)}
                    className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    + Create new pickup station
                  </button>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">Assign stations above or create a new one to be able to assign it.</p>
                </div>
              </div>
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
          </div>

          <aside className="space-y-6">
            <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-slate-900">Organization</h3>
                <p className="mt-1 text-sm text-slate-500">Align this product with the right category and brand.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-600" htmlFor="categoryIdSide">
                    Category
                  </label>
                  <select
                    id="categoryIdSide"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                    {...register("categoryId")}
                  >
                    <option value="">Select Category</option>
                    {isFetchingCategories ? (
                      <option disabled>Loading categories...</option>
                    ) : (
                      categoriesList.map((item: { id: string; name: string }) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-600" htmlFor="brandIdSide">
                    Brand
                  </label>
                  <select
                    id="brandIdSide"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                    {...register("brandId")}
                  >
                    <option value="">Select Brand</option>
                    {isFetchingBrand ? (
                      <option disabled>Loading brands...</option>
                    ) : (
                      brandsList.map((item: { id: string; name: string }) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.brandId && <p className="text-xs text-red-500">{errors.brandId.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-600" htmlFor="subCategoryIdSide">
                    Sub Category
                  </label>
                  <select
                    id="subCategoryIdSide"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                    {...register("subCategoryId")}
                  >
                    <option value="">Select Sub Category</option>
                    {isFetchingSubCategories ? (
                      <option disabled>Loading subcategories...</option>
                    ) : (
                      subcategoriesList.map((item: { id: string; name: string }) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.subCategoryId && <p className="text-xs text-red-500">{errors.subCategoryId.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-600" htmlFor="tags">
                    Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add tags"
                      className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange/70 focus:ring-2 focus:ring-orange/10"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="rounded-2xl bg-orange px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange/90"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-700">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-slate-600">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Publish immediately</p>
                      <p className="mt-1 text-xs text-slate-500">Make this product available in the catalog once saved.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPublished((value) => !value)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isPublished ? "bg-orange text-white" : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      {isPublished ? "Published" : "Draft"}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </form>
      </div>
    </div>
  );
}
