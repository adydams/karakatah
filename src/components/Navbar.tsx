import { BiSearch } from "react-icons/bi";
import { IoHelpCircle } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa6";
import { CiLogin } from "react-icons/ci";
import { BsCart3 } from "react-icons/bs";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { Link } from "react-router";
import { useUser } from "../contexts/hooks/useUser";
import ProfileBar from "./ProfileBar";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "../services/apiCarts";
import { type Cart } from "../contexts/CartContext";
import { useState } from "react";
import CartItemCardNav from "./CartItemCardNav";

export default function Navbar() {
  const [showCart, setShowCart] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();

  function handleMouseOver() {
    if (!showCart) setShowCart((cart) => !cart);
  }
  function handleMouseOut() {
    if (showCart) setShowCart((cart) => !cart);
  }

  const { data: cart } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    enabled: !!localStorage.getItem("token"),
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  });

  const itemsNum = cart?.data?.items?.length ?? 0;

  return (
    <>
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
              <div className="group relative flex items-center justify-start gap-1 font-medium transition-all duration-1000 hover:text-dark-gray">
                <Link
                  to="/cart"
                  className="flex items-center justify-start gap-1"
                >
                  <BsCart3 className="text-lg lg:text-xl" />
                  <p className="hidden text-sm lg:block">Cart</p>
                </Link>

                {itemsNum ? (
                  <span className="bg-orange absolute top-[-7px] left-1 z-50 rounded-full px-2.5 py-0.5 text-[9px] font-semibold text-white lg:top-[-13px] lg:text-xs">
                    {itemsNum}
                  </span>
                ) : null}

                {/* Tooltip / "View Cart" on hover */}
                <div className="absolute top-full right-0 hidden group-hover:block bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  View Cart
                </div>
              </div>
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

            {/* Mobile Menu Trigger */}
            <div className="flex items-center justify-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-dark-gray hover:text-orange transition-colors"
              >
                {isMobileMenuOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
              </button>
            </div>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] bg-white lg:hidden flex flex-col p-6 animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="text-orange text-2xl font-extrabold">Karakata</Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-dark-gray"
            >
              <HiX size={28} />
            </button>
          </div>

          <ul className="flex flex-col gap-6 text-lg font-medium text-dark-gray">
            <li>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">Home</Link>
            </li>
            <li>
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">My Cart</Link>
            </li>
            <li>
              <Link to="/help" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">Help Center</Link>
            </li>
            {user ? (
              <li>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">My Profile</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">Login</Link>
                </li>
                <li>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
