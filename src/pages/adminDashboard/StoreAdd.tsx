import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { createStore } from "../../services/adminDashboard/apiStore";
import { useQueryClient } from "@tanstack/react-query";
import { FaUser, FaStore } from "react-icons/fa";

export default function StoreAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      navigate("/dashboard/stores");
    },
  });

  const onSubmit = (data: any) => {
    // Construct payload to match backend Store model
    const payload = {
      name: data.storeName,
      description: data.description,
      address: data.address,
      phone: data.phone,
      email: data.email,
      // Owner details are usually separate or linked via user creation
      // For this demo, we'll send them as part of the request or assume SuperAdmin handles it
      ownerUserId: data.ownerId,
    };
    mutation.mutate(payload);
  };

  return (
    <div className="flex h-full w-full flex-col items-center p-6 bg-[#fbf8ff]">
      <div className="flex w-full max-w-4xl items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Onboard New Store</h2>
          <p className="text-sm text-gray-500">Fill in the details to register a new store on the marketplace.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-all">
            Save as Draft
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
            className="px-4 py-2 text-xs font-semibold text-white bg-orange rounded-md hover:bg-orange/90 transition-all disabled:opacity-50"
          >
            {mutation.isPending ? "Creating..." : "Create Store"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl space-y-6">
        {/* Store Information Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <FaStore className="text-orange" size={18} />
            <h3 className="font-bold text-gray-700">Store Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Store Name</label>
              <input
                {...register("storeName", { required: "Store name is required" })}
                placeholder="e.g. Premium Electronics Hub"
                className="px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-orange/50"
              />
              {errors.storeName && <p className="text-[10px] text-red-500">{errors.storeName.message as string}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Category</label>
              <select
                {...register("category")}
                className="px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-orange/50"
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home & Garden</option>
                <option value="beauty">Beauty & Health</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-600">Description</label>
              <textarea
                {...register("description")}
                placeholder="Briefly describe what the store sells..."
                className="px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-orange/50 h-20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Full Business Address</label>
              <input
                {...register("address")}
                placeholder="123 Business Ave, Lagos"
                className="px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-orange/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Store Logo</label>
              <div className="flex items-center justify-center w-full h-10 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-orange transition-colors">
                <span className="text-xs text-gray-400">Click to upload logo</span>
                <input type="file" className="hidden" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Phone Number</label>
              <input
                {...register("phone")}
                placeholder="+234..."
                className="px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-orange/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Email Address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="store@email.com"
                className="px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-orange/50"
              />
            </div>
          </div>
        </div>

        {/* Owner Details Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <FaUser className="text-orange" size={18} />
            <h3 className="font-bold text-gray-700">Owner Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Vendor's Legal Name</label>
              <input
                {...register("legalName")}
                placeholder="John Doe"
                className="px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-orange/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Email Address</label>
              <input
                {...register("ownerEmail")}
                type="email"
                placeholder="owner@email.com"
                className="px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-orange/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Phone Number</label>
              <input
                {...register("ownerPhone")}
                placeholder="+234..."
                className="px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-orange/50"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
