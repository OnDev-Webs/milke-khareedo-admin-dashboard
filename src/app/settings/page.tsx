import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import Settings from "@/components/settings/setting";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Settings - Milke Khareedo Admin Panel",
  description: "Configure profile settings, user roles, and access controls for the Milke Khareedo admin panel.",
};

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-2 md:p-4 pt-0 bg-[#F5F5FA] md:bg-transparent">
          <Settings />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
