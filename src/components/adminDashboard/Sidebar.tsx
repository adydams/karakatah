import React, { useState } from "react";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import {
  FaShoppingCart,
  FaShieldAlt,
  FaUsers,
  FaWindowRestore,
  FaThList,
  FaChevronDown,
  FaUserCircle,
  FaChartLine,
  FaClipboardCheck,
} from "react-icons/fa";
import { FiGift } from "react-icons/fi";
import { IoHelpCircle, IoSettings, IoLogOut } from "react-icons/io5";
import { CgMenuGridR } from "react-icons/cg";
import { RiStoreFill } from "react-icons/ri";
import { MdLocalShipping, MdGroup } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { NavLink } from "react-router";
import { useLogin } from "../../contexts/hooks/useLogin";

type SidebarProps = {
  showSidebar: boolean;
  handleSidebar: () => void;
};

type LinkItem = {
  title: string;
  icon: React.ReactNode;
  link: string;
};

type ModuleItem = {
  title: string;
  icon: React.ReactNode;
  links: LinkItem[];
};

const sidebarModules: ModuleItem[] = [
  {
    title: "Overview",
    icon: <TbLayoutDashboardFilled size={20} />,
    links: [
      {
        title: "Dashboard",
        icon: <TbLayoutDashboardFilled size={18} />,
        link: "/dashboard/overview",
      },
      {
        title: "Analytics",
        icon: <FaChartLine size={18} />,
        link: "/dashboard/analytics",
      },
      {
        title: "My Profile",
        icon: <FaUserCircle size={18} />,
        link: "/dashboard/profile",
      },
    ],
  },
  {
    title: "Commerce & Logistics",
    icon: <MdLocalShipping size={20} />,
    links: [
      {
        title: "Logistics",
        icon: <MdLocalShipping size={18} />,
        link: "/dashboard/logistics",
      },
      {
        title: "Orders",
        icon: <FaShoppingCart size={18} />,
        link: "/dashboard/orders",
      },
      {
        title: "Order Approvals",
        icon: <FaClipboardCheck size={18} />,
        link: "/store/order-approvals",
      },
      {
        title: "Categories",
        icon: <FaThList size={18} />,
        link: "/dashboard/categories",
      },
      {
        title: "Sub-Categories",
        icon: <FaThList size={18} />,
        link: "/dashboard/sub-categories",
      },
      {
        title: "Brands",
        icon: <FaWindowRestore size={18} />,
        link: "/dashboard/brands",
      },
      {
        title: "Products",
        icon: <FaThList size={18} />,
        link: "/dashboard/products",
      },
      {
        title: "Product Approvals",
        icon: <FaShieldAlt size={18} />,
        link: "/dashboard/product-approvals",
      },
      {
        title: "Stores",
        icon: <RiStoreFill size={18} />,
        link: "/dashboard/stores",
      },
      {
        title: "Pickup Stations",
        icon: <RiStoreFill size={18} />,
        link: "/dashboard/pickup-stations",
      },
      {
        title: "Hubs",
        icon: <MdLocalShipping size={18} />,
        link: "/dashboard/hubs",
      },
      {
        title: "Captains",
        icon: <FaUsers size={18} />,
        link: "/dashboard/captains",
      },
      {
        title: "Shipments",
        icon: <MdLocalShipping size={18} />,
        link: "/dashboard/shipment",
      },
    ],
  },
  {
    title: "Finance & Settlement",
    icon: <GrMoney size={20} />,
    links: [
      {
        title: "Finance",
        icon: <GrMoney size={18} />,
        link: "/dashboard/finance",
      },
      {
        title: "Discounts",
        icon: <FiGift size={18} />,
        link: "/dashboard/discounts",
      },
      {
        title: "Settlement Review",
        icon: <FaShieldAlt size={18} />,
        link: "/dashboard/finance/settlement-review",
      },
    ],
  },
  {
    title: "Disputes & Operations",
    icon: <FaShieldAlt size={20} />,
    links: [
      {
        title: "Return Requests",
        icon: <FaShoppingCart size={18} />,
        link: "/dashboard/returns",
      },
      {
        title: "Restock Approvals",
        icon: <FaThList size={18} />,
        link: "/dashboard/restock-approvals",
      },
      {
        title: "Store Return Pickups",
        icon: <FaThList size={18} />,
        link: "/store/return-approvals",
      },
    ],
  },
  {
    title: "System & Security",
    icon: <IoSettings size={20} />,
    links: [
      {
        title: "Settings",
        icon: <IoSettings size={18} />,
        link: "/dashboard/settings",
      },
      {
        title: "Help Center",
        icon: <IoHelpCircle size={18} />,
        link: "/dashboard/help",
      },
    ],
  },
];

export default function Sidebar({ showSidebar, handleSidebar }: SidebarProps) {
  const [openModule, setOpenModule] = useState<string | null>("Overview");
  const { logout } = useLogin();

  const toggleModule = (title: string) => {
    setOpenModule(openModule === title ? null : title);
  };

  return (
    <div
      className={`
        fixed
        left-0
        top-0
        z-[1000]
        h-screen
        w-[260px]
        transform
        transition-transform
        duration-300
        ${showSidebar ? "translate-x-0" : "pointer-events-none -translate-x-full"}
      `}
    >
      <div className="h-full bg-white border-r border-gray-200 flex flex-col shadow-xl rounded-r-3xl overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex flex-col">
            <h1 className="text-lg font-black text-[#f57c00] leading-none uppercase tracking-tighter">Karakata</h1>
            <h2 className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-none">Marketplace</h2>
          </div>
          <button
            type="button"
            onClick={handleSidebar}
            aria-label="Close sidebar"
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-dark-gray"
          >
            <CgMenuGridR size={24} className="text-[#f57c00]" />
          </button>
        </div>

        <ul className="flex flex-col py-4 overflow-y-auto no-scrollbar px-2 flex-1">
          {sidebarModules.map((module, mIdx) => (
            <li key={mIdx} className="w-full mb-1">
              <div
                onClick={() => {
                  toggleModule(module.title);
                }}
                className={`flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                  openModule === module.title
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={openModule === module.title ? "text-orange-500" : "text-gray-500"}>{module.icon}</span>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${
                    openModule === module.title ? "text-orange-600" : "text-gray-600"
                  }`}>
                    {module.title}
                  </p>
                </div>
                {module.links.length > 0 && (
                  <span className="transition-transform duration-200" style={{ transform: openModule === module.title ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <FaChevronDown size={12} className="text-gray-400" />
                  </span>
                )}
              </div>

              {openModule === module.title && (
                <div className="flex flex-col bg-gray-50/50 rounded-lg mt-1 overflow-hidden">
                  {module.links.map((link, lIdx) => (
                    <NavLink
                      key={lIdx}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          handleSidebar();
                        }
                      }}
                      to={link.link}
                      className={({ isActive }) =>
                        isActive
                          ? "text-[white] font-medium bg-orange-500 rounded-lg my-1"
                          : "text-gray-600 hover:bg-gray-100 rounded-lg my-1"
                      }
                      style={{
                        width: "100%",
                        display: "flex",
                        gap: "10px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        padding: "10px 20px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {link.icon}
                      <span className="truncate">{link.title}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={async () => {
              try {
                await logout();
              } catch (err) {
                console.error("Logout failed:", err);
              }
            }}
            className="flex items-center gap-3 w-full px-3 py-2 text-[#f57c00] hover:bg-orange-50 rounded-lg transition-colors text-xs font-semibold uppercase tracking-wider"
          >
            <IoLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
