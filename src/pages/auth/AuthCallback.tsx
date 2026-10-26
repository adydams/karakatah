import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useUser } from "../../contexts/hooks/useUser";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getCurrentUser } = useUser();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");

      if (!token) {
        toast.error("Authentication failed: No token provided");
        navigate("/login");
        return;
      }

      try {
        // Save token to local storage
        localStorage.setItem("token", token);

        // Fetch user data to populate context
        const res = await getCurrentUser();

        if (res.success) {
          toast.success("Welcome back!");
          navigate("/");
        } else {
          throw new Error(res.message || "Failed to synchronize user data");
        }
      } catch (err: any) {
        console.error("OAuth Callback Error:", err);
        toast.error(err.message || "An error occurred during authentication");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    handleCallback();
  }, [searchParams, navigate, getCurrentUser]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      <Spinner size="big" />
      <p className="mt-4 text-sm text-gray-500 font-medium">Completing authentication...</p>
    </div>
  );
}
