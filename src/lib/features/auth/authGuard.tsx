"use client";

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { resetAuth } from "@/lib/features/auth/adminAuthSlice";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check for token in localStorage first
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    // If no token and not on login page, redirect immediately
    if (!token && pathname !== "/" && pathname !== "/login") {
      dispatch(resetAuth());
      router.replace("/");
      setIsChecking(false);
      return;
    }

    // If we have a token but auth state says not authenticated, wait a bit for hydration
    if (token && !isAuthenticated && !loading) {
      // Give AuthHydrator time to restore state
      const timer = setTimeout(() => {
        const stillNoAuth = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!stillNoAuth && pathname !== "/" && pathname !== "/login") {
          dispatch(resetAuth());
          router.replace("/");
        }
        setIsChecking(false);
      }, 100);
      return () => clearTimeout(timer);
    }

    // If loading is done and not authenticated, redirect
    if (!loading && !isAuthenticated && pathname !== "/" && pathname !== "/login") {
      dispatch(resetAuth());
      router.replace("/");
    }

    setIsChecking(false);
  }, [isAuthenticated, loading, pathname, router, dispatch]);

  // Show nothing while checking or loading
  if (isChecking || loading) {
    return null;
  }

  // Allow access to login page even if not authenticated
  if (pathname === "/" || pathname === "/login") {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, show nothing (redirecting)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
