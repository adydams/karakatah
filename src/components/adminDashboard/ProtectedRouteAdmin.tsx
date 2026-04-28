import { useEffect, type ReactNode } from "react";

import { useNavigate } from "react-router";
import Spinner from "./Spinner";
import { useLogin } from "../../contexts/hooks/useLogin";

type ProtectedRouteProp = {
  children: ReactNode;
};

export default function ProtectedRouteAdmin({ children }: ProtectedRouteProp) {
  const { token } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/sign-in");
  }, [token, navigate]);

  return token ? children : <Spinner type="big" />;
}
