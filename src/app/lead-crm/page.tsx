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
import exportCsv from "@/assets/exportCsv.png"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export default function Page() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [dateRange, setDateRange] = useState<
    "past_24_hours" | "past_7_days" | "past_30_days"
  >("past_30_days");

  const [tempDateRange, setTempDateRange] = useState(dateRange);
  const [filterOpen, setFilterOpen] = useState(false);

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
              <button
                onClick={() => setFilterOpen(true)}
                className="text-xs font-medium border border-white px-2 py-1 rounded-md bg-[#ffffff]"
              >
                {dateRange === "past_24_hours" && "Past 24 Hours"}
                {dateRange === "past_7_days" && "Past 7 Days"}
                {dateRange === "past_30_days" && "Past 30 Days"} ▾
              </button>


              {/* EXPORT CSV (ICON ONLY) */}
              <button
                onClick={handleExportCSV}
                className="p-2 rounded-full border bg-white"
              >
                <img
                  src={exportCsv.src}
                  alt="notification"
                  width={16}
                  height={16}
                />
              </button>

              {/* NOTIFICATION */}
              <button onClick={() => router.push("/notification")} className="p-2 rounded-full border bg-white">
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
            <LeadCRM dateRange={dateRange} />
          </div>
        </div>
      </SidebarInset>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl p-4">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <SheetTitle className="text-[17px] font-bold">
              Date Range Options
            </SheetTitle>
            <button
              onClick={() => setFilterOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* OPTIONS */}
          <div className="space-y-2">
            {[
              { label: "Past 24 Hours", value: "past_24_hours" },
              { label: "Past 7 Days", value: "past_7_days" },
              { label: "Past 30 Days", value: "past_30_days" },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setTempDateRange(opt.value as any)}
                className="w-full px-4 py-3 rounded-lg border bg-[#F5F5FA] 
                     text-[#3A59A6] text-left flex items-center justify-between"
              >
                <span>{opt.label}</span>

                {tempDateRange === opt.value && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#3A59A6]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* SAVE */}
          <button
            onClick={() => {
              setDateRange(tempDateRange);
              setFilterOpen(false);
            }}
            className="mt-4 w-full bg-black text-white py-3 rounded-lg font-medium"
          >
            Save
          </button>

        </SheetContent>
      </Sheet>

    </SidebarProvider>
  );
}
