import { useEffect, type ReactNode } from "react";
import { useUser } from "../contexts/hooks/useUser";
import { useNavigate } from "react-router";
import Spinner from "./Spinner";

type GuestOnlyProp = {
  children: ReactNode;
};

export default function GuestOnly({ children }: GuestOnlyProp) {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  //   if (!user)
  //     return (
  //       <div className="flex h-full w-full items-center justify-center">
  //         <Spinner size="big" />
  //       </div>
  //     );
  return !user ? (
    children
  ) : (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner size="big" />
    </div>
  );
}
