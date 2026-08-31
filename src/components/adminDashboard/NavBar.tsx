import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoMdArrowDropdown, IoIosHelpCircle } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useLogin } from "../../contexts/hooks/useLogin";
import type { GetAdminByIdResponse } from "../../contexts/LoginContext";
import NotificationBell from "../NotificationBell";

type NavBarProp = {
  title: string;
  handleSidebar: () => void;
  showSidebar: boolean;
};

export default function NavBar({ title, handleSidebar, showSidebar }: NavBarProp) {
  const { adminId, getAdmin, role, logout } = useLogin();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { isLoading: isGettingInfo, data: adminInfo } =
    useQuery<GetAdminByIdResponse>({
      queryKey: ["admin", adminId],
      queryFn: () => getAdmin(adminId as string),
    });

  const name = adminInfo?.user.name;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav
      id="top"
      className="font-primary flex w-full items-center justify-between pr-10 lg:pr-0"
    >
      <div className="flex items-center gap-4">

        {!showSidebar && (
          <div className="flex items-center gap-4">
            <CgMenuGridR
              size={24}
              onClick={handleSidebar}
              className="text-[#f57c00] cursor-pointer block"
            />
            <div className="flex flex-col">
              <h1 className="text-lg font-black text-[#f57c00] leading-none uppercase tracking-tighter">Karakata</h1>
              <h2 className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-none mb-1">Marketplace</h2>
            </div>
          </div>
        )}
        <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>
        <h1 className="text-sm font-bold sm:text-base md:text-lg lg:text-2xl text-[#f57c00]">
          {title}
        </h1>
      </div>

      <div className="flex items-center justify-end gap-3 lg:gap-6">
        <form className="relative group">
          <BiSearch
            size={20}
            className="text-orange absolute top-0 bottom-0 left-4 m-auto group-focus-within:text-[#f57c00] transition-colors"
          />
          <input
            type="text"
            placeholder="Search for products, brands and categories..."
            className="border-[#dec1af] bg-gray-50 focus:bg-white focus:outline-none w-[120px] rounded-full border px-10 py-2 text-xs transition-all duration-300 focus:w-[180px] lg:w-[300px] focus:lg:w-[400px] shadow-sm focus:ring-2 focus:ring-[#f57c00]/20"
          />
        </form>

        <div className="flex items-center gap-4">
          <Link to="/dashboard/help" title="Help Center" className="text-dark-gray/70 hover:text-[#f57c00] transition-colors">
            <IoIosHelpCircle size={22} />
          </Link>
          <NotificationBell />
        </div>

        <div className="relative flex items-center gap-3 pl-4 border-l border-gray-200">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#dec1af] bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm ring-2 ring-transparent hover:ring-[#f57c00]/30 transition-all">
              {adminInfo?.user?.profilePicture ? (
                <img
                  className="h-full w-full object-cover"
                  src={adminInfo.user.profilePicture}
                  alt={name || "Admin"}
                />
              ) : (
                <FaUserCircle className="text-gray-300" size={28} />
              )}
            </div>
            <div className="hidden flex-col items-start justify-center text-xs lg:flex">
              {!isGettingInfo ? (
                <>
                  <h2 className="font-bold text-[#574235] leading-tight">{name}</h2>
                  <p className="text-gray-500 leading-tight">{role}</p>
                </>
              ) : (
                <div className="animate-pulse">
                  <div className="mb-1 h-3 w-20 rounded bg-gray-200"></div>
                  <div className="h-2 w-12 rounded bg-gray-200"></div>
                </div>
              )}
            </div>
            <IoMdArrowDropdown className="hidden lg:block text-gray-400" />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-[1000]">
              <Link
                to="/dashboard/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#f57c00] transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                My Profile
              </Link>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={async () => {
                  setIsDropdownOpen(false);
                  await handleLogout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-[#f57c00] hover:bg-orange-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
