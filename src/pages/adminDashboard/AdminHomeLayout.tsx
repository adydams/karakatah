import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import Sidebar from "../../components/adminDashboard/Sidebar";
import NavBar from "../../components/adminDashboard/NavBar";
import Modal from "../../components/Modal";

export default function AdminHomeLayout() {
  const [showSidebar, setShowSidebar] = useState(true);
  const location = useLocation();

  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/overview": "Dashboard",
    "/dashboard/orders": "Orders",
    "/dashboard/categories": "Categories",
    "/dashboard/sub-categories": "Sub-Categories",
    "/dashboard/brands": "Brands",
    "/dashboard/products": "Products",
    "/dashboard/customers": "Customer Management",
    "/dashboard/stores": "Stores",
    "/dashboard/transactions": "Transactions",
    "/dashboard/finance": "Finance",
    "/dashboard/shipment": "Fleet Management",
    "/dashboard/pickup-stations": "Pickup Stations",
    "/dashboard/audit-trail": "System Audit Trail",
    "/dashboard/permissions": "Permissions Management",
    "/dashboard/help": "Help",
    "/dashboard/settings": "Logistics Settings",
    "/dashboard/admin-management": "Admin Management",
    "/dashboard/profile": "My Profile",
  };

  const title =
    pageTitles[location.pathname] ??
    (location.pathname.startsWith("/dashboard/stores/") ? "Stores" : "Dashboard");

  const handleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Mobile overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-[900] bg-black/20 lg:hidden"
          onClick={handleSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        showSidebar={showSidebar}
        handleSidebar={handleSidebar}
      />

      {/* Main area */}
      <div
        className={`
          flex-1
          min-h-screen
          transition-all
          duration-300
          flex
          flex-col
          ${showSidebar ? "lg:ml-[260px]" : "ml-0"}
        `}
      >
        {/* Navbar - Now a direct child of Layout, not the Page */}
        <header className="sticky top-0 z-[800] bg-white px-4 py-4 shadow-sm w-full">
          <NavBar
            title={title}
            handleSidebar={handleSidebar}
            showSidebar={showSidebar}
          />
        </header>

        {/* Page content */}
        <main className="p-4 flex-1">
          <Outlet />
        </main>
      </div>

      <Modal />
    </div>
  );
}
