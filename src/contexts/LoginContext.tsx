import React, { createContext } from "react";
import type { ApiLoginType } from "../libs/types";

export type LoginResponse = {
  success: boolean;
  token: string;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  provider: string | null;
  providerId: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type GetAdminByIdResponse = {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    roleId: string;
    provider: string | null;
    providerId: string | null;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
};

type LoginContextType = {
  adminId: string | undefined;
  role: string | undefined;
  user: UserType | null;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  login: ({ email, password }: ApiLoginType) => Promise<LoginResponse>;
  getAdmin: (id: string) => Promise<GetAdminByIdResponse>;
  // login: (email: string, password: string) => Promise<Response>;
};

export const LoginContext = createContext<LoginContextType | null>(null);
