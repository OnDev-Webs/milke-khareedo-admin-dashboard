import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import Developers from "@/components/developers/developers";
import LeadCRM from "@/components/lead-crm/leadCrm";
import Properties from "@/components/properties/properties";
import EditAccessControlTable from "@/components/settings/access-control/accessControlTable";
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
  title: "Edit Access Level - Settings | Milke Khareedo Admin Panel",
  description: "Edit access levels and permissions for users in the Milke Khareedo admin panel.",
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
            <Breadcrumb className="w-full ">
              <div className=" hidden md:block">
                <div className=" flex w-full items-center justify-between  ">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Edit Access Level – Setting
                  </h2>

                  <button
                    type="button"
                    className="rounded-lg bg-gray-100 px-6 py-1.5 text-sm font-medium text-gray-700"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </Breadcrumb>
          </header>
          <div className="w-full h-full overflow-hidden">
            <EditAccessControlTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
