import { CiBookmarkRemove } from "react-icons/ci";

import { formatPrice } from "../utils/utils";
// import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import { useState } from "react";

interface CartItemProps {
  name: string;
  price: string;
  quantity: string;
}

export default function CartItem({ name, price, quantity }: CartItemProps) {
  const [quantityItem, setQuantityItem] = useState(1);

  if (quantityItem < 0) {
    setQuantityItem(0);
  }

  console.log(quantityItem);
  return (
    <div className="border-dark-gray/10 flex h-[120px] w-full items-center justify-between border-b pb-3">
      <div className="b flex h-full items-center justify-start gap-5">
        <img
          className="h-full w-[100px] object-cover"
          src="slide1.jpg"
          alt=""
        />
        <div className="flex h-full flex-col items-start justify-start text-xs lg:text-sm">
          <h2 className="font-primary text-sm font-medium lg:text-lg">
            {name}
          </h2>
          <p className="font-light">
            Price: <span className="font-primary font-medium">₦{price}</span>
          </p>
          <p className="font-light">
            Qty: <span className="font-primary font-medium">{quantity}</span>
          </p>
          <button className="text-orange/90 hover:text-orange mt-auto flex cursor-pointer items-center justify-start gap-2 text-xs">
            <CiBookmarkRemove size={15} /> Remove
          </button>
        </div>
      </div>
      <div className="flex h-full flex-col items-start justify-start">
        <h3 className="font-primary text-dark-gray w-full text-right text-xs font-semibold lg:text-lg">
          ₦{formatPrice(Number(price) * Number(quantity))}
        </h3>
        <div className="mt-auto flex w-full items-center justify-between gap-2">
          <FiMinus
            onClick={() => setQuantityItem((prev) => prev - 1)}
            // size={20}
            className="text-secondary bg-dark-gray/50 cursor-pointer rounded-sm p-0.5 text-white"
          />
          <input
            type="text"
            placeholder="0"
            value={quantityItem}
            onChange={(e) => setQuantityItem(+e.target.value)}
            className="font-primary bg-light-gray/70 w-[50px] text-center focus:outline-none"
          />
          <IoMdAdd
            onClick={() => setQuantityItem((prev) => prev + 1)}
            // size={20}
            className="text-secondary bg-orange/70 cursor-pointer rounded-sm p-0.5 text-white"
          />
        </div>
      </div>
    </div>
  );
}
