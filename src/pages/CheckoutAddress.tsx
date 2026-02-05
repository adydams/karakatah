import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createShippingAddress,
  getShippingAddress,
} from "../services/apiShipping";
import Spinner from "../components/Spinner";

import { CiBookmarkPlus } from "react-icons/ci";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  shippingAddressSchema,
  type ShippingAddressFormValues,
} from "../types/formSchema";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function CheckoutAddress() {
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const queryClient = useQueryClient();

  const navigate = useNavigate()

  function handleIsAddingAddress() {
    setIsAddingAddress((edit) => !edit);
  }

  const { data: shippingAddress, isLoading: IsFetchingAddress } = useQuery({
    queryKey: ["shippingAddress"],
    queryFn: getShippingAddress,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddressFormValues>({
    resolver: zodResolver(shippingAddressSchema),
  });

  async function onSubmit(data: ShippingAddressFormValues) {
    try {
      const success = await createShippingAddress(data);

      if (success) {
        toast.success("Category Added Successfully");

        // 🔥 Force refetch of products list
        await queryClient.invalidateQueries({ queryKey: ["shippingAddress"] });

        // Reset field
        reset();
        handleIsAddingAddress();
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
    <main className="flex w-full items-start justify-center pt-10 pb-20 md:pb-64">
      <div className="auto grid w-[92%] grid-cols-1 gap-5 lg:w-[85%] lg:grid-cols-[2fr_1fr]">
        <form className="flex w-full flex-col items-start justify-start rounded-lg bg-white px-3 pt-5 transition-all duration-700">
          <h1 className="w-full text-base font-medium text-gray-700">
            ADDRESS BOOK
          </h1>

          {IsFetchingAddress ? (
            <div className="flex h-fit w-full items-center justify-center">
              <Spinner size="big" />
            </div>
          ) : shippingAddress.addresses.length === 0 ? (
            <div className="border-orange/40 mt-7 w-full border-2 border-dashed bg-gray-100 px-10 py-5 text-center text-xs font-medium tracking-widest text-gray-500">
              <p>DEFAULT ADDRESS NOT AVAILABLE</p>
            </div>
          ) : (
            shippingAddress.addresses.map(
              (address: {
                id: string;
                line1: string;
                line2: string;
                city: string;
                state: string;
                country: string;
              }) => (
                <label key={address.id} className="my-3 w-full cursor-pointer">
                  {/* Radio (peer) */}
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    className="peer hidden"
                  />

                  {/* Card */}
                  <div className="w-full border-2 border-dashed border-gray-300 bg-gray-100 px-10 py-3 text-xs font-medium tracking-widest text-gray-500 transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-gray-700">
                    <p>
                      {address.line1} {address.line2} {address.city}. <br />
                      {address.state}, {address.country}
                    </p>
                  </div>
                </label>
              ),
            )
          )}

          <button
            className="text-orange font-primary my-5 flex cursor-pointer items-center justify-start gap-0.5 text-sm font-medium transition-all duration-1000 hover:gap-1.5 disabled:cursor-not-allowed disabled:text-gray-500 md:mt-auto"
            onClick={handleIsAddingAddress}
            disabled={isAddingAddress}
          >
            <CiBookmarkPlus size={18} />
            Add Address
          </button>

          <div className="font-primary text-orange mt-auto flex w-full items-center justify-end gap-3 border-t border-dotted border-gray-400 py-7 text-sm font-semibold">
            <p onClick={() => navigate("/checkout")} className="cursor-pointer">Cancel</p>
            <button
              type="submit"
              className="bg-orange hover:bg-orange/80 cursor-pointer rounded-lg px-6 py-4 text-white"
            >
              Select address
            </button>
          </div>
        </form>

        {/* Form to fill new address */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative flex h-full w-full flex-col items-start justify-start overflow-hidden rounded-lg bg-white px-3 py-5 transition-all duration-700"
        >
          <div
            className={`${isAddingAddress ? "mr-[-500px]" : "mr-0"} absolute top-0 right-0 h-full w-full transition-all duration-1000`}
          >
            <img className="h-full w-full object-cover" src="/bgg.jpg" alt="" />
          </div>

          <h1 className="w-full text-base font-medium text-gray-700">
            ADD AN ADDRESS
          </h1>

          <div className="font-primary mt-3 flex w-full flex-col items-start justify-center gap-1.5 text-sm">
            <label
              className="text-xs font-medium tracking-wider"
              htmlFor="line1"
            >
              Street
            </label>
            <input
              className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 focus:outline-0"
              type="text"
              id="line1"
              {...register("line1")}
            />
            {errors.line1 && (
              <p className="text-xs text-red-500">{`${errors.line1.message}`}</p>
            )}
          </div>
          <div className="font-primary mt-3 flex w-full flex-col items-start justify-center gap-1.5 text-sm">
            <label
              className="text-xs font-medium tracking-wider"
              htmlFor="line2"
            >
              Bus-Stop
            </label>
            <input
              className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 focus:outline-0"
              type="text"
              id="line2"
              {...register("line2")}
            />
            {errors.line2 && (
              <p className="text-xs text-red-500">{`${errors.line2.message}`}</p>
            )}
          </div>

          {/* City and State */}
          <div className="grid w-full grid-cols-2 gap-3">
            <div className="font-primary mt-3 flex w-full flex-col items-start justify-center gap-1.5 text-sm">
              <label
                className="text-xs font-medium tracking-wider"
                htmlFor="city"
              >
                City
              </label>
              <input
                className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 focus:outline-0"
                type="text"
                id="city"
                {...register("city")}
              />
              {errors.city && (
                <p className="text-xs text-red-500">{`${errors.city.message}`}</p>
              )}
            </div>
            <div className="font-primary mt-3 flex w-full flex-col items-start justify-center gap-1.5 text-sm">
              <label
                className="text-xs font-medium tracking-wider"
                htmlFor="state"
              >
                State
              </label>
              <input
                className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 focus:outline-0"
                type="text"
                id="state"
                {...register("state")}
              />
              {errors.state && (
                <p className="text-xs text-red-500">{`${errors.state.message}`}</p>
              )}
            </div>
          </div>

          {/* Country and Postal Code */}
          <div className="grid w-full grid-cols-2 gap-3">
            <div className="font-primary mt-3 flex w-full flex-col items-start justify-center gap-1.5 text-sm">
              <label
                className="text-xs font-medium tracking-wider"
                htmlFor="country"
              >
                Country
              </label>
              <input
                className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 focus:outline-0"
                type="text"
                id="country"
                {...register("country")}
              />
              {errors.country && (
                <p className="text-xs text-red-500">{`${errors.country.message}`}</p>
              )}
            </div>
            <div className="font-primary mt-3 flex w-full flex-col items-start justify-center gap-1.5 text-sm">
              <label
                className="text-xs font-medium tracking-wider"
                htmlFor="postalCode"
              >
                Postal Code
              </label>
              <input
                className="w-full rounded-lg border border-gray-400/80 px-2 py-3 text-gray-700 focus:outline-0"
                type="text"
                id="postalCode"
                {...register("postalCode")}
              />
              {errors.postalCode && (
                <p className="text-xs text-red-500">{`${errors.postalCode.message}`}</p>
              )}
            </div>
          </div>

          <div className="mt-10 grid w-full grid-cols-2 gap-3 border-t border-dotted border-gray-400 pt-5">
            <button
              type="reset"
              onClick={handleIsAddingAddress}
              className="cursor-pointer border border-gray-400/80 px-6 py-3 text-sm transition-all duration-500 hover:bg-gray-400/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange hover:bg-orange/80 cursor-pointer rounded-lg px-6 py-3 font-semibold tracking-wider text-white"
            >
              {isSubmitting ? <Spinner size="small" /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
