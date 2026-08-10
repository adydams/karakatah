import { useState, useCallback, useMemo, type ReactNode } from "react";
import { LoginContext, type UserType } from "./LoginContext";
import type { ApiLoginType } from "../libs/types";
import { decodeToken } from "../utils/utils";
import { AdminLogin, getAdminById } from "../services/adminDashboard/apiAuth";

type LoginProviderProp = {
  children: ReactNode;
};

export function LoginProvider({ children }: LoginProviderProp) {
  const [tokenState, setTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<UserType | null>(null);

  const tokenObj = decodeToken(tokenState);
  const adminId: string | undefined = tokenState ? tokenObj?.id : undefined;
  const role: string | undefined = tokenState ? tokenObj?.role : undefined;

  const setToken = useCallback((t: string | null) => {
    setTokenState(t);
    try {
      if (t) localStorage.setItem("token", t);
      else localStorage.removeItem("token");
    } catch {}
  }, []);

  const login = useCallback(
    async ({ email, password }: ApiLoginType) => {
      try {
        const data = await AdminLogin({ email, password });
        if (data.success) setToken(data.token);
        return data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
        throw Error("Login failed");
      }
    },
    [setToken],
  );

  const getAdmin = useCallback(
    async (id: string) => {
      if (!tokenState) throw new Error("No token found");

      try {
        const data = await getAdminById(id, tokenState);
        if (data) setUser(data.user);
        return data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
        throw Error("Failed to get user details");
      }
    },
    [tokenState],
  );

  const value = useMemo(
    () => ({
      token: tokenState,
      setToken,
      login,
      getAdmin,
      user,
      adminId,
      role,
    }),
    [tokenState, setToken, login, getAdmin, user, adminId, role],
  );

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
}
