"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { resetAuth, setAuthFromStorage } from "@/lib/features/auth/authSlice";

export default function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const host = localStorage.getItem("host");

    if (!token || !host) return;

    try {
      const parsedHost = JSON.parse(host);

      if (!parsedHost?.id || !parsedHost?.email) {
        throw new Error("Invalid host");
      }

      dispatch(setAuthFromStorage({ token, host: parsedHost }));
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("host");
      dispatch(resetAuth())
      console.error("Hydration failed, cleared auth", e);
    }
  }, [dispatch]);

  return null;
}
