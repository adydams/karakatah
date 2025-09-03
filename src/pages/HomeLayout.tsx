import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomeLayout() {
  return (
    <div className="flex w-full flex-col items-center justify-between">
      <Navbar />

      <Outlet />

      <Footer />
    </div>
  );
}
