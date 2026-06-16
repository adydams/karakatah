import { useQuery } from "@tanstack/react-query";
import StoreCard from "../../components/adminDashboard/StoreCard";
import { getStores } from "../../services/adminDashboard/apiStore";
import Spinner from "../../components/adminDashboard/Spinner";
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

  if (!stores) {
    return (
      <div className="w-full">
        <p>Something occurred</p>
      </div>
    );
  }

  console.log(stores);

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
          <TiPlus />{" "}
        </Link>
      </div>
      <div className="relative grid w-full grid-cols-3 gap-7 md:grid-cols-5">
        {stores?.data?.map((store: { name: string; id: string }) => (
          <StoreCard name={store.name} id={store.id} key={store.id} />
        ))}
        <StoreCard name={"store.name"} id={"12344"} />
        <StoreCard name={"store.name"} id={"1233444"} />
        <StoreCard name={"store.name"} id={"1234424"} />
        <StoreCard name={"store.name"} id={"1213444"} />
        <StoreCard name={"store.name"} id={"1223444"} />
        <StoreCard name={"store.name"} id={"1213444"} />
        <StoreCard name={"store.name"} id={"1233444"} />
        <StoreCard name={"store.name"} id={"123e444"} />
        <StoreCard name={"store.name"} id={"123s444"} />
        <StoreCard name={"store.name"} id={"123w444"} />
      </div>
    </div>
  );
}
