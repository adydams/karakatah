import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { getStoreDetail } from "../../services/adminDashboard/apiStore";
import Spinner from "../../components/Spinner";

export default function StoreDetails() {
  const params = useParams();
  console.log(params);

  const storeId = params.storeId;

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

  if (!store) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <img src="/store.png" className="w-60" />
        <h3 className="text-lg font-semibold underline underline-offset-8 sm:text-base md:text-lg lg:text-2xl">
          This store might not exist
        </h3>
      </div>
    );
  }

  return (
    <div className="dash flex h-full w-full flex-col items-center justify-center p-5">
      <img src="/store.png" className="w-60" />

      <div className="w-full font-medium">
        <h4 className="text-orange mb-1 text-center text-3xl font-semibold">
          {store.data.name}
        </h4>
        <p className="mb-3 text-center">{store.data.description}</p>
        <h4 className="mb-2 flex w-full flex-col items-center justify-between pl-2 md:flex-row md:shadow">
          Email:{" "}
          <span className="w-full bg-white p-2 text-center text-sm font-bold tracking-wide md:w-[70%]">
            {store.data.email}
          </span>
        </h4>
        <h4 className="mb-2 flex w-full flex-col items-center justify-between pl-2 md:flex-row md:shadow">
          Address:{" "}
          <span className="w-full bg-white p-2 text-center text-sm font-bold tracking-wide md:w-[70%]">
            {store.data.address}
          </span>
        </h4>
        <h4 className="mb-2 flex w-full flex-col items-center justify-between pl-2 md:flex-row md:shadow">
          Phone No:{" "}
          <span className="w-full bg-white p-2 text-center text-sm font-bold tracking-wide md:w-[70%]">
            {store.data.phone}
          </span>
        </h4>
        <h4 className="mb-2 flex w-full flex-col items-center justify-between pl-2 md:flex-row md:shadow">
          email:{" "}
          <span className="w-full bg-white p-2 text-center text-sm font-bold tracking-wide md:w-[70%]">
            {store.data.email}
          </span>
        </h4>
      </div>

      <div className="gap mt-4 grid w-full grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-5">
        <Link
          to={`/dashboard/stores/edit/${storeId}`}
          className="bg-dark-gray/30 text-center border-dark-gray/40 text-shadow-charcoal-gray w-full cursor-pointer rounded-xl border-2 px-5 py-2 font-semibold"
        >
          Edit
        </Link>
        <button className="w-full cursor-pointer rounded-xl bg-red-500 px-5 py-2 font-semibold text-white">
          Delete
        </button>
      </div>
    </div>
  );
}
