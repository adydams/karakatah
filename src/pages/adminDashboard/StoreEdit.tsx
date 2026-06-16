import { useParams } from "react-router";
import { getStoreDetail } from "../../services/adminDashboard/apiStore";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";

export default function StoreEdit() {
  const params = useParams();
  console.log(params);

  const storeId = params.storeId;
  console.log(storeId);

    const { data: store, isLoading } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStoreDetail(storeId),
  });
  console.log(store);

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        {/* <img src="/store.png" className="w-60" /> */}
        <Spinner size="big" />
        {/* loading... */}
      </div>
    );
  }

  return (
    <form className="flex h-full w-full flex-col items-center justify-center p-5">
      <h2 className="mb-5 text-lg font-bold sm:text-base md:text-lg lg:text-xl">
        {store?.data?.name}
      </h2>
      <div className="flex w-full flex-col items-start justify-start gap-3">
        <div className="flex w-full flex-col items-start justify-start gap-1.5">
          <label className="text-xs font-semibold" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            placeholder={store.data.name}
            id="name"
            className="border-dark-gray/40 focus:border-orange/20 focus:text-orange w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
            // {...register("name")}
          />
          {/* {errors.name && (
              <p className="text-xs text-red-500">{`${errors.name.message}`}</p>
            )} */}
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-1.5">
          <label className="text-xs font-semibold" htmlFor="price">
            Address
          </label>
          <input
            type="text"
            placeholder={store.data.address}
            id="address"
            className="border-dark-gray/40 focus:border-orange/20 focus:text-orange w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
            // {...register("address")}
          />
          {/* {errors.address && (
              <p className="text-xs text-red-500">{`${errors.price.message}`}</p>
            )} */}
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-1.5">
          <label className="text-xs font-semibold" htmlFor="price">
            Phone number
          </label>
          <input
            type="text"
            placeholder={store.data.phone}
            id="phone"
            className="border-dark-gray/40 focus:border-orange/20 focus:text-orange w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
            // {...register("phone")}
          />
          {/* {errors.phone && (
              <p className="text-xs text-red-500">{`${errors.price.message}`}</p>
            )} */}
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-1.5">
          <label className="text-xs font-semibold" htmlFor="price">
            Address
          </label>
          <input
            type="text"
            placeholder={store.data.address}
            id="address"
            className="border-dark-gray/40 focus:border-orange/20 focus:text-orange w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
            // {...register("address")}
          />
          {/* {errors.price && (
              <p className="text-xs text-red-500">{`${errors.price.message}`}</p>
            )} */}
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-1.5">
          <label className="text-xs font-semibold" htmlFor="price">
            Email
          </label>
          <input
            type="email"
            placeholder={store.data.email}
            id="email"
            className="border-dark-gray/40 focus:border-orange/20 focus:text-orange w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
            // {...register("email")}
          />
          {/* {errors.email && (
              <p className="text-xs text-red-500">{`${errors.price.message}`}</p>
            )} */}
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-1.5">
          <label className="text-xs font-semibold" htmlFor="price">
            Description
          </label>
          <textarea
            placeholder={store.data.description}
            id="description"
            className="border-dark-gray/40 h-20 focus:border-orange/20 focus:text-orange w-full rounded-sm border px-3 py-2 text-xs focus:outline-0"
            // {...register("description")}
          ></textarea>
          {/* {errors.description && (
              <p className="text-xs text-red-500">{`${errors.price.message}`}</p>
            )} */}
        </div>

         <button
                className="bg-muted-green hover:bg-muted-green/90 disabled:bg-orange/70 h-[40px] w-full cursor-pointer  rounded-md text-xs font-semibold text-white transition-all duration-100 disabled:cursor-not-allowed"
                // disabled={isSubmitting}
              >
                {/* {isSubmitting ? <Spinner type="small" /> : "Add a Product"} */}
                Edit
              </button>
      </div>
       
    </form>
  );
}
