import { FcGoogle } from "react-icons/fc";
import { googleAuth } from "../services/apiAuth";

export default function SignUpWithGoogle({
  isSubmitting,
  status,
}: {
  isSubmitting: boolean;
  status: string;
}) {
  return (
    <button
      onClick={googleAuth}
      className="border-light-gray/20 lg:border-dark-gray/20 lg:text-dark-gray/70 flex cursor-pointer items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-xs font-medium text-white"
      disabled={isSubmitting}
    >
      <FcGoogle size={20} />
      Sign {status} with Google
    </button>
  );
}
