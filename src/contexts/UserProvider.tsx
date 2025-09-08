import { useState, type ReactNode } from "react";
import {
  createUser,
  currentUser,
  login,
  type CreateUserParams,
} from "../services/apiAuth";
import { UserContext, type User } from "./UserContext";
// import { data } from "react-router";

type UserProviderProp = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProp) {
  const [user, setUser] = useState<User | null>(null);

  async function userLogin(email: string, password: string) {
    try {
      const data = await login(email, password);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw Error("Login failed");
    }
  }

  async function signUp(params: CreateUserParams) {
    try {
      const data = await createUser(params);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw Error("Sign Up failed");
    }
  }

  async function getCurrentUser() {
    try {
      const data = await currentUser();

      if (data.success) {
        setUser(data.user);
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw Error("No Current User");
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("token");
  }

  return (
    <UserContext.Provider
      value={{ user, userLogin, setUser, signUp, getCurrentUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

// // ✅ login and update context
//   async function userLogin(email: string, password: string) {
//     try {
//       const data = await login(email, password);
//       if (data.user) {
//         setUser(data.user);
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         throw new Error(error.message);
//       }
//       throw new Error("An unknown error occurred");
//     }
//   }

//   // ✅ logout clears storage + state
//   function userLogout() {
//     logout();
//     setUser(null);
//   }

//   // ✅ fetch current user from backend
//   async function fetchCurrentUser() {
//     try {
//       const data = await currentUser();
//       if (data.user) {
//         setUser(data.user);
//       }
//     } catch (error) {
//       console.error("Failed to fetch current user:", error);
//       setUser(null);
//     }
//   }
