"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Blogs from "@/components/blogs/blogs";
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
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

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
                  <BreadcrumbLink href="#" className="flex items-center gap-2">
                    <span>📄</span>
                    <span>Blogs</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <div className="flex items-center">
                  <button
                    onClick={() => router.push("/blogs/add")}
                    className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Add New Blog
                  </button>
                </div>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="w-full h-full overflow-hidden p-4">
            <Blogs />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

