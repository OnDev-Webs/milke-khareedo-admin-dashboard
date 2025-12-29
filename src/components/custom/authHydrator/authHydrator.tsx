"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { IAdmin, resetAuth, setAuthFromStorage } from "@/lib/features/auth/adminAuthSlice";
import { getRememberMe, clearRememberMe } from "@/utils/rememberMe";

export default function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Skip hydration on server
    if (typeof window === "undefined") return;

    // First check for remember me token
    const rememberMeData = getRememberMe();
    let token = localStorage.getItem("token");
    let user = localStorage.getItem("user");

    // If remember me exists and is valid, use it
    if (rememberMeData && (!token || !user)) {
      token = rememberMeData.token;
      user = rememberMeData.userData;
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);
    }

    if (!token || !user) return;

    try {
      const parsedHost: IAdmin = JSON.parse(user);

      // Validate that we have required fields (id and email are essential)
      // Only clear if they are truly missing (null/undefined), not just empty strings
      if (!parsedHost?.id || !parsedHost?.email || parsedHost.id === "" || parsedHost.email === "") {
        // Invalid data, clear it silently
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        clearRememberMe();
        dispatch(resetAuth());
        return;
      }

      // Valid data, restore auth state
      dispatch(setAuthFromStorage({ token, admin: parsedHost }));
    } catch (e) {
      // JSON parse error or other error, clear invalid auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      clearRememberMe();
      dispatch(resetAuth());
      // Only log in development
      if (process.env.NODE_ENV === "development") {
        console.error("Hydration failed, cleared auth", e);
      }
    }
  }, [dispatch]);

  return null;
}
