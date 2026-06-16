import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaCartShopping } from "react-icons/fa6";
import { FaWindowRestore } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { RiStoreFill } from "react-icons/ri";
import { GrMoney } from "react-icons/gr";
import { MdLocalShipping } from "react-icons/md";
import { IoIosHelpCircle } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
// import { CiCircleList } from "react-icons/ci";
import { FaThList } from "react-icons/fa";

import { NavLink } from "react-router";

type SidebarProps = {
  showSidebar: boolean;
  // handleSidebar: () => void;
};
const otherlinks = [
  {
    title: "Help Center",
    icon: <IoIosHelpCircle size={20} />,
    link: "help",
  },
  {
    title: "Settings",
    icon: <IoSettings size={20} />,
    link: "settings",
  },
  {
    title: "Logout",
    icon: <IoLogOut size={20} />,
    link: "logout",
  },
];
const links = [
  {
    title: "Overview",
    icon: <TbLayoutDashboardFilled size={20} />,
    link: "/dashboard/overview",
  },
  {
    title: "Orders",
    icon: <FaCartShopping size={20} />,
    link: "orders",
  },
  {
    title: "Categories",
    icon: <FaThList size={18} />,
    link: "categories",
  },
  {
    title: "Products",
    icon: <FaWindowRestore size={20} />,
    link: "products",
  },
  {
    title: "Customers",
    icon: <FaUsers size={20} />,
    link: "customers",
  },
  {
    title: "Stores",
    icon: <RiStoreFill size={20} />,
    link: "stores",
  },
  {
    title: "Transactions",
    icon: <GrMoney size={20} />,
    link: "transactions",
  },
  {
    title: "Shipment",
    icon: <MdLocalShipping size={20} />,
    link: "shipment",
  },
];

export default function Sidebar({ showSidebar }: SidebarProps) {
  return (
    <div className="relative">
      <div
        className={`bg-white ${!showSidebar ? "ml-0" : "ml-[-200%]"} absolute z-[910] h-screen w-[70%] pl-5 text-white transition-all duration-1000 lg:static lg:w-full`}
      >
        <div className="font-primary flex h-20 w-full items-center justify-center">
          <h1 className="text-dark-gray font-bold">Karakata</h1>
        </div>

        <ul>
          <p className="text-dark-gray/70 px-5 text-xs font-semibold">
            GENERAL
          </p>
          {links.map((link, index) => (
            <li key={index} className="w-full">
              <NavLink
                // onClick={handleSidebar}
                to={link.link}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange border-orange border-r-4 font-medium"
                    : "text-dark-gray/80"
                }
                style={{
                  width: "100%",
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  padding: "10px 20px",
                  fontSize: "0.8rem",
                  margin: "6px 0",
                }}
              >
                {link.icon}
                <span>{link.title}</span>
              </NavLink>
            </li>
          ))}

          <div className="my-10 px-5">
            <hr className="border-dark-gray/10 border" />
          </div>

          <p className="text-dark-gray/70 px-5 text-xs font-semibold">USERS</p>
          {otherlinks.map((link, index) => (
            <li key={index} className="w-full">
              <NavLink
                to={link.link}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange border-orange border-r-4 font-medium"
                    : "text-dark-gray/80"
                }
                style={{
                  width: "100%",
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  padding: "10px 20px",
                  fontSize: "0.8rem",
                  margin: "6px 0",
                }}
              >
                {link.icon}
                <span>{link.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`bg-dark-gray/20 ${!showSidebar ? "ml-0" : "ml-[-200%]"} absolute z-[900] flex h-screen w-[100%] flex-col justify-end text-white transition-all duration-1000 lg:static lg:hidden lg:w-full`}
      >
        hello boss
      </div>
    </div>
  );
}
