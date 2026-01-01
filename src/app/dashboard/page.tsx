import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import Dashboard from "@/components/dashboard/dashboard";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Dashboard - Milke Khareedo Admin Panel",
  description: "View overview statistics, KPIs, recent leads, and sales team performance for Milke Khareedo real estate CRM.",
};

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#F5F5FA] md:bg-transparent">
          <Dashboard />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
