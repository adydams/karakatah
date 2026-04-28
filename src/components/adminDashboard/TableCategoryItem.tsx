import { FaEye } from "react-icons/fa";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { ModalDelete } from "./ModalDelete";
import { useModal } from "../../contexts/hooks/useModal";

type CategoryItemProp = {
  id: string;
  category: string;
  // minPrice: number;
  // maxPrice: number;
  productStock: number;
  categoryImage: string;
};

export default function TableCategoryItem({
  id,
  category,
  // minPrice,
  // maxPrice,
  productStock,
  categoryImage,
}: CategoryItemProp) {
  const { openModal } = useModal();

  return (
    <div className="hover:bg-light-gray/30 border-dark-gray/10 grid w-full grid-cols-[2fr_1fr_1fr_1fr] border-b px-1 py-3 text-sm font-medium">
      <div className="flex h-auto w-full items-center justify-start gap-3">
        <div className="flex h-[60px] w-[90px] items-center justify-center">
          <img
            src={categoryImage}
            className="h-full w-full rounded-md object-cover shadow-sm/5"
            alt={"image"}
          />
        </div>
        <p className="max-w-[75%] font-semibold">{category}</p>
      </div>

      {/* <div className="flex w-full items-center justify-start">
        <p className="max-w-[75%]">
          ₦{minPrice} - ₦{maxPrice}
        </p>
      </div> */}
      <div className="flex w-full items-center justify-start">
        <p className="max-w-[75%] font-medium">{id} </p>
      </div>
      <div className="flex w-full items-center justify-start">
        <p className="max-w-[75%]">{productStock} </p>
      </div>

      <div className="flex w-4/5 items-center justify-start gap-5">
        <div className="bg-deep-blue/10 flex h-9 w-10 cursor-pointer items-center justify-center rounded-lg">
          <FaEye className="text-deep-blue" />
        </div>
        <div className="flex h-9 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#10b98120]">
          <BiSolidEditAlt className="text-muted-green" />
        </div>
        <div
          onClick={() => openModal(<ModalDelete itemTitle={category} itemId={id} type="category" />)}
          className="flex h-9 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#10b98120]"
        >
          <MdDelete className="text-muted-green" />
        </div>
      </div>
    </div>
  );
}
