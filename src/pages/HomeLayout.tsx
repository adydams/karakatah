import { Outlet } from "react-router";
import Footer from "../components/Footer";
import CustomerChrome from "../components/customer/CustomerChrome";

export default function HomeLayout() {
  return (
    <div className="flex w-full flex-col items-center justify-between">
      {/* <button className="bg-muted-green fixed top-32 right-5 z-[999] p-2 text-white">
        Delete Cart
      </button> */}
      <CustomerChrome />

      <Outlet />

      <Footer />
    </div>
  );
}
