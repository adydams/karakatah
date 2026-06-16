import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";
import { sellarSchema, type TsellarSchema } from "../types/formSchema";
import Spinner from "../components/Spinner";
import { createSeller } from "../services/apiAuth";

export default function BecomeSeller() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TsellarSchema>({
    resolver: zodResolver(sellarSchema),
  });

  async function onSubmit(data: TsellarSchema) {
    const { name, email, phone } = data;

    try {
      const success = await createSeller({ name, email, phone });

      if (success) {
        console.log(success)
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
            Plug into a platform built for your growth
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
            {/* <div className="flex flex-col items-start justify-center space-y-1">
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
            </div> */}

            <button className="bg-muted-green/90 hover:bg-muted-green w-full cursor-pointer rounded-2xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-500">
              {isSubmitting ? <Spinner size="small" /> : "Become a Seller"}
            </button>
          </form>

          <hr className="border-dark-gray/5 my-10 w-full rounded-full border" />
        </div>
      </div>
    </main>
  );
}
