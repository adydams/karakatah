import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { GoHeartFill } from "react-icons/go";
import type { ProductProp } from "../types/type";
import { Link } from "react-router";

export default function ProductCard({ id, image, name, price }: ProductProp) {
  const [addWish, setAddWish] = useState(false);
  const [showAddtoCart, setShowAddtoCart] = useState(false);

  function handleWish() {
    setAddWish((wish) => !wish);
  }

  function handleMouseOver() {
    setShowAddtoCart((cart) => !cart);
  }
  function handleMouseOut() {
    setShowAddtoCart((cart) => !cart);
  }

  return (
    <div
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
      className="relative h-[400px] w-full overflow-hidden"
    >
      <div
        style={{
          backgroundImage: `url('${image}')`,
          backgroundSize: showAddtoCart ? "contain" : "cover",
          backgroundPosition: "center",
        }}
        className="h-[75%] w-full"
      ></div>
      <div className="flex w-full items-center justify-between">
        <div className="h-[20%] w-[80%] cursor-pointer">
          <h2 className="font-primary mt-1.5 font-light">{name}</h2>
          <h2 className="font-primary f text-xl">₦{price}</h2>
        </div>
        {addWish ? (
          <GoHeartFill className="text-muted-green" size={25} />
        ) : (
          <CiHeart size={25} />
        )}
      </div>

      {showAddtoCart && (
        <div className="bg-light-gray/40 absolute top-0 flex h-full w-full shadow-sm/10">
          <div className="relative flex h-full w-full items-end justify-between gap-2">
            <button className="bg-orange font-primary hover:bg-orange/90 w-[50%] cursor-pointer px-5 py-3 text-center text-[10px] text-white">
              ADD TO CART
            </button>
            <button
              onClick={handleWish}
              className="bg-muted-green font-primary hover:bg-muted-green/90 w-[50%] cursor-pointer px-2 py-3 text-center text-[10px] text-white"
            >
              ADD TO WISHLIST
            </button>

            <Link
              className="text-dark-gray border-dark-gray hover:bg-beige/80 hover:text-dark-gray/90 absolute top-0 right-0 bottom-0 left-0 m-auto flex h-[30px] w-[50%] cursor-pointer items-center justify-center rounded-xs border-3 py-3 text-xs shadow-md transition-all duration-500 hover:border-0"
              to={`products/${name.replaceAll(" ", "-")}/${id}`}
            >
              <button>VIEW MORE</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
