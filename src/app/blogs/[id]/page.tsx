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
import Loader from "@/components/ui/loader";

export default function BlogDetailPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;
  const { selectedBlog, loadingDetails } = useAppSelector(
    (state: RootState) => state.blogs
  );
  const [isEditing, setIsEditing] = useState(false);
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
      await dispatch(fetchBlogById(blogId));
      // Refresh the blog list
      await dispatch(fetchBlogs({ page: 1, limit: 15 }));
      setIsEditing(false);
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
            <div className="text-gray-500"><Loader size={38}/></div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!selectedBlog && !isEditing) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="p-2 bg-[#F5F5FA] overflow-hidden">
          <div className="border rounded-sm bg-background h-full w-full overflow-hidden flex items-center justify-center">
            <div className="text-gray-500">Blog not found</div>
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
              <BreadcrumbList className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/blogs">Blogs</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">
                      {isEditing ? "Edit Blog" : "View Blog"}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </div>
                {!isEditing && (
                  <div className="flex items-center">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Update
                    </button>
                  </div>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="w-full h-full overflow-auto bg-white">
            <div className="p-6">
              {isEditing ? (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Blog</h1>
                  <BlogForm
                    blog={selectedBlog}
                    onSubmit={handleUpdate}
                    isSubmitting={isSubmitting}
                    readOnly={false}
                  />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">View Blog</h1>
                  <BlogForm
                    blog={selectedBlog}
                    onSubmit={handleUpdate}
                    isSubmitting={false}
                    readOnly={true}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

