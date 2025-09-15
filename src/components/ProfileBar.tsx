// import { MdKeyboardArrowDown } from "react-icons/md";

import { FaUserCircle } from "react-icons/fa";

import { Link } from "react-router";
import { useState } from "react";
import { useUser } from "../contexts/hooks/useUser";

export default function ProfileBar() {
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useUser();

  // const navigate = useNavigate();

  function handleMenu() {
    setShowMenu((menu) => !menu);
  }

  function handleLogout() {
    logout();
    // navigate("/");
  }
  return (
    <div className="relative flex items-center justify-between gap-3">
      <div
        onClick={handleMenu}
        className="flex cursor-pointer items-start justify-center gap-3"
      >
        <FaUserCircle size={24} className="text-orange" />
        <p className="text-deep-blue">Hi, {user?.name}</p>
      </div>

      {/* <MdKeyboardArrowDown
        size={25}
        onClick={handleMenu}
        className="ml-3 hidden cursor-pointer text-black/70 lg:block"
      /> */}
      {showMenu && (
        <div className="absolute top-[100%] right-0 flex w-[150px] flex-col items-start justify-center gap-2 rounded-md bg-white px-5 py-3 text-xs font-normal text-black/90 shadow-md">
          <Link
            onClick={handleMenu}
            className="hover:text-beige transition-all duration-1000 hover:font-medium"
            to="cart"
          >
            Cart
          </Link>
          <Link
            onClick={handleMenu}
            className="hover:text-beige transition-all duration-1000 hover:font-medium"
            to="orders"
          >
            Orders
          </Link>
          <Link
            onClick={handleMenu}
            className="hover:text-beige transition-all duration-1000 hover:font-medium"
            to="profile"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="cursor-pointer font-medium text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
