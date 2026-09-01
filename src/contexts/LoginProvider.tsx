import { useState, useCallback, useMemo, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { LoginContext, type LoginContextType, type UserType } from "./LoginContext";
import type { ApiLoginType } from "../libs/types";
import { decodeToken } from "../utils/utils";
import { AdminLogin, getAdminById } from "../services/adminDashboard/apiAuth";
import axios from "axios";

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

  const setToken: Dispatch<SetStateAction<string | null>> = useCallback((nextValue) => {
    setTokenState((previous) => {
      const resolved = typeof nextValue === "function" ? nextValue(previous) : nextValue;
      try {
        if (resolved) localStorage.setItem("token", resolved);
        else localStorage.removeItem("token");
      } catch {}
      return resolved;
    });
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
        if (data) setUser(data.user as UserType);
        return data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
        throw Error("Failed to get user details");
      }
    },
    [tokenState],
  );

  const logout = useCallback(async () => {
    try {
      if (tokenState) {
        await axios.post(
          `${process.env.VITE_API_URL}/api/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${tokenState}` } }
        );
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      setToken(null);
      setUser(null);
      window.location.href = "/login";
    }
  }, [tokenState, setToken]);

  const value = useMemo<LoginContextType>(
    () => ({
      token: tokenState,
      setToken,
      login,
      getAdmin,
      logout,
      user,
      adminId,
      role,
    }),
    [tokenState, setToken, login, getAdmin, logout, user, adminId, role],
  );

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
}
