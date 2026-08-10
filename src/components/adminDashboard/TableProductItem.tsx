import { BiSolidEditAlt } from "react-icons/bi";
import { FaEye } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { formatPrice } from "../../utils/utils";

type ProductItemProp = {
  id?: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  noReview: number;
  image: string;
  stock: string;
  onView?: (id?: string) => void;
  onEdit?: (id?: string) => void;
  onDelete?: (id?: string) => void;
};

export default function TableProductItem({
  id,
  name,
  price,
  category,
  stock,
  rating,
  noReview,
  image,
  onView,
  onEdit,
  onDelete,
}: ProductItemProp) {
  return (
    <div className="hover:bg-light-gray/30 border-dark-gray/10 grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-3 border-b px-1 py-3 text-sm font-medium">
      <div className="flex h-auto w-full items-center justify-start gap-3">
        <div className="flex h-[60px] w-[90px] items-center justify-center">
          <img
            src={image}
            className="h-full w-full rounded-md object-cover shadow-sm/5"
            alt={image}
          />
        </div>
        <p className="max-w-[75%] font-semibold">{name}</p>
      </div>
      <div className="flex h-full w-full items-center justify-start">
        <p>₦{formatPrice(price)}</p>
      </div>
      <div className="flex h-full w-full flex-col items-start justify-center">
        <p>{stock}</p>
      </div>
      <div className="flex h-full w-full items-center justify-start">
        <p>{category}</p>
      </div>
      <div className="flex h-full w-full items-center justify-start gap-2">
        <div className="flex items-center justify-center gap-1 rounded-sm bg-gray-100 px-2 py-1 font-semibold">
          <FaStar color="#FFD700" /> <p> {rating}</p>
        </div>
        <p className="text-xs">
          {noReview} <span className="font-light">Reviews</span>
        </p>
      </div>

      {/* Action */}
      <div className="flex w-4/5 items-center justify-between gap-1">
        <div onClick={() => onView && onView(id)} className="bg-deep-blue/10 flex h-9 w-10 cursor-pointer items-center justify-center rounded-lg">
          <FaEye className="text-deep-blue" />
        </div>
        <div onClick={() => onEdit && onEdit(id)} className="flex h-9 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#10b98120]">
          <BiSolidEditAlt className="text-muted-green" />
        </div>
        <div onClick={() => onDelete && onDelete(id)} className="flex h-9 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#10b98120]">
          <MdDelete className="text-muted-green" />
        </div>
      </div>
    </div>
  );
}
