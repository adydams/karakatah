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

type Response = {
  success: boolean;
  user: User;
  token: string;
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userLogin: (email: string, password: string) => Promise<Response>;
  signUp: (params: CreateUserParams) => Promise<Response>;
  //   signUp: (name: string, email: string, phone: string, password: string) => Promise<any>;
  //   useGoogle: () => Promise<any>;
};

export const UserContext = createContext<UserContextType | null>(null);

// export const UserContext = createContext(null);
