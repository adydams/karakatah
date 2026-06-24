// import { useEffect, type ReactNode } from "react";

// import { useNavigate } from "react-router";
// import Spinner from "./Spinner";
// import { useLogin } from "../../contexts/hooks/useLogin";

// type ProtectedRouteProp = {
//   children: ReactNode;
// };

// export default function ProtectedRouteAdmin({ children }: ProtectedRouteProp) {
//   const { token } = useLogin();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) navigate("/sign-in");
//   }, [token, navigate]);

//   return token ? children : <Spinner type="big" />;
// }

import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import Spinner from "./Spinner";
import { useLogin } from "../../contexts/hooks/useLogin";
import { decodeToken } from "../../utils/utils";
import toast from "react-hot-toast";

type ProtectedRouteProp = {
  children: ReactNode;
};

export default function ProtectedRouteAdmin({ children }: ProtectedRouteProp) {
  const { token, getAdmin } = useLogin();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        if (!token) {
          navigate("/sign-in", { replace: true });
          return;
        }

        const tokenObj = decodeToken(token);

        if (!tokenObj?.id) {
          localStorage.removeItem("token");

          navigate("/sign-in", { replace: true });
          return;
        }

        // MUST throw if request fails
        const admin = await getAdmin(tokenObj.id);

        if (!admin?.success) {
          throw new Error("Failed to fetch admin");
        }

        setLoading(false);
      } catch (error) {
        console.error("Admin fetch failed:", error);
        toast.error("Unauthorized Access");

        localStorage.removeItem("token");

        navigate("/", {
          replace: true,
        });
      }
    }

    fetchAdmin();
  }, [token, getAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner type="big" />
      </div>
    );
  }

  return <>{children}</>;
}
