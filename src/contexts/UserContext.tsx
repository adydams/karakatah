import { createContext } from "react";
import type { CreateUserParams } from "../services/apiAuth";
// import { login } from "../services/apiAuth";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
};

type AuthResponse = {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userLogin: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (params: CreateUserParams) => Promise<AuthResponse>;
  getCurrentUser: () => Promise<AuthResponse>;
  logout: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);

// export const UserContext = createContext(null);
