
import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import EditAccessControlTable from "@/components/settings/access-control/accessControlTable";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Edit Role - Settings",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("EDIT ROLE ID 👉", id);

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="p-2 bg-[#F5F5FA] overflow-hidden">
        <div className="border rounded-sm bg-background h-full w-full overflow-hidden">

          <header className="bg-background sticky top-0 flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumb className="w-full">
              <div className="hidden md:block">
                <div className="flex w-full items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Edit Access Level – Setting
                  </h2>
                </div>
              </div>
            </Breadcrumb>
          </header>

          <EditAccessControlTable mode="edit" roleId={id} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
