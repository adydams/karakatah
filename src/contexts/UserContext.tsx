import { createContext } from "react";
// import { login } from "../services/apiAuth";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
};

type loginResponse = {
  success: boolean;
  user: User;
  token: string;
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userLogin: (email: string, password: string) => Promise<loginResponse>;
  //   signUp: (name: string, email: string, phone: string, password: string) => Promise<any>;
  //   useGoogle: () => Promise<any>;
};

export const UserContext = createContext<UserContextType | null>(null);

// export const UserContext = createContext(null);
