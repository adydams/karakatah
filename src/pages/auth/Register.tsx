import { Link } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import Spinner from "../../components/Spinner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../../contexts/hooks/useUser";
import toast from "react-hot-toast";

// type signUpValues = {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
// };

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"), // supports intl format
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type TSignUpSchema = z.infer<typeof signUpSchema>;

export default function Register() {
  const { signUp } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data: TSignUpSchema) {
    const { name, email, phone, password } = data;
    console.log(data,"onSubmit")
    const success = await signUp({name, email, phone, password});

    if (success) {

      toast.success(`Account creation is successful`);
    } else {
      toast.error("Account creation  failed");
    }
  }

  return (
    <main className="lg:text-dark-gray/90 relative h-screen w-full items-center justify-between text-white lg:flex">
      {/* <Link
        to="/"
        className="text-orange font-primary absolute top-5 right-5 text-xs font-extrabold lg:text-lg"
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
      <div className="absolute top-10 flex w-full items-center justify-center px-4 lg:static lg:h-full lg:w-[40%] lg:p-10">
        <div className="flex w-full flex-col items-center justify-center">
          <h1 className="font-primary text-muted-green text-4xl font-bold">
            Get Started Now
          </h1>
          {/* <p className="text-sm">
            Enter your credentials to access your account
          </p> */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-7 w-full space-y-5"
          >
            <div className="flex flex-col items-start justify-center space-y-1">
              <label className="text-sm font-medium" htmlFor="name">
                Name
              </label>
              <input
                className="bg-light-gray border-dark-gray/20 text-dark-gray/70 focus:bg-light-gray/60 focus:text-dark-gray/90 w-full rounded-lg border px-5 py-2.5 text-xs transition-all duration-700 focus:outline-0"
                type="text"
                placeholder="Enter your name"
                id="name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{`${errors.name.message}`}</p>
              )}
            </div>
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
            <div className="flex flex-col items-start justify-center space-y-1">
              <label className="text-sm font-medium" htmlFor="phone">
                Phone Number
              </label>
              <input
                className="bg-light-gray border-dark-gray/20 text-dark-gray/70 focus:bg-light-gray/60 focus:text-dark-gray/90 w-full rounded-lg border px-5 py-2.5 text-xs transition-all duration-700 focus:outline-0"
                type="text"
                placeholder="Enter your phone number"
                id="phone"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{`${errors.phone.message}`}</p>
              )}
            </div>
            <div className="flex flex-col items-start justify-center space-y-1">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                className="bg-light-gray border-dark-gray/20 text-dark-gray/70 focus:bg-light-gray/60 focus:text-dark-gray/90 w-full rounded-lg border px-5 py-2.5 text-xs transition-all duration-700 focus:outline-0"
                type="password"
                placeholder="Enter your mail"
                id="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{`${errors.password.message}`}</p>
              )}
            </div>

            {/* <div className="flex items-center justify-start gap-2">
              <input
                type="checkbox"
                name="remember"
                value="true"
                id="remember"
              />
              <label className="text-xs" htmlFor="remember">
                I agree to the terms and conditions
              </label>
            </div> */}

            <button className="bg-muted-green/90 hover:bg-muted-green w-full cursor-pointer rounded-2xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-500">
              {isSubmitting ? <Spinner size="small" /> : "Sign up"}
            </button>
          </form>

          <hr className="border-dark-gray/5 my-10 w-full rounded-full border" />

          <div className="flex w-full flex-col items-center">
            <button
              className="border-dark-gray/20 lg:text-dark-gray/70 flex cursor-pointer items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-xs font-medium text-white"
              disabled={isSubmitting}
            >
              <FcGoogle size={20} />
              Sign in with Google
            </button>

            <p className="mt-[10px] text-xs">
              Have an account?{" "}
              <Link className="text-orange font-medium" to="/login">
                Sign in
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
