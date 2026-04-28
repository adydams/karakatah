import { SlOptionsVertical } from "react-icons/sl";

type TableItemsProp = {
  image: string;
  name: string;
  date: string;
  price: number;
  totalEarning: number;
  index: number;
};

export default function Tableitems({
  image,
  name,
  date,
  price,
  totalEarning,
  index,
}: TableItemsProp) {
  return (
    <div
      style={{
        backgroundColor: index % 2 == 0 ? "#33415508" : "",
      }}
      className={`my-1 grid w-full grid-cols-[25%_1fr_1fr_1fr_5%] gap-1 px-5 py-2 font-semibold`}
    >
      <div className="flex h-auto w-full items-center justify-start gap-1">
        <div className="flex h-[40px] w-[40px] items-center justify-center">
          <img src={image} className="h-full w-full object-cover" alt={name} />
        </div>
        <p className="max-w-[75%]">{name}</p>
      </div>

      <div className="flex w-full items-center font-medium justify-start pl-1">
        <p>{date}</p>
      </div>

      {/* price */}
      <div className="flex w-full items-center justify-start pl-2">
        <p className="bg-orange/15 text-orange rounded-full px-4 py-1 font-bold">
          {price}
        </p>
      </div>

      {/* earning */}
      <div className="flex w-full items-center justify-start pl-5">
        <p className="rounded-full bg-blue-300/15 px-4 py-1 font-bold text-blue-800">
          {totalEarning}
        </p>
      </div>

      {/* options */}
      <div className="flex w-full items-center justify-center">
        <SlOptionsVertical />
      </div>
    </div>
  );
}
