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

  // Decode token and get the user's id
  const tokenObj = decodeToken(token);

  let adminId: string | undefined;
  let role: string | undefined;

  if (token) {
    adminId = tokenObj?.id;
    role = tokenObj?.role;
  }

  async function login({ email, password }: ApiLoginType) {
    try {
      const data = await AdminLogin({ email, password });

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
