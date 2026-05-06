import { CiBookmarkRemove } from "react-icons/ci";

import { formatPrice } from "../utils/utils";
// import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItemCart, updateItemQuantity } from "../services/apiCarts";
import toast from "react-hot-toast";

interface CartItemProps {
  name: string;
  price: string;
  quantity: number;
  id: string;
  image: string;
}
type AddItemVariables = {
  id: string;
  quantity: number;
};

export default function CartItem({
  name,
  price,
  quantity,
  id,
  image,
}: CartItemProps) {
  const [quantityItem, setQuantityItem] = useState(quantity);
  const lastSyncedQty = useRef(quantity); // add this to track last synced quantity

  const queryClient = useQueryClient();

  // console.log(id);
  // Add item to cart

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, quantity }: AddItemVariables) =>
      updateItemQuantity(id, quantity),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(data.message || "Item quantity updated successfully");
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteItemCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item deleted successfully");
    },

    onError: (err) => toast.error(err.message),
  });

  function handleDelete() {
    deleteItem(id);
  }

  // Pass the new value directly to handleUpdate
  function handleUpdate(newQuantity: number) {
    if (newQuantity === lastSyncedQty.current) return; // skip if unchanged
    lastSyncedQty.current = newQuantity;
    mutate({ id, quantity: newQuantity }); // ✅ uses the new value
  }

  useEffect(() => {
    if (quantityItem < 0) {
      setQuantityItem(0);
    }
  }, [quantityItem]);

  // console.log(quantityItem);
  return (
    <div className="border-dark-gray/10 flex h-[120px] w-full items-center justify-between border-b pb-3">
      <div className="b flex h-full items-center justify-start gap-5">
        <img className="h-full w-[100px] object-cover" src={image} alt="" />
        <div className="flex h-full flex-col items-start justify-start text-xs lg:text-sm">
          <h2 className="font-primary text-sm font-medium lg:text-lg">
            {name}
          </h2>
          <p className="font-light">
            Price:{" "}
            <span className="font-primary font-medium">
              ₦{formatPrice(price)}
            </span>
          </p>
          <p className="font-light">
            Qty: <span className="font-primary font-medium">{quantity}</span>
          </p>
          <button
            onClick={handleDelete}
            className="text-orange/90 hover:text-orange mt-auto flex cursor-pointer items-center justify-start gap-2 text-xs"
          >
            <CiBookmarkRemove size={15} /> {isDeleting ? "Removing" : "Remove"}
          </button>
        </div>
      </div>
      <div className="flex h-full flex-col items-start justify-start">
        <h3 className="font-primary text-dark-gray w-full text-right text-xs font-semibold lg:text-lg">
          ₦{formatPrice(Number(price) * Number(quantity))}
        </h3>
        <div className="mt-auto flex w-full items-center justify-between gap-2">
          <FiMinus
            onClick={() => {
              if (quantityItem <= 1) return; // prevent going below 1
              const newQty = quantityItem - 1;
              setQuantityItem(newQty);
              handleUpdate(newQty); // ✅ pass new value directly
            }}
            // size={20}
            className="text-secondary bg-dark-gray/50 cursor-pointer rounded-sm p-0.5 text-white"
          />
          <input
            type="text"
            placeholder="0"
            value={quantityItem}
            onChange={(e) => setQuantityItem(+e.target.value)}
            onBlur={() => handleUpdate(quantityItem)} // fires when you click away
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdate(quantityItem); // fires on Enter
            }}
            disabled={isPending}
            className={`${isPending ? "opacity-20" : ""} font-primary bg-light-gray/70 w-[50px] text-center focus:outline-none`}
          />
          <IoMdAdd
            onClick={() => {
              const newQty = quantityItem + 1;
              setQuantityItem(newQty);
              handleUpdate(newQty); // ✅ pass new value directly
            }}
            // size={20}
            className="text-secondary bg-orange/70 cursor-pointer rounded-sm p-0.5 text-white"
          />
        </div>
      </div>
    </div>
  );
}
