import { BiSolidEditAlt } from "react-icons/bi";
import { FaEye } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

export default function TableOrderItem() {
  return (
    <div className="hover:bg-light-gray/30 border-dark-gray/10 grid w-full grid-cols-10 gap-3 border-b px-5 py-3 text-sm font-medium">
      <div className="flex h-full w-full flex-col items-start justify-start ">
        <p>59595</p>
      </div>
      <div className="flex h-full w-full flex-col items-start justify-start ">
        <p>59595</p>
      </div>
      <div className="flex h-full w-full flex-col items-start justify-start ">
        <p>59595</p>
      </div>
      <div className="flex h-full w-full flex-col items-start justify-start ">
        <p>59595</p>
      </div>
      <div className="flex h-full w-full flex-col items-start justify-start ">
        <p>59595</p>
      </div>
      <div className="flex h-full w-full flex-col items-start justify-start ">
        <p>59595</p>
      </div>
      <div className="flex h-full w-full flex-col items-start justify-start ">
        <p>59595</p>
      </div>
      <div className="flex h-full w-full flex-col items-start justify-start ">
        <p>59595</p>
      </div>
      <div className="flex h-full w-full flex-col items-start justify-start ">
        <p>59595</p>
      </div>

      {/* Action */}
      <div className="flex w-4/5 items-center text-xs justify-between gap-1">
        <div className="bg-deep-blue/10 flex   h-6 w-6 cursor-pointer items-center justify-center rounded-lg">
          <FaEye className="text-deep-blue" />
        </div>
        <div className="flex  h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-[#10b98120]">
          <BiSolidEditAlt className="text-muted-green" />
        </div>
        <div className="flex  h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-[#10b98120]">
          <MdDelete className="text-muted-green" />
        </div>
      </div>
    </div>
  );
}
