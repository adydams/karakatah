import { useQuery } from "@tanstack/react-query";
import StoreCard from "../../components/adminDashboard/StoreCard";
import { getStores } from "../../services/adminDashboard/apiStore";
import Spinner from "../../components/Spinner";
import { TiPlus } from "react-icons/ti";
import { Link } from "react-router";

export default function Store() {
  const { data: stores, isLoading: isFetchingStore } = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
  });

  if (isFetchingStore) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner type="big" />
      </div>
    );
  }

  if (!stores || !stores.data) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-10 text-center">
        <h3 className="text-lg font-semibold text-dark-gray">Something occurred</h3>
        <p className="text-sm text-dark-gray/60">We couldn't load the stores. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-10 flex w-full items-center justify-between">
        <h1 className="text-lg font-bold sm:text-base md:text-lg lg:text-2xl">
          Stores
        </h1>
        <Link
          to={`/dashboard/stores/add`}
          className="bg-orange flex h-10 w-10 cursor-pointer items-center justify-center rounded-full font-bold text-white"
        >
          <TiPlus />
        </Link>
      </div>
      <div className="relative grid w-full grid-cols-3 gap-7 md:grid-cols-5">
        {stores.data.map((store: { name: string; id: string }) => (
          <StoreCard name={store.name} id={store.id} key={store.id} />
        ))}
      </div>
    </div>
  );
}
