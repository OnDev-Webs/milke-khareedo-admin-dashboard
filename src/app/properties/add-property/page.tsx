import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import AddNewProperty from "@/components/properties/add-property/addNewProperty";
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
  title: "Add Property - Milke Khareedo Admin Panel",
  description: "Add a new real estate property to the Milke Khareedo CRM system with details, amenities, and photos.",
};

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="p-2 bg-[#F5F5FA] h-screen overflow-hidden">
        <div className="border rounded-sm bg-background h-full w-full flex flex-col overflow-hidden">
          <header className="sticky top-0 flex h-12 shrink-0 items-center gap-2 border-b px-4 bg-background z-10">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb className="w-full">
              <BreadcrumbList className="flex items-center justify-between">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Properties</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex-1 overflow-hidden">
            <AddNewProperty />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}