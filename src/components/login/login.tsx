"use client";
import loginImg from "@/assets/loginImg.jpg";
import logo from "@/assets/logo.svg";
import { loginFrom, loginSchema } from "@/schema/login/loginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/lib/store/hooks";
import { AppDispatch } from "@/lib/store/store";
import { useCallback, useEffect, useState } from "react";
import { adminLogin } from "@/lib/features/auth/adminAuthApi";
import { fetchDashboard } from "@/lib/features/dashboard/dashboardApi";
import { useRouter } from "next/navigation";
import { setRememberMe, setRememberMeEmail, getRememberMeEmail, getRememberMe, clearRememberMe } from "@/utils/rememberMe";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const dispatch = useAppDispatch<AppDispatch>();
  const router = useRouter();
  const [rememberMe, setRememberMeChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: {  isSubmitting, errors },
  } = useForm<loginFrom & { rememberMe?: boolean }>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Check for remember me data on component mount
  useEffect(() => {
    const rememberedEmail = getRememberMeEmail();
    const rememberedData = getRememberMe();
    
    // Pre-fill email if available
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setRememberMeChecked(true);
    }
    
    // If valid remember me token exists, auto-login
    if (rememberedData && rememberedData.token) {
      // Restore session token
      localStorage.setItem("token", rememberedData.token);
      localStorage.setItem("user", rememberedData.userData);
      
      // Try to parse user data and restore auth state
      try {
        const userData = JSON.parse(rememberedData.userData);
        if (userData?.id && userData?.email) {
          // Redirect to dashboard - AuthHydrator will handle state restoration
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Error parsing remembered user data:", error);
        clearRememberMe();
      }
    }
  }, [setValue, router]);

  const onSubmit = useCallback(
    async (payload: loginFrom) => {
      const response = await dispatch(adminLogin(payload));
      if (adminLogin.fulfilled.match(response)) {
        const token = response?.payload?.token;
        const user = response?.payload;
        
        // Ensure we have valid user data before storing
        if (!user?.id || !user?.email) {
          console.error("Invalid user data received from login API");
          return;
        }

        // Create user data object matching IAdmin interface structure
        const userData = JSON.stringify({
          id: user.id,
          name: user.name || "",
          email: user.email,
          role: user.role || { id: "", name: "" },
          permissions: user.role?.permissions || undefined,
        });

        // Store session token (always stored)
        localStorage.setItem("token", token);
        localStorage.setItem("user", userData);
        localStorage.setItem("userId", JSON.stringify(user?.id || ""));

        // If remember me is checked, store with 30-day expiry
        if (rememberMe) {
          setRememberMe(token, userData);
          setRememberMeEmail(payload.email);
        } else {
          // Clear remember me if unchecked
          clearRememberMe();
        }

        await dispatch(fetchDashboard());

        router.replace("/dashboard");
      }
    },
    [dispatch, rememberMe, router]
  );

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="max-lg:hidden relative w-2/3 h-full overflow-hidden">
        <div className="w-full h-full">
          <div className="z-10 w-full h-full">
            <img
              src={loginImg.src}
              alt="login"
              className="h-full w-full object-cover"
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

      <div className="bg-[#F5F5FA] w-full h-full lg:w-1/3 lg:px-12 lg:py-8 flex items-center justify-center overflow-auto">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 text-black flex flex-col shadow-lg box-border">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6 w-full">
            {/* Logo */}
            <div className="flex justify-center mb-2">
              <img src={logo.src} alt="login-img" className="h-16 w-auto" />
            </div>

            {/* Email Field */}
            <fieldset className="border border-black px-3 py-2 rounded-md min-h-[56px] flex flex-col justify-center">
              <legend className="text-sm px-1 text-black font-medium">
                Email Address <span className="text-red-500">*</span>
              </legend>
              <input
                type="email"
                id="email"
                {...register("email")}
                placeholder="Enter email"
                className="w-full outline-none pt-1 pb-1 text-base placeholder:text-gray-400"
              />
            </fieldset>

            {/* Password Field */}
            <fieldset className="border border-black px-3 py-2 rounded-md min-h-[56px] flex flex-col justify-center relative">
              <legend className="text-sm px-1 text-black font-medium">
                Password <span className="text-red-500">*</span>
              </legend>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  placeholder="Enter password"
                  className="w-full outline-none pt-1 pb-1 pr-8 text-base placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-black hover:text-black/70 focus:outline-none transition-colors flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="stroke-current" />
                  ) : (
                    <Eye size={18} className="stroke-current" />
                  )}
                </button>
              </div>
            </fieldset>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMeChecked(e.target.checked)}
                className="w-4 h-4 border border-black rounded cursor-pointer focus:ring-2 focus:ring-black focus:ring-offset-0 accent-black flex-shrink-0"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-black cursor-pointer select-none font-normal"
              >
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black w-full text-white rounded-md py-3 px-4 font-medium text-base disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 mt-2"
            >
              {isSubmitting ? "Submitting..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
