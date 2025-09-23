import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomeLayout() {
  return (
    <div className="flex w-full flex-col items-center justify-between">
      {/* <button className="bg-muted-green fixed top-32 right-5 z-[999] p-2 text-white">
        Delete Cart
      </button> */}
      <Navbar />

      <Outlet />

      <Footer />
    </div>
  );
}
