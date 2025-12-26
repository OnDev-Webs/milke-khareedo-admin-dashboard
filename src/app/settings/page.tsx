import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import Settings from "@/components/settings/setting";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Settings - MilkE Khareedo Admin Panel",
  description: "Configure profile settings, user roles, and access controls for the MilkE Khareedo admin panel.",
};

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Settings />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
