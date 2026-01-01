"use client";

import { AppSidebar } from "@/components/app-sidebar";
import LeadCRM from "@/components/lead-crm/leadCrm";
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
import notification from "@/assets/notification.png"

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
        <div className="bg-background h-full w-full overflow-hidden md:border md:rounded-sm">
          {/* ===== DESKTOP HEADER (AS IT IS) ===== */}
          <header className="bg-background sticky top-0 hidden md:flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumb className="w-full">
              <BreadcrumbList className="flex items-center justify-between">
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Lead / CRM</BreadcrumbLink>
                </BreadcrumbItem>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Download size={14} />
                  Export CSV
                </button>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* ===== MOBILE HEADER (NEW) ===== */}
          <header className="bg-[#F5F5FA] sticky top-0 flex md:hidden pt-4 items-center justify-between px-4 z-20">

            {/* LEFT */}
            <span className="text-[17px] font-bold text-[#000000]">
              Lead / CRM
            </span>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

              {/* FILTER DROPDOWN */}
              <button className="text-xs font-medium border border-white px-2 py-1 rounded-md bg-[#ffffff]">
                Last Month ▾
              </button>

              {/* EXPORT CSV (ICON ONLY) */}
              <button
                onClick={handleExportCSV}
                className="p-2 rounded-full border bg-white"
              >
                <Download size={16} />
              </button>

              {/* NOTIFICATION */}
              <button className="p-2 rounded-full border bg-white">
                <img
                  src={notification.src}
                  alt="notification"
                  width={14}
                  height={14}
                />
              </button>

            </div>
          </header>

          <div className="w-full h-full overflow-hidden">
            <LeadCRM />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
