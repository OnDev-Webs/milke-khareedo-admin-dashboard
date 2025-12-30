import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import EditAccessControlTable from "@/components/settings/access-control/accessControlTable";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Add Role - Settings",
};

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="p-2 bg-[#F5F5FA] overflow-hidden">
        <div className="border rounded-sm bg-background h-full w-full overflow-hidden">
          <header className="bg-background sticky top-0 flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h2 className="text-sm font-semibold text-gray-900">
              Add New Role – Settings
            </h2>
          </header>

          <EditAccessControlTable mode="add" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
