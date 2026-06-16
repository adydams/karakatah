import { useState } from "react";

import { CgMenuGridR } from "react-icons/cg";
import { Outlet } from "react-router";
import Sidebar from "../../components/adminDashboard/Sidebar";
import Modal from "../../components/adminDashboard/Modal";

export default function AdminHomeLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  function handleSidebar() {
    setShowSidebar((bar) => !bar);
  }

  return (
    <main className="relative block h-screen w-full grid-cols-[1fr_4fr] lg:grid">
      <CgMenuGridR
        size={30}
        onClick={handleSidebar}
        className={`text-dark-gray absolute top-8 right-5 z-[999] block cursor-pointer lg:hidden`}
      />

      <Sidebar showSidebar={showSidebar} />
      <div className="dash text-dark-gray/90 h-full w-full overflow-scroll px-4 py-7 lg:px-10">
        <Outlet />
      </div>

      <Modal />
    </main>
  );
}
