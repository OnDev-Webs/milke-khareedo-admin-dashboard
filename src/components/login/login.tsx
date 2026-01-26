"use client";
import loginImg from "@/assets/loginImg.jpg";
import logo from "@/assets/logo1.png";
import { loginFrom, loginSchema } from "@/schema/login/loginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/lib/store/hooks";
import { AppDispatch } from "@/lib/store/store";
import { useCallback, useEffect, useState } from "react";
import { adminLogin } from "@/lib/features/auth/adminAuthApi";
import { useRouter } from "next/navigation";
import { setRememberMe, setRememberMeEmail, getRememberMeEmail, getRememberMe, clearRememberMe } from "@/utils/rememberMe";
import { Calculator, Eye, EyeOff } from "lucide-react";
import { PERMISSIONS } from "@/lib/permissions/permissionKeys";
import Mobile_url from "@/assets/mobile_url.svg";
import Phone from "@/assets/phone.svg";
import Sms from "@/assets/sms.svg";
import Image from "next/image";

const SIDEBAR_ORDER = [
  {
    url: "/dashboard",
    onlySuperAdmin: true,
  },
  {
    url: "/properties",
    permission: PERMISSIONS.PROPERTY.VIEW,
  },
  {
    url: "/developers",
    permission: PERMISSIONS.DEVELOPER.VIEW,
  },
  {
    url: "/lead-crm",
    permission: PERMISSIONS.CRM.VIEW,
  },
  {
    url: "/blogs",
    permission: PERMISSIONS.BLOGS.VIEW,
  },
  {
    url: "/settings",
    permission: PERMISSIONS.TEAM.VIEW,
  },
];
const getFirstAllowedRoute = (
  roleName: string,
  permissions?: Record<string, any>
) => {
  if (roleName === "Super Admin") {
    return "/dashboard";
  }
  for (const item of SIDEBAR_ORDER) {
    if (item.onlySuperAdmin) continue;

    if (item.permission) {
      const [module, action] = item.permission.split(".");
      if (permissions?.[module]?.[action]) {
        return item.url;
      }
    }
    if (!item.permission) {
      return item.url;
    }
  }
  return "/settings";
};

export default function Login() {
  const dispatch = useAppDispatch<AppDispatch>();
  const router = useRouter();
  const [rememberMe, setRememberMeChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<loginFrom & { rememberMe?: boolean }>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const desktopForm = useForm<loginFrom>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const mobileForm = useForm<loginFrom>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });


  const [isMobile, setIsMobile] = useState(false);
  const [mobileBlocked, setMobileBlocked] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);


  // Check for remember me data on component mount
  useEffect(() => {
    const rememberedEmail = getRememberMeEmail();
    const rememberedData = getRememberMe();

    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setRememberMeChecked(true);
    }

    if (rememberedData && rememberedData.token) {
      localStorage.setItem("token", rememberedData.token);
      localStorage.setItem("user", rememberedData.userData);

      try {
        const userData = JSON.parse(rememberedData.userData);
        if (userData?.id && userData?.email) {
          const roleName = userData?.role?.name;
          const permissions = userData?.permissions;
          const redirectUrl = getFirstAllowedRoute(roleName, permissions);
          router.replace(redirectUrl);
        }
      } catch (error) {
        console.error("Error parsing remembered user data:", error);
        clearRememberMe();
      }
    }
  }, [setValue, router]);

  const onSubmit = useCallback(async (payload: loginFrom) => {
    const response = await dispatch(adminLogin(payload));

    if (adminLogin.fulfilled.match(response)) {
      const user = response.payload;
      const roleName = user?.role?.name;

      // 🚫 MOBILE + ADMIN BLOCK
      if (
        isMobile &&
        (roleName === "Admin" || roleName === "Super Admin")
      ) {
        // session clean
        localStorage.clear();

        setMobileBlocked(true); // 👈 BAS YE
        return;
      }

      // ✅ NORMAL LOGIN FLOW (desktop ya allowed role)
      const token = user.token;

      const userData = JSON.stringify({
        id: user.id,
        name: user.name || "",
        email: user.email,
        role: user.role,
        permissions: user.role?.permissions,
      });

      localStorage.setItem("token", token);
      localStorage.setItem("user", userData);

      const redirectUrl = getFirstAllowedRoute(
        roleName,
        user.role?.permissions
      );

      router.replace(redirectUrl);
    }
  }, [dispatch, isMobile, router]);



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

      <div className="hidden lg:flex bg-[#F5F5FA] w-full h-full lg:w-1/3 lg:px-12 lg:py-8 flex items-center justify-center overflow-auto">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 text-black flex flex-col shadow-lg box-border">
          <form onSubmit={desktopForm.handleSubmit(onSubmit)} className="flex flex-col space-y-6 w-full">
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
                {...desktopForm.register("email")}
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
                  {...desktopForm.register("password")}
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
              disabled={desktopForm.formState.isSubmitting}
              className="bg-black w-full text-white rounded-md py-3 px-4 font-medium text-base disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 mt-2"
            >
              {isSubmitting ? "Submitting..." : "Continue"}
            </button>
          </form>
        </div>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="block lg:hidden w-full h-full bg-[#F5F5FA] px-5 py-10">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-full h-full flex flex-col justify-center rounded-2xl p-6">

            {mobileBlocked ? (
              <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden">

              {/* ===== TOP BAR ===== */}
              <div className="absolute top-0 left-0 right-0 flex items-center bg-white justify-between px-5 py-4 border-b z-30">
                <img src={logo.src} alt="logo" className="h-10" />
          
                <div className="w-9 h-9 flex items-center justify-center rounded-full border cursor-pointer">
                  <span className="text-xl">☰</span>
                </div>
              </div>
            
              {/* ===== CENTER CONTENT ===== */}
              <div className="flex flex-col items-center justify-center text-center px-6 gap-4 mt-24">

                {/* ICON */}
                <div className="w-[88px] h-[88px] rounded-full bg-[#FFFFFF] flex items-center justify-center">
                  <Image src={Mobile_url} alt="mobile url" width={40} height={40} />
                </div>
            
                <h2 className="text-[22px] font-semibold text-[#000000] leading-snug mb-4">
                  This URL is not accessible on mobile
                </h2>
              </div>
            
              {/* ===== BOTTOM ACTIONS ===== */}
              <div className="px-6 pb-6 space-y-5">
            
                {/* LOGIN BUTTON */}
                <button
                  disabled
                  className="w-full bg-[#000000] text-white py-3 rounded-md cursor-not-allowed"
                >
                  Login
                </button>
            
                {/* OR DIVIDER */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#E5E5E5]" />
                  <span className="text-[14px] font-normal text-[#000000]">or</span>
                  <div className="flex-1 h-px bg-[#E5E5E5]" />
                </div>
            
                {/* CONTACT TEXT */}
                <p className="text-[17px] font-normal text-center text-[#000000]">
                  Contact system administrator
                </p>
            
                {/* CALL / EMAIL BUTTONS */}
                <div className="flex gap-4">
                  <a
                    href="tel:+919999999999"
                    className="flex-1 bg-[#66AE39] text-[#FFFFFF] py-2 rounded-full text-center font-medium flex items-center justify-center gap-2"
                  >
                    <Image src={Phone} alt="call" width={16} height={16} />
                    Call
                  </a>
            
                  <a
                    href="mailto:admin@milkekhareedo.com"
                    className="flex-1 bg-white border border-[#F3F3F3] text-black py-2 rounded-full text-center font-medium flex items-center justify-center gap-2"
                  >
                    <Image src={Sms} alt="email" width={16} height={16} />
                    Email
                  </a>
                </div>
              </div>
            </div>
            

            ) : (
              // ✅ NORMAL MOBILE LOGIN FORM (existing)
              <>
                <div className="mb-10">
                  <img src={logo.src} alt="logo" className="h-24 mx-auto" />
                </div>

                <form
                  onSubmit={mobileForm.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* EMAIL */}
                  <fieldset className="border border-[#262626] px-3 py-2 rounded-md">
                    <legend className="text-sm">
                      Email Address <span className="text-[#DA1414]">*</span>
                    </legend>

                    <input
                      {...mobileForm.register("email")}
                      className="w-full outline-none placeholder:text-[#BABABA]"
                      placeholder="Enter here"
                    />
                  </fieldset>

                  {/* PASSWORD */}
                  <fieldset className="border border-[#262626] px-3 py-2 rounded-md relative">
                    <legend className="text-sm">
                      Password <span className="text-[#DA1414]">*</span>
                    </legend>

                    <input
                      type={showPassword ? "text" : "password"}
                      {...mobileForm.register("password")}
                      className="w-full outline-none pr-8 placeholder:text-[#BABABA]"
                      placeholder="Enter here"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </fieldset>

                  <button
                    type="submit"
                    disabled={mobileForm.formState.isSubmitting}
                    className="w-full bg-[#17171D] text-white py-3 rounded-md"
                  >
                    Continue
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
