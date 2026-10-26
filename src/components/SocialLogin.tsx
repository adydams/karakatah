import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import {
  googleAuth,
  facebookAuth,
  twitterAuth,
  instagramAuth
} from "../services/apiAuth";

type SocialLoginProps = {
  isSubmitting: boolean;
  status: string;
};

export default function SocialLogin({ isSubmitting, status }: SocialLoginProps) {
  const actionLabel = status === "up" ? "sign up" : "log in";

  const socialProviders = [
    {
      name: "Google",
      icon: <FcGoogle size={28} />,
      action: googleAuth,
      color: "hover:bg-gray-100",
    },
    {
      name: "Facebook",
      icon: <FaFacebook size={28} className="text-blue-600" />,
      action: facebookAuth,
      color: "hover:bg-blue-50",
    },
    {
      name: "X",
      icon: <FaTwitter size={26} className="text-black" />,
      action: twitterAuth,
      color: "hover:bg-gray-100",
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={28} className="text-pink-600" />,
      action: instagramAuth,
      color: "hover:bg-pink-50",
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-3 text-xs text-gray-500">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="whitespace-nowrap">Or {actionLabel} with</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="flex justify-center gap-4">
        {socialProviders.map((provider) => (
          <button
            key={provider.name}
            type="button"
            onClick={provider.action}
            aria-label={`${actionLabel} with ${provider.name}`}
            title={`${actionLabel} with ${provider.name}`}
            className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-muted-green focus:ring-offset-2 ${provider.color}`}
            disabled={isSubmitting}
          >
            {provider.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
