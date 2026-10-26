import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Spinner from "../../components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../../contexts/hooks/useUser";
import toast from "react-hot-toast";
import SocialLogin from "../../components/SocialLogin";
import AuthSideImage from "../../components/AuthSideImage";
import { signUpSchema, type TSignUpSchema } from "../../types/formSchema";
import PasswordField from "../../components/ui/PasswordField";


export default function Register() {
  const { signUp } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data: TSignUpSchema) {
    const { name, email, phone, password } = data;

    try {
      const success = await signUp({ name, email, phone, password });

      if (success) {
        toast.success(`Account creation is successful`);
        navigate("/login");
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
      <AuthSideImage className="h-full w-full lg:w-1/2" />
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2 bg-white text-dark-gray">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Top Logo */}
          <div className="w-full flex justify-end mb-12">
            <Link to="/" className="text-muted-green font-primary text-xl font-bold">
              Karakata
            </Link>
          </div>

          <h1 className="font-primary text-muted-green text-4xl font-bold text-center">
            Get Started Now
          </h1>
          <p className="text-gray-500 text-sm text-center mt-2 mb-10">
            Create your account to join the community
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div className="flex flex-col items-start space-y-1">
              <label className="text-sm font-medium text-gray-600" htmlFor="name">
                Name
              </label>
              <input
                className="bg-white border-gray-300 text-dark-gray w-full rounded-full border px-5 py-3 text-sm transition-all focus:border-muted-green focus:ring-1 focus:ring-muted-green outline-none"
                type="text"
                placeholder="Enter your name"
                id="name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{`${errors.name.message}`}</p>
              )}
            </div>
            <div className="flex flex-col items-start space-y-1">
              <label className="text-sm font-medium text-gray-600" htmlFor="email">
                Email address
              </label>
              <input
                className="bg-white border-gray-300 text-dark-gray w-full rounded-full border px-5 py-3 text-sm transition-all focus:border-muted-green focus:ring-1 focus:ring-muted-green outline-none"
                type="email"
                placeholder="Enter your mail"
                id="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{`${errors.email.message}`}</p>
              )}
            </div>
            <div className="flex flex-col items-start space-y-1">
              <label className="text-sm font-medium text-gray-600" htmlFor="phone">
                Phone Number
              </label>
              <input
                className="bg-white border-gray-300 text-dark-gray w-full rounded-full border px-5 py-3 text-sm transition-all focus:border-muted-green focus:ring-1 focus:ring-muted-green outline-none"
                type="text"
                placeholder="Enter your phone number"
                id="phone"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{`${errors.phone.message}`}</p>
              )}
            </div>
            <PasswordField
              label="Password"
              placeholder="Enter your password"
              id="password"
              error={errors.password?.message}
              className="bg-white border-gray-300 text-dark-gray w-full rounded-full border px-5 py-3 text-sm transition-all focus:border-muted-green focus:ring-1 focus:ring-muted-green outline-none"
              {...register("password")}
            />

            <button className="bg-muted-green hover:bg-muted-green/90 w-full cursor-pointer rounded-full px-5 py-3 text-sm font-bold text-white transition-all shadow-md">
              {isSubmitting ? <Spinner size="small" /> : "Sign up"}
            </button>
          </form>

          <div className="w-full mt-8 flex flex-col items-center space-y-6">
            <SocialLogin isSubmitting={isSubmitting} status="up" />

            <p className="text-sm text-gray-600">
              Have an account?{" "}
              <Link className="text-orange font-medium hover:underline" to="/login">
                Sign in
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
