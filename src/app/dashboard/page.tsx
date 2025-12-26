import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import Dashboard from "@/components/dashboard/dashboard";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Dashboard - MilkE Khareedo Admin Panel",
  description: "View overview statistics, KPIs, recent leads, and sales team performance for MilkE Khareedo real estate CRM.",
};

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Dashboard />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
