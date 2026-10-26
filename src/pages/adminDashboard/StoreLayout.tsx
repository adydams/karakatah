import { Outlet, useParams } from "react-router";
import Store from "./Store";
import { FaArrowUp, FaStore } from "react-icons/fa6";
import NavBar from "../../components/adminDashboard/NavBar";
import Sidebar from "../../components/adminDashboard/Sidebar";
import { useState, useEffect } from "react";

export default function StoreLayout() {
  const { storeId } = useParams();
  const [showSidebar, setShowSidebar] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : true
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleViewportChange = () => setShowSidebar(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  const handleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Mobile overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-[900] bg-black/20 lg:hidden"
          onClick={handleSidebar}
        />
      )}

      <Sidebar
        showSidebar={showSidebar}
        handleSidebar={handleSidebar}
      />

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
        <header className="sticky top-0 z-[800] w-full bg-white px-3 py-3 shadow-sm sm:px-4 sm:py-4">
          <NavBar
            title={storeId ? "Store Management" : "Store Overview"}
            handleSidebar={handleSidebar}
            showSidebar={showSidebar}
          />
        </header>

        <section className="font-primary relative flex flex-1 w-full flex-col gap-10 p-3 sm:p-4 lg:p-6">
          <div className={`relative grid w-full grow gap-5 ${storeId ? "grid-cols-1 md:grid-cols-[2fr_1fr]" : "grid-cols-1"}`}>
            <Store />

            <div
              id="store-details"
              className={`bg-white rounded-2xl relative shadow-sm ${storeId ? "h-screen md:h-auto" : "w-full"}`}
            >
              <Outlet />

              <div
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setTimeout(() => {
                      document.getElementById("top")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 100);
                  }
                }}
                className="bg-dark-gray opacity-40 hover:opacity-100 absolute bottom-5 left-2 flex items-center justify-center p-3 text-white rounded-full md:hidden"
              >
                <FaArrowUp />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
