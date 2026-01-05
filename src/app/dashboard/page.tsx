import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import Dashboard from "@/components/dashboard/dashboard";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Dashboard - Milke Khareedo Admin Panel",
  description: "View overview statistics, KPIs, recent leads, and sales team performance for Milke Khareedo real estate CRM.",
};

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="border rounded-sm bg-background h-full w-full overflow-hidden">
          <header className="hidden md:flex bg-background sticky top-0 flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb className="w-full">
              <BreadcrumbList className="flex items-center justify-between">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#F5F5FA] md:bg-transparent">
            <Dashboard />
          </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  );
}
