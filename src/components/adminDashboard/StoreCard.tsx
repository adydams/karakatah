import { FaStoreAlt } from "react-icons/fa";
import { NavLink } from "react-router";

type StoreCardProps = {
  name: string;
  // address: string;
  // phone: string;
  // email: string;
  // description: string;
  id: string;
};

// className={({ isActive }) =>
//                 isActive
//                   ? "text-orange border-orange border-r-4 font-medium"
//                   : "text-dark-gray/80"
//               }
//               style={{
//                 width: "100%",
//                 display: "flex",
//                 gap: "10px",
//                 justifyContent: "flex-start",
//                 alignItems: "center",
//                 padding: "10px 20px",
//                 fontSize: "0.8rem",
//                 margin: "6px 0",
//               }}
// className="hover:bg-dark-gray/5 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-3"
export default function StoreCard({
  name,
  // address,
  // email,
  // description,
  id,
}: StoreCardProps) {
  return (
    <NavLink
      to={`/dashboard/stores/${id}`}
      onClick={() => {
        if (window.innerWidth < 768) {
          setTimeout(() => {
            document.getElementById("store-details")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        }
      }}
      className={({ isActive }) =>
        isActive
          ? "bg-muted-green/15 font-bold shadow-lg"
          : "hover:bg-dark-gray/5 bg-white font-medium"
      }
      style={{
        padding: "12px",
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
      }}
    >
      <FaStoreAlt size={40} />
      <h2 className="text-sm">{name}</h2>
    </NavLink>
  );
}
