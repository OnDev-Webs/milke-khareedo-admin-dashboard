"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { IAdmin, resetAuth, setAuthFromStorage } from "@/lib/features/auth/adminAuthSlice";

export default function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) return;

    try {
      const parsedHost:IAdmin = JSON.parse(user);

      if (!parsedHost?.id || !parsedHost?.email) {
        throw new Error("Invalid host");
      }

      dispatch(setAuthFromStorage({ token, admin: parsedHost }));
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("host");
      dispatch(resetAuth())
      console.error("Hydration failed, cleared auth", e);
    }
  }, [dispatch]);

  return null;
}
