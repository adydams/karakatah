import { Outlet, useParams } from "react-router";
import NavBar from "../../components/adminDashboard/NavBar";
import Store from "./Store";
import { FaArrowUp } from "react-icons/fa6";
export default function StoreLayout() {
  const { storeId } = useParams();

  return (
    <section className="font-primary relative flex h-full w-full flex-col gap-10">
      <NavBar title="" />

      <div className={`relative grid w-full grow gap-5 ${storeId ? "grid-cols-1 md:grid-cols-[2fr_1fr]" : "grid-cols-1"}`}>
        <Store />

        <div
          id="store-details"
          className={`bg-white rounded-2xl relative shadow-sm ${storeId ? "h-screen md:h-auto" : "w-full"}`}
        >
          <Outlet />

          {/* Button on the mobile view to scroll to the top */}
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
  );
}
