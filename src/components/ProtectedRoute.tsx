import { useEffect, type ReactNode } from "react";
// import { useLogin } from "../contexts/hooks/useLogin";
import { useNavigate } from "react-router";
import Spinner from "./Spinner";
import { useUser } from "../contexts/hooks/useUser";

type ProtectedRouteProp = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProp) {
  const { user } = useUser();
  console.log("ProtectedRoute user:", user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  return user ? children : <Spinner size="big" />;
}
