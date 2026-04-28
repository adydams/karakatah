import { Link, useNavigate } from "react-router";

import { useState } from "react";
import { FaRegEye } from "react-icons/fa6";
import { IoEyeOffOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";
import Spinner from "../../components/adminDashboard/Spinner";
import SignUpWithGoogle from "../../components/adminDashboard/SignUpWithGoogle";
import { useLogin } from "../../contexts/hooks/useLogin";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password is too short"),
});

type TSignUpSchema = z.infer<typeof signUpSchema>;

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useLogin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data: TSignUpSchema) {
    // const success = await login(data);

    // if (success) {
    //   navigate("/");
    // } else {
    //   toast.error("Login failed");

    // }
    try {
      const success = await login(data);

      if (success) {
        navigate("/dashboard");
        // toast.success("Category Added Successfully");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast("An unexpected error occurred");
      }
    }
  }

  function hidePassword() {
    setShowPassword((pass) => !pass);
  }

  return (
    <main
      style={{
        backgroundImage: "url('images/cashless.jpg')",
        backgroundSize: "cover",
      }}
      className="flex h-screen w-full items-center justify-end px-4 lg:px-32"
    >
      <div className="flex h-screen w-[600px] flex-col items-center justify-center">
        <h1 className="font-primary text-4xl font-bold">Welcome back!</h1>
        <p className="text-sm">Enter your credentials to access your account</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-7 w-full space-y-5"
        >
          <div className="flex flex-col items-start justify-center space-y-1">
            <label className="text-sm font-medium" htmlFor="email">
              Email address
            </label>
            <input
              className="bg-light-gray border-dark-gray/20 text-dark-gray/70 focus:bg-light-gray/60 focus:text-dark-gray/90 w-full rounded-lg border px-5 py-2.5 text-xs transition-all duration-700 focus:outline-0"
              type="email"
              placeholder="Enter your mail"
              id="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{`${errors.email.message}`}</p>
            )}
          </div>
          <div className="relative flex flex-col items-start justify-center space-y-1">
            <label className="text-sm font-medium" htmlFor="email">
              Password
            </label>
            <div className="relative w-full">
              <input
                className="bg-light-gray border-dark-gray/20 text-dark-gray/70 focus:bg-light-gray/60 focus:text-dark-gray/90 w-full rounded-lg border px-5 py-2.5 text-xs transition-all duration-700 focus:outline-0"
                type={`${showPassword ? "text" : "password"}`}
                placeholder="8+ characters"
                id="password"
                {...register("password")}
              />
              <div className="absolute top-1/2 right-5 bottom-0 m-auto -translate-y-1/2">
                {showPassword ? (
                  <FaRegEye
                    onClick={hidePassword}
                    className="cursor-pointer text-gray-400"
                  />
                ) : (
                  <IoEyeOffOutline
                    onClick={hidePassword}
                    className="cursor-pointer text-gray-400"
                  />
                )}
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{`${errors.password.message}`}</p>
              )}
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="bg-muted-green/90 hover:bg-muted-green disabled:bg-muted-green/70 w-full cursor-pointer rounded-2xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-500 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Spinner type="small" /> : "Login"}
          </button>
        </form>

        <hr className="border-dark-gray/5 my-10 w-full rounded-full border" />

        <div className="flex w-full flex-col items-center">
          <SignUpWithGoogle isSubmitting={false} status="in" />

          {/* <p className="mt-[10px] text-xs">
            Don't have an account?{" "}
            <Link className="text-orange font-medium" to="/register">
              Sign up
            </Link>
          </p> */}

          <Link
            to="/"
            className="text-muted-green font-primary mt-3 text-xs font-medium lg:text-lg"
          >
            Karakata
          </Link>
        </div>
      </div>
    </main>
  );
}
