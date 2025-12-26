import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import Developers from "@/components/developers/developers";
import LeadCRM from "@/components/lead-crm/leadCrm";
import Properties from "@/components/properties/properties";
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
  title: "Lead CRM - MilkE Khareedo Admin Panel",
  description: "Manage leads and customer relationships in the MilkE Khareedo real estate CRM system.",
};

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="p-2 bg-[#F5F5FA] overflow-hidden">
        <div className="border rounded-sm bg-background h-full w-full overflow-hidden">
          <header className="bg-background sticky top-0 flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb className="w-full">
              <BreadcrumbList className="flex items-center justify-between">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Lead / CRM </BreadcrumbLink>
                </BreadcrumbItem>
               
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="w-full h-full overflow-hidden">
           <LeadCRM/>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
