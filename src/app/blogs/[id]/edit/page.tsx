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
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchBlogById, updateBlog, fetchBlogs } from "@/lib/features/blogs/blogApi";
import { RootState } from "@/lib/store/store";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditBlogPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;
  const { selectedBlog, loadingDetails } = useAppSelector(
    (state: RootState) => state.blogs
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlogById(blogId));
    }
  }, [blogId, dispatch]);

  const handleUpdate = async (formData: FormData) => {
    if (!blogId) return;
    setIsSubmitting(true);
    try {
      await dispatch(updateBlog({ id: blogId, payload: formData })).unwrap();
      // Refresh the blog list
      await dispatch(fetchBlogs({ page: 1, limit: 15 }));
      router.push("/blogs");
    } catch (error) {
      console.error("Failed to update blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingDetails) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="p-2 bg-[#F5F5FA] overflow-hidden">
          <div className="border rounded-sm bg-background h-full w-full overflow-hidden flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
                  <BreadcrumbLink href="/blogs">Blogs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/blogs/${blogId}`}>View Blog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Edit Blog</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="w-full h-full overflow-auto bg-white">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Blog</h1>
              <BlogForm
                blog={selectedBlog}
                onSubmit={handleUpdate}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

