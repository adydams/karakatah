import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import Spinner from "../../components/Spinner";
import { useUser } from "../../contexts/hooks/useUser";
import SignUpWithGoogle from "../../components/SignUpWithGoogle";
import AuthSideImage from "../../components/AuthSideImage";
import { loginSchema, type TLoginSchema } from "../../types/formSchema";

export default function Login() {
  const { userLogin } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: TLoginSchema) {
    const { email, password } = data;

    try {
      const response = await userLogin(email, password);

      if (response.success) {
        navigate("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast("An unexpected error occurred");
      }
    }
  }

  return (
    <main className="relative h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Left Side: Dynamic Product Image */}
      <AuthSideImage className="h-full w-full lg:w-1/2" />

      {/* Right Side: Login Form */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2 bg-white text-dark-gray">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Top Logo */}
          <div className="w-full flex justify-end mb-12">
            <Link to="/" className="text-muted-green font-primary text-xl font-bold">
              Karakata
            </Link>
          </div>

          <h1 className="font-primary text-muted-green text-4xl font-bold text-center">
            Welcome back!
          </h1>
          <p className="text-gray-500 text-sm text-center mt-2 mb-10">
            Enter your credentials to access your account
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div className="flex flex-col items-start space-y-1">
              <label className="text-sm font-medium text-gray-600" htmlFor="email">
                Email address
              </label>
              <input
                className="bg-white border-gray-300 text-dark-gray w-full rounded-full border px-5 py-3 text-sm transition-all focus:border-muted-green focus:ring-1 focus:ring-muted-green outline-none"
                type="email"
                placeholder="tolu@karakata.com"
                id="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{`${errors.email.message}`}</p>
              )}
            </div>

            <div className="flex flex-col items-start space-y-1">
              <label className="text-sm font-medium text-gray-600" htmlFor="password">
                Password
              </label>
              <input
                className="bg-white border-gray-300 text-dark-gray w-full rounded-full border px-5 py-3 text-sm transition-all focus:border-muted-green focus:ring-1 focus:ring-muted-green outline-none"
                type="password"
                placeholder="••••••••"
                id="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{`${errors.password.message}`}</p>
              )}
            </div>

            <button className="bg-muted-green hover:bg-muted-green/90 w-full cursor-pointer rounded-full px-5 py-3 text-sm font-bold text-white transition-all shadow-md">
              {isSubmitting ? <Spinner size="small" /> : "Login"}
            </button>
          </form>

          <div className="w-full mt-8 flex flex-col items-center space-y-6">
            <SignUpWithGoogle isSubmitting={isSubmitting} status="in" />

            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link className="text-orange font-medium hover:underline" to="/register">
                Sign up
              </Link>
            </p>

            <Link
              to="/"
              className="text-muted-green font-primary text-lg font-bold"
            >
              Karakata
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
