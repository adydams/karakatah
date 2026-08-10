export const ROOT_URL = "http://localhost:5000";//"https://karakatanodebe.onrender.com";
export interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface BecomeSellerParams {
  name: string;
  email: string;
  phone: string;
  // password: string;
}

// SIGN UP
export async function createUser(params: CreateUserParams) {
  try {
    const response = await fetch(`${ROOT_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    // Check if the response is OK (2xx)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    // Parse JSON
    const data = await response.json();

    return data;

    // return data; // e.g. { success: true, user: {...}, token: "..." }
  } catch (err) {
    console.error("Create user failed:", err);
    throw err; // rethrow so the caller can handle
  }
}

// LOGIN
export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${ROOT_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    // Check if the response is OK
    if (!response.ok) {
      throw new Error("Login failed");
    }

    // Parse JSON
    const data = await response.json();

    return data;
  } catch (err) {
    console.error("Login failed", err);
    // return err
    throw err; // rethrow so the caller can handle
  }
}

export function googleAuth() {
  window.location.href = `${ROOT_URL}/api/auth/google`;
}

// GET CURRENT USER
import axiosInstance from "./apiClient";
export async function currentUser() {
  try {
    const response = await axiosInstance.get(`/api/auth/me`);
    return response.data;
  } catch (err) {
    console.error("Fetch current user failed:", err);
    throw err;
  }
}

// SIGN UP AS A SELLER
export async function createSeller(params: BecomeSellerParams) {
  try {
    const response = await fetch(`${ROOT_URL}/api/admin/onboard-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    // Check if the response is OK (2xx)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    // Parse JSON
    const data = await response.json();

    return data;

    // return data; // e.g. { success: true, user: {...}, token: "..." }
  } catch (err) {
    console.error("Create user failed:", err);
    throw err; // rethrow so the caller can handle
  }
}
