type filterProp = {
  showFilter: boolean;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Filter({ showFilter, setShowFilter }: filterProp) {
  function handleFilter() {
    setShowFilter((filter) => !filter);
  }

  return (
    <div
      className={`absolute left-0 ${showFilter ? "z-50 translate-x-3 opacity-100 shadow-sm/10 lg:translate-x-28" : "z-[-999] translate-x-0 opacity-0"} font-primary top-8 flex h-auto w-[310px] flex-col items-start justify-start bg-white px-5 pb-10 transition-all duration-1000`}
    >
      <div className="w-full">
        <FilterHeader title="Categories" />
        <ul>
          <li className="mb-3 cursor-pointer text-sm font-light hover:text-gray-800">
            Yoga & Pilates
          </li>
          <li className="mb-3 cursor-pointer text-sm font-light hover:text-gray-800">
            Cardio Equipments
          </li>
          <li className="mb-3 cursor-pointer text-sm font-light hover:text-gray-800">
            Strength Training
          </li>
          <li className="mb-3 cursor-pointer text-sm font-light hover:text-gray-800">
            Workout Gear
          </li>
          <li className="mb-3 cursor-pointer text-sm font-light hover:text-gray-800">
            Active wears
          </li>
          <li className="mb-3 cursor-pointer text-sm font-light hover:text-gray-800">
            Accessories
          </li>
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
