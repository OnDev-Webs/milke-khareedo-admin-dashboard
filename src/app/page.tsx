import type { Metadata } from "next";
import Login from "@/components/login/login";

export const metadata: Metadata = {
  title: "Login - Milke Khareedo Admin Panel",
  description: "Login to access the Milke Khareedo real estate CRM admin dashboard.",
};

export default function Home() {
  return (
    <Login />
  );
}
