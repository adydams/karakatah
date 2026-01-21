import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/apiProducts";
import Spinner from "./Spinner";

type filterProp = {
  showFilter: boolean;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Filter({ showFilter, setShowFilter }: filterProp) {
  const { isLoading: isGettingCategories, data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  console.log(showFilter);

  const categories = categoryData?.data;

  function handleFilter() {
    setShowFilter((filter) => !filter);
  }

  return (
    // <div
    //   className={`absolute left-0 ${showFilter ? "z-50 translate-x-3 opacity-100 shadow-sm/10 lg:translate-x-28" : "z-[-999] translate-x-0 opacity-0"} font-primary top-8 flex h-auto w-[310px] flex-col items-start justify-start bg-white px-5 pb-10 transition-all duration-1000`}
    // >
    <div
      className={`font-primary top-8 ${showFilter ? "row-span-2" : "hidden"} flex h-full w-full flex-col items-start justify-start rounded-lg bg-gray-100 px-5 pb-10 shadow-xl transition-all duration-1000 hover:bg-white`}
    >
      <div className="w-full">
        <FilterHeader title="Categories" />
        <ul>
          {isGettingCategories ? (
            <Spinner size="big" />
          ) : (
            categories?.map((category, index) => (
              <li
                key={index}
                className="mb-3 flex cursor-pointer flex-wrap items-center justify-start gap-0.5 text-sm font-light hover:text-gray-800"
              >
                {category.name}
                {/* {category.subCategories.map((subCategory, index) => (
                  <span
                    key={index}
                    className="border-dark-gray/20 font-secondary hover:text-dark-gray/90 text-dark-gray/70 mx-1 rounded-full border px-3 py-0.5 text-[10px]"
                  >
                    {subCategory.name}
                  </span>
                ))} */}
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="w-full">
        <FilterHeader title="Size Option" />
        <ul>
          <button className="mr-3 rounded-md border-[1px] border-black px-[10px] py-[4px] text-sm">
            S
          </button>
          <button className="mr-3 rounded-md border-[1px] border-black px-[10px] py-[4px] text-sm">
            M
          </button>
          <button className="mr-3 rounded-md border-[1px] border-black px-[10px] py-[4px] text-sm">
            L
          </button>
        </ul>
      </div>
      <div className="w-full">
        <FilterHeader title="Price Filter" />
        <ul>
          <li className="mb-3 cursor-pointer text-sm font-light hover:text-gray-800">
            ₦5,000 - ₦50, 000
          </li>
          <li className="mb-3 cursor-pointer text-sm font-light hover:text-gray-800">
            ₦50,000 - ₦200k
          </li>
          <li className="mb-3 cursor-pointer text-sm font-light hover:text-gray-800">
            ₦200k - ₦600k
          </li>
          <li className="mb-3 cursor-pointer text-sm font-light hover:text-gray-800">
            ₦600k - ₦1m
          </li>
          <li className="mb-3 cursor-pointer text-sm font-light hover:text-gray-800">
            ₦1m above
          </li>
        </ul>
      </div>

      <button
        onClick={handleFilter}
        className="bg-beige hover:bg-orange/80 cursor-pointer self-end rounded-sm px-4 py-2 text-xs transition-all duration-700 hover:text-white"
      >
        Search
      </button>
    </div>
  );
}

function FilterHeader({ title }: { title: string }) {
  return (
    <div className="my-6 flex h-[50px] w-full items-center justify-start gap-3">
      <div className="bg-muted-green h-full w-[3px] rounded-lg"></div>
      <p className="font-medium">{title}</p>
      <div className="bg-muted-green h-px w-[50%]"></div>
    </div>
  );
}
