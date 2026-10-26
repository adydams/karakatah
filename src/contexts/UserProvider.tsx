import { useEffect, useState, type ReactNode } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  async function userLogin(email: string, password: string) {
    try {
      const data = await login(email, password);
      if (data.success) {
        localStorage.setItem("token", data.token);
        await getCurrentUser();
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
      setUser(null);
      localStorage.removeItem("token");
      return { success: false, message: "Failed to load user" };
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("token");
  }

  return (
    <UserContext.Provider
      value={{ user, userLogin, setUser, signUp, getCurrentUser, logout, isLoading }}
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
