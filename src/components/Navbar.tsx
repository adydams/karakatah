import { BiSearch } from "react-icons/bi";
import { IoHelpCircle } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa6";
import { CiLogin } from "react-icons/ci";
import { BsCart3 } from "react-icons/bs";
import { HiMenuAlt3 } from "react-icons/hi";
import { Link } from "react-router";
import { useUser } from "../contexts/hooks/useUser";
import ProfileBar from "./ProfileBar";
// import { useCart } from "../contexts/hooks/useCart";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "../services/apiCarts";
import { type Cart } from "../contexts/CartContext";
import { useState } from "react";
import CartItemCardNav from "./CartItemCardNav";
// import { useEffect } from "react";

export default function Navbar() {
  const [showCart, setShowCart] = useState(false);
  const { user } = useUser();
  // const { SetCart } = useCart();
  // console.log(SetCart);
  function handleMouseOver() {
    if (!showCart) setShowCart((cart) => !cart);
  }
  function handleMouseOut() {
    if (showCart) setShowCart((cart) => !cart);
  }

  // console.log(cartId);

  // fetch the cart using the cartId
  const { data: cart } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    enabled: !!localStorage.getItem("token"),
  });

  // console.log(isGettingCart);

  // console.log(cart, isGettingCart);

  // Come check this piece of code (useEffect)
  // useEffect(() => {
  //   if (cart && !isGettingCart) {
  //     SetCart(cart);
  //   } else {
  //     SetCart(null);
  //   }
  // }, [cart, isGettingCart, SetCart]);
  // console.log(cart);

  const itemsNum = cart?.data?.items?.length ?? 0;
  // console.log("Number of items in the cart", itemsNum);
  // console.log("Testing testing", cart);

  return (
    <nav className="font-primary sticky top-0 z-[999] flex h-[60px] w-full items-center justify-center bg-white shadow-sm/10 lg:h-[90px]">
      <div className="relative flex h-full w-[92%] items-center justify-between lg:w-[85%]">
        <Link to="/" className="text-orange text-sm font-extrabold lg:text-2xl">
          Karakata
        </Link>

        {/* Searchbar */}

        <div className="absolute bottom-[-80%] w-full lg:static lg:w-auto">
          <form className="relative block">
            <input
              className="bg-light-gray border-dark-gray/20 text-dark-gray/70 focus:bg-light-gray/60 focus:text-dark-gray/90 w-full rounded-2xl border px-5 py-2.5 text-xs transition-all duration-700 focus:outline-0 lg:w-[500px] focus:lg:w-[550px]"
              type="text"
              placeholder="Search for products, brands and categories"
            />
            <button className="bg-orange absolute top-0 right-0 bottom-0 m-auto flex w-[50px] cursor-pointer items-center justify-center rounded-tr-2xl rounded-br-2xl text-white">
              <BiSearch size={20} />
            </button>
          </form>
        </div>

        <ul className="flex h-full items-center justify-end gap-1 lg:gap-4">
          <li className={`lg:block`}>
            <Link
              to="/help"
              className="hover:text-dark-gray flex items-center justify-start gap-1 font-medium transition-all duration-1000"
            >
              <IoHelpCircle className="text-2xl" />
              <p className="hidden text-sm lg:block">Help</p>
            </Link>
          </li>
          <li
            className={`relative mr-1 flex h-full cursor-pointer items-center justify-center px-1 lg:mr-0 lg:flex`}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseOut}
            onClick={handleMouseOut}
          >
            <Link
              to="/cart"
              className="hover:text-dark-gray relative flex items-center justify-start gap-1 font-medium transition-all duration-1000"
            >
              <BsCart3 className="text-lg lg:text-xl" />
              <p className="hidden text-sm lg:block">Cart</p>

              {itemsNum ? (
                <span className="bg-orange absolute top-[-7px] left-1 z-50 rounded-full px-2.5 py-0.5 text-[9px] font-semibold text-white lg:top-[-13px] lg:text-xs">
                  {itemsNum}
                </span>
              ) : (
                ""
              )}
            </Link>
            {showCart && <CartItemCardNav />}
          </li>
          {user ? (
            <ProfileBar />
          ) : (
            <>
              <li className={`lg:block`}>
                <Link
                  to="/login"
                  className="hover:text-dark-gray flex items-center justify-start gap-1 font-medium transition-all duration-1000"
                >
                  <CiLogin className="text-xl" />
                  <p className="hidden text-sm lg:block">Login</p>
                </Link>
              </li>

              <li className={`lg:block`}>
                <Link
                  to="/register"
                  className="hover:text-dark-gray flex items-center justify-start gap-1 font-medium transition-all duration-1000"
                >
                  <FaUserPlus className="text-xl" />
                  <p className="hidden text-sm lg:block">Sign up</p>
                </Link>
              </li>
            </>
          )}

          {/* icons for Mobile */}
          <div className="flex items-center justify-center lg:hidden">
            {/* <BiSearch size={20} /> */}
            <HiMenuAlt3 size={25} />
          </div>
        </ul>
      </div>
    </nav>
  );
}
