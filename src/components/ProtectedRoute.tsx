import { useEffect, type ReactNode } from "react";
// import { useLogin } from "../contexts/hooks/useLogin";
import { useNavigate } from "react-router";
import Spinner from "./Spinner";
import { useUser } from "../contexts/hooks/useUser";

type ProtectedRouteProp = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProp) {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <Spinner size="big" />;
  }

  return user ? children : null;
}
