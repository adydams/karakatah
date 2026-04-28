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
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/home");
  }, [user, navigate]);

  return user ? children : <Spinner size="big" />;
}
