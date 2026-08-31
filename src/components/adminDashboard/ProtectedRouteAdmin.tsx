import React from "react";
import { Navigate, Outlet } from "react-router";
import { useLogin } from "../../contexts/hooks/useLogin";

export default function ProtectedRouteAdmin() {
  const { token, role } = useLogin();

  // Check if user is authenticated and has an admin role
  // Adjusted to check for common admin roles
  const isAdmin = role === "SuperAdmin" || role === "SystemAdmin" || role === "Admin";
  console.log("Admin Route Check - token:", !!token, "role:", role, "isAdmin:", isAdmin);


  if (!token || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
