"use client";

import { AppSidebar } from "@/components/app-sidebar";
import BlogForm from "@/components/blogs/blogForm";
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
import { createBlog, fetchBlogs } from "@/lib/features/blogs/blogApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddBlogPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await dispatch(createBlog(formData)).unwrap();
      router.push("/blogs");
    } catch (error) {
      console.error("Failed to create blog:", error);
    } finally {
      setIsSubmitting(false);
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
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Create New Blog</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="w-full h-full overflow-auto bg-white">
            <div className="p-6">
              <BlogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

