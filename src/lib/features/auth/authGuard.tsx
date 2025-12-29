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
    // Skip on server
    if (typeof window === "undefined") {
      setIsChecking(false);
      return;
    }

    // Check for token in localStorage first
    const token = localStorage.getItem("token");
    
    // If no token and not on login page, redirect immediately
    if (!token && pathname !== "/" && pathname !== "/login") {
      dispatch(resetAuth());
      router.replace("/");
      setIsChecking(false);
      return;
    }

    // Allow login page to render immediately
    if (pathname === "/" || pathname === "/login") {
      setIsChecking(false);
      return;
    }

    // If we have a token but auth state says not authenticated, check once more after a brief delay for hydration
    if (token && !isAuthenticated && !loading) {
      const timer = setTimeout(() => {
        // Re-check auth state after hydration
        if (!isAuthenticated && pathname !== "/" && pathname !== "/login") {
          const stillNoAuth = localStorage.getItem("token");
          if (!stillNoAuth) {
            dispatch(resetAuth());
            router.replace("/");
          }
        }
        setIsChecking(false);
      }, 50); // Reduced from 100ms to 50ms
      return () => clearTimeout(timer);
    }

    // If loading is done and authenticated, allow access
    if (!loading && isAuthenticated) {
      setIsChecking(false);
      return;
    }

    // If loading is done and not authenticated (and we're not on login), redirect
    if (!loading && !isAuthenticated && pathname !== "/" && pathname !== "/login") {
      dispatch(resetAuth());
      router.replace("/");
      setIsChecking(false);
      return;
    }
  }, [isAuthenticated, loading, pathname, router, dispatch]);

  // Allow access to login page immediately (prevents flicker)
  if (pathname === "/" || pathname === "/login") {
    return <>{children}</>;
  }

  // Show nothing while checking or loading (prevents flicker during auth check)
  if (isChecking || loading) {
    return null;
  }

  // If not authenticated and not on login page, show nothing (redirecting)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
