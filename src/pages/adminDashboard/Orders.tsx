import NavBar from "../../components/adminDashboard/NavBar";

import { GrMoney } from "react-icons/gr";
import { BsCartX } from "react-icons/bs";
import { LiaShippingFastSolid } from "react-icons/lia";
import { PiShippingContainerLight } from "react-icons/pi";
import { VscOpenPreview } from "react-icons/vsc";
import { MdOutlinePayment } from "react-icons/md";
import { TbBrandDeliveroo } from "react-icons/tb";
import { TbProgress } from "react-icons/tb";
import { IoMdArrowDropdown } from "react-icons/io";
import TableOrderItem from "../../components/adminDashboard/TableOrderItem";

const views = [
  {
    title: "Payment Refund",
    icon: <GrMoney size={20} />,
    val: "490",
  },
  {
    title: "Order Cancelled",
    icon: <BsCartX size={20} />,
    val: "241",
  },
  {
    title: "Order Shipped",
    icon: <PiShippingContainerLight size={20} />,
    val: "630",
  },
  {
    title: "Order Delivering",
    icon: <LiaShippingFastSolid size={20} />,
    val: "170",
  },
  {
    title: "Pending Review",
    icon: <VscOpenPreview size={20} />,
    val: "210",
  },
  {
    title: "Pending Payment",
    icon: <MdOutlinePayment size={20} />,
    val: "608",
  },
  {
    title: "Delivered",
    icon: <TbBrandDeliveroo size={20} />,
    val: "200",
  },
  {
    title: "In Progress",
    icon: <TbProgress size={20} />,
    val: "656",
  },
];

const tableHeaders = [
  "Order ID",
  "Created at",
  "Customer",
  "Priority",
  "Total",
  "Payment Status",
  "Items",
  "Delivery Number",
  "Order Status",
  "Action",
];

export default function Orders() {
  return (
    <div className="font-primary w-full">
      <NavBar title="Orders" />

      <div className="my-2 grid w-full grid-cols-2 gap-3 py-5 lg:mt-10 lg:mb-5 lg:grid-cols-4">
        {views.map((view) => (
          <div
            key={view.title}
            className="flex w-full items-center justify-between gap-5 rounded-2xl bg-white px-7 py-4 shadow-sm/5"
          >
            <div className="flex flex-col items-start justify-start gap-1">
              <h2 className="text-xs font-medium sm:text-sm">{view.title}</h2>
              <p className="text-xl font-bold">{view.val}</p>
            </div>
            <div className="bg-orange/10 text-orange flex h-[40px] w-[40px] items-center justify-center rounded-2xl lg:h-[50px] lg:w-[50px]">
              {view.icon}
            </div>
          </div>
        ))}
      </div>

      {/* list */}
      {/* list */}
      <div className="my-5 flex w-full flex-col items-start justify-start rounded-xl bg-white py-2 shadow-sm/5 transition-all duration-1000">
        <div className="flex w-full items-center justify-between px-5 py-2 text-sm">
          <h2 className="font-medium">All Orders</h2>

          <div className="border-dark-gray/40 flex cursor-pointer items-center justify-end gap-2 rounded-md border px-3 py-2 text-xs">
            This Month <IoMdArrowDropdown size={18} />
          </div>
        </div>

        {/* Table */}
        {/* Header */}
        <div className="bg-light-gray/40 border-dark-gray/10 mt-3 grid w-full grid-cols-10 gap-1 rounded-md border-t border-b px-2 py-3 text-sm font-medium">
          {tableHeaders.map((item) => (
            <h3 className="text-xs" key={item}>
              {item}
            </h3>
          ))}
        </div>
        <TableOrderItem />
      </div>
    </div>
  );
}
