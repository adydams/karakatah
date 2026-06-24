import { useState, type ReactNode } from "react";
import { LoginContext, type UserType } from "./LoginContext";
import type { ApiLoginType } from "../libs/types";
import { decodeToken } from "../utils/utils";
import { AdminLogin, getAdminById } from "../services/adminDashboard/apiAuth";

type LoginProviderProp = {
  children: ReactNode;
};

// type tokenProp = {
//   token: string | null;
// };

export function LoginProvider({ children }: LoginProviderProp) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  // const [adminId, setAdminId] = useState<string | undefined>();
  // const [role, setRole] = useState<string | undefined>();

  // const navigate = useNavigate();

  // // Decode token and get the user's id
  const tokenObj = decodeToken(token);

  let adminId: string | undefined;
  let role: string | undefined;

  if (token) {
    adminId = tokenObj?.id;
    role = tokenObj?.role;
  }

  // useEffect(() => {
  //   if (!token) {
  //     setAdminId(undefined);
  //     setRole(undefined);
  //     navigate("/sign-in");
  //     return;
  //   }

  //   const tokenObj = decodeToken(token);

  //   setAdminId(tokenObj?.id);
  //   setRole(tokenObj?.role);
  // }, [token, navigate]);

  // useEffect(() => {
  //   async function fetchAdmin() {
  //     if (!token) return;

  //     const tokenObj = decodeToken(token);

  //     if (!tokenObj?.id) return;

  //     try {
  //       const data = await getAdminById(tokenObj.id, token);

  //       if (data) {
  //         setUser(data.user);
  //       }
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         // toast.error(error.message);
  //         setToken(null);
  //       }
  //       throw Error("Login failed");
  //     }
  //   }

  //   fetchAdmin();
  // }, [token]);

  async function login({ email, password }: ApiLoginType) {
    try {
      const data = await AdminLogin({ email, password });
      console.log(data);

      if (data.success) {
        setToken(data.token);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw Error("Login failed");
    }
  }

  async function getAdmin(id: string) {
    if (!token) throw new Error("No token found");

    try {
      const data = await getAdminById(id, token);

      if (data) setUser(data.user);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw Error("Failed to get user details");
    }
  }

  // function decodeToken(token: string) {}

  return (
    <LoginContext.Provider
      value={{ token, setToken, login, getAdmin, user, adminId, role }}
    >
      {children}
    </LoginContext.Provider>
  );
}
