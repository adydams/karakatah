import { BiSearch } from "react-icons/bi";
import { GoBellFill } from "react-icons/go";
import { IoMdArrowDropdown } from "react-icons/io";

import { useQuery } from "@tanstack/react-query";
import { useLogin } from "../../contexts/hooks/useLogin";
import type { GetAdminByIdResponse } from "../../contexts/LoginContext";
// import Spinner from "./Spinner";

type NavBarProp = {
  title: string;
};

// type NameRefineProp = {
//   fname: string | undefined;
//   lname;
// };

export default function NavBar({ title }: NavBarProp) {
  const { adminId, getAdmin, role } = useLogin();

  const { isLoading: isGettingInfo, data: adminInfo } =
    useQuery<GetAdminByIdResponse>({
      queryKey: ["admin", adminId],
      queryFn: () => getAdmin(adminId as string),
    });

  const name = adminInfo?.user.name;

  return (
    <nav id="top" className="font-primary flex w-full items-center justify-between pr-10 lg:pr-0">
      <h1 className="text-sm font-bold sm:text-base md:text-lg lg:text-2xl">
        {title}
      </h1>

      <div className="flex items-center justify-end gap-2 lg:gap-5">
        <form className="relative">
          <BiSearch
            size={20}
            className="text-orange absolute top-0 bottom-0 left-4 m-auto"
          />
          <input
            type="text"
            placeholder="Search..."
            className="border-dark-gray/10 bg-light-gray focus:outline-dark-gray/20 w-[100px] rounded-full border px-10 py-2 text-xs transition-all duration-1000 focus:w-[150px] focus:bg-white/50 lg:w-[400px] focus:lg:w-[450px]"
          />
        </form>

        <GoBellFill size={20} className="text-dark-gray/80" />

        {/* Profile bar */}
        {/* Profile bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="h-[40px] w-[40px]">
            <img
              className="h-full w-full rounded-full object-cover"
              src="images/ope passport.png"
              alt=""
            />
          </div>
          <div className="hidden flex-col items-start justify-start gap-0 text-xs lg:flex">
            {!isGettingInfo ? (
              <>
                <h2 className="font-semibold">{name}</h2>
                <p>{role}</p>
              </>
            ) : (
              <div className="animate-pulse">
                <div className="mb-2 h-5 w-32 rounded bg-gray-300"></div>
                <div className="h-4 w-24 rounded bg-gray-300"></div>
              </div>
            )}
          </div>
          <IoMdArrowDropdown className="hidden lg:block" />
        </div>
      </div>
    </nav>
  );
}

// function ProfileBar
