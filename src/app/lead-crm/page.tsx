"use client";

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
import { useAppDispatch } from "@/lib/store/hooks";
import { exportLeadsCSV } from "@/lib/features/lead-crm/leadcrmApi";
import { Download } from "lucide-react";

export default function Page() {
  const dispatch = useAppDispatch();

  const handleExportCSV = async () => {
    try {
      const result = await dispatch(exportLeadsCSV()).unwrap();

      // Create a temporary anchor element to download the file
      const link = document.createElement("a");
      link.href = result.csvUrl;
      link.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to export CSV:", error);
    }
  };

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
                <div className="flex items-center">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Download size={14} />
                    Export CSV
                  </button>
                </div>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="w-full h-full overflow-hidden">
            <LeadCRM />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
