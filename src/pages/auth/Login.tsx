import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import Spinner from "../../components/Spinner";
import { z } from "zod";
import { useUser } from "../../contexts/hooks/useUser";
import SignUpWithGoogle from "../../components/SignUpWithGoogle";
// import { useEffect } from "react";

// type loginValues = {
//   email: string;
//   password: string;
//   // remember: boolean;
// };

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type TLoginSchema = z.infer<typeof loginSchema>;

export default function Login() {
  const { user, userLogin } = useUser();
  const navigate = useNavigate();
  console.log(user);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: TLoginSchema) {
    const { email, password } = data;
    // console.log(data);

    try {
      const success = await userLogin(email, password);

      if (success) {
        navigate("/");
        toast.success(`Welcome, ${success.user.name}`);
      } else {
        console.log("FAILED");
        toast.error("Login failed");
      }

      console.log(success);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred while logging in");
    }
  }

  return (
    <main className="lg:text-dark-gray/90 relative h-screen w-full items-center justify-between text-white lg:flex">
      {/* <Link
        to="/"
        className="text-orange font-primary absolute top-5 right-5 text-sm font-extrabold lg:text-lg"
      >
        Karakata
      </Link> */}
      <div
        style={{
          backgroundImage: 'url("/bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="h-full w-full lg:w-3/5"
      ></div>
      <div className="absolute top-10 flex w-full items-center justify-center p-4 lg:static lg:h-full lg:w-[40%] lg:p-10">
        <div className="flex w-full flex-col items-center justify-center">
          <h1 className="font-primary text-muted-green text-4xl font-bold">
            Welcome back!
          </h1>
          <p className="text-sm">
            Enter your credentials to access your account
          </p>

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
              <input
                className="bg-light-gray border-dark-gray/20 text-dark-gray/70 focus:bg-light-gray/60 focus:text-dark-gray/90 w-full rounded-lg border px-5 py-2.5 text-xs transition-all duration-700 focus:outline-0"
                type="password"
                placeholder="8+ characters"
                id="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{`${errors.password.message}`}</p>
              )}
            </div>

            {/* <div className="relative flex items-center justify-start gap-2">
              <input
                type="checkbox"
                value="true"
                id="remember"
                {...register("remember")}
              />
              <label className="text-xs" htmlFor="remember">
                Keep me Logged in
              </label>
              {errors.remember && (
                <p className="text-xs text-red-500">{`${errors.remember.message}`}</p>
              )}
            </div> */}

            <button className="bg-muted-green/90 hover:bg-muted-green w-full cursor-pointer rounded-2xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-500">
              {isSubmitting ? <Spinner size="small" /> : "Login"}
            </button>
          </form>

          <hr className="border-dark-gray/5 my-10 w-full rounded-full border" />

          <div className="flex w-full flex-col items-center">
            <SignUpWithGoogle isSubmitting={isSubmitting} />

            <p className="mt-[10px] text-xs">
              Don't have an account?{" "}
              <Link className="text-orange font-medium" to="/register">
                Sign up
              </Link>
            </p>

            <Link
              to="/"
              className="text-muted-green font-primary mt-3 text-xs font-medium lg:text-lg"
            >
              Karakata
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
