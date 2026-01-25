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
import { fetchBlogById, updateBlog, fetchBlogs, fetchBlogComments } from "@/lib/features/blogs/blogApi";
import { RootState } from "@/lib/store/store";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/loader";
import { hasPermission } from "@/lib/permissions/hasPermission";
import { PERMISSIONS } from "@/lib/permissions/permissionKeys";

export default function BlogDetailPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;
  const canEditBlog = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.BLOGS.EDIT)
  );
  const { selectedBlog, loadingDetails, comments, loadingComments } = useAppSelector((state: RootState) => state.blogs);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openLikesFor, setOpenLikesFor] = useState<string | null>(null);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlogById(blogId));
      dispatch(fetchBlogComments(blogId));
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
            <div className="text-gray-500"><Loader size={38} /></div>
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
                    <BreadcrumbLink href="#">
                      {isEditing ? "Edit Blog" : "View Blog"}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.back()}
                    className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-100 transition"
                  >
                    Back
                  </button>
                  {!isEditing && canEditBlog && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                    >
                      Update
                    </button>
                  )}
                </div>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="w-full h-full overflow-auto bg-white">
            <div className="p-6">
              {isEditing ? (
                <>
                  <BlogForm
                    blog={selectedBlog}
                    onSubmit={handleUpdate}
                    isSubmitting={isSubmitting}
                    readOnly={false}
                  />
                </>
              ) : (
                <>
                  <BlogForm
                    blog={selectedBlog}
                    onSubmit={handleUpdate}
                    isSubmitting={false}
                    readOnly={true}
                  />
                </>
              )}

              {/* ================= COMMENTS SECTION ================= */}
              {!isEditing && (
                <div className="grid grid-cols-12 gap-4 mt-8">
                  <aside className="col-span-12 lg:col-span-3 border-r bg-white">
                    <div className="pe-4">
                    </div>
                  </aside>

                  <section className="col-span-12 lg:col-span-9">
                    <div className="p-6 border-t bg-[#F9FAFB]">
                      <h2 className="text-lg font-semibold mb-6">Comments</h2>

                      {comments.map((c) => (
                        <div
                          key={c._id}
                          className="rounded-xl bg-white border p-4 shadow-sm mb-4"
                        >
                          {/* COMMENT HEADER */}
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-gray-800">
                              {c.author?.name}
                            </p>
                            <span className="text-xs text-gray-400">
                              {new Date(c.createdAt).toLocaleString()}
                            </span>
                          </div>

                          {/* COMMENT TEXT */}
                          <p className="mt-2 text-sm text-gray-700">
                            {c.content}
                          </p>

                          {/* LIKE BUTTON */}
                          <div className="mt-3">
                            <button
                              onClick={() =>
                                setOpenLikesFor(openLikesFor === c._id ? null : c._id)
                              }
                              className="flex items-center gap-1 text-xs font-medium
               px-3 py-1 rounded-[10px]
               border border-gray-300 bg-gray-50 hover:bg-gray-100 transition"
                            >
                              👍 {c.likedBy?.length || 0} Likes
                            </button>

                            {/* INLINE LIKE LIST (UNDER BUTTON) */}
                            {openLikesFor === c._id && (
                              <div className="mt-2 rounded-lg border bg-white p-3 shadow-sm max-h-40 overflow-y-auto">
                                <p className="text-xs font-semibold text-gray-600 mb-2">
                                  Liked by
                                </p>

                                {(!c.likedBy || c.likedBy.length === 0) ? (
                                  <p className="text-xs text-gray-400">No likes yet</p>
                                ) : (
                                  <div className="space-y-2">
                                    {c.likedBy.map((u: any) => (
                                      <div
                                        key={u._id}
                                        className="flex items-center gap-2 text-sm text-gray-700"
                                      >
                                        <span className="h-6 w-6 rounded-full bg-blue-100
                               flex items-center justify-center
                               text-xs font-semibold text-blue-700">
                                          {u.name?.charAt(0)}
                                        </span>
                                        <span>{u.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* REPLIES */}
                          {c.replies?.length > 0 && (
                            <div className="mt-4 ml-6 border-l-2 border-blue-200 pl-4 space-y-3">
                              {c.replies.map((r: any) => (
                                <div
                                  key={r._id}
                                  className="bg-gray-50 rounded-lg p-3"
                                >
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-800">
                                      {r.author?.name}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                      {new Date(r.createdAt).toLocaleString()}
                                    </span>
                                  </div>

                                  <p className="mt-1 text-sm text-gray-700">
                                    {r.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

