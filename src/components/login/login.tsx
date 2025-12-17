"use client";
import loginImg from "@/assets/loginImg.jpg";
import logo from "@/assets/logo.svg";
import { loginFrom, loginSchema } from "@/schema/login/loginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { isDirty, isLoading, isSubmitSuccessful, errors },
  } = useForm<loginFrom>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (payload: loginFrom) => {
    console.log(payload);
  };
  return (
    <div className="flex ">
      <div className="max-lg:hidden relative w-2/3 h-dvh">
        <div className="">
          <div className="z-10">
            <img
              src={loginImg.src}
              alt="login"
              className="h-dvh object-cover"
            />
          </div>
          <div className="absolute z-30 bottom-20 left-20">
            <h1 className="font-bold text-6xl text-white">Milke Khareedo</h1>
            <p className="font-medium text-2xl text-white">
              From dreaming to owning - we make the process easy and achievable
            </p>
          </div>
        </div>
        <div className="z-20 w-full h-full absolute bottom-0 bg-linear-to-t from-black  to-transparent"></div>
        <div className="z-20 w-full h-full absolute bottom-0 bg-linear-to-t from-black/50  to-transparent"></div>
      </div>

      <div className=" bg-[#F5F5FA] w-full h-svh lg:w-1/3 lg:px-12.5 flex items-center justify-center">
        <div className="w-md h-90 bg-white border-black rounded-4xl py-8  px-6 text-black flex flex-col">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <img src={logo.src} alt="login-img" className="h-16 mx-auto" />
            <fieldset className="border border-black px-3 rounded-md">
              <legend className="text-sm px-1">
                Email Address <span className="text-red-500">*</span>
              </legend>
              <input
                type="email"
                id="email"
                {...register("email")}
                placeholder="Enter email"
                className="w-full outline-none pb-2"
              />
            </fieldset>

            <fieldset className="border border-black px-3 rounded-md">
              <legend className="text-sm px-1">
                Password <span className="text-red-500">*</span>
              </legend>
              <input
                type="text"
                id="password"
                {...register("password")}
                placeholder="Enter password"
                className="w-full outline-none pb-2"
              />
            </fieldset>

            <button
              type="submit"
              className="bg-black w-full text-white rounded-md py-3 font-medium"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
