import type { GetAdminByIdResponse, LoginResponse } from "../../contexts/LoginContext";
import type { ApiLoginType } from "../../libs/types";


export const ROOT_URL = "https://karakatanodebe.onrender.com";

export async function AdminLogin({
  email,
  password,
}: ApiLoginType): Promise<LoginResponse> {
  const response = await fetch(`${ROOT_URL}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

   const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.detail ||
        data?.error ||
        "The email or password you entered is incorrect. Please try again.",
    );
  }

  return data;
}

export async function getAdminById(
  id: string,
  token: string | null,
): Promise<GetAdminByIdResponse> {
  const response = await fetch(`${ROOT_URL}/api/admin/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to Fetch user details");
  }

  const data = await response.json();

  return data;
}
