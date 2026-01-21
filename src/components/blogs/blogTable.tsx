"use client";

import { EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DeletePopUp from "../custom/popups/delete";
import { Blog } from "@/lib/features/blogs/blogSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { deleteBlog, fetchBlogs } from "@/lib/features/blogs/blogApi";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/lib/permissions/hasPermission";
import { RootState } from "@/lib/store/store";
import { PERMISSIONS } from "@/lib/permissions/permissionKeys";

interface BlogTableProps {
  blogs: Blog[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  getPageNumbers: () => number[];
  dataLength: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  onRefreshBlogs?: () => void;
}

const headers = [
  { key: "title", label: "Title", minW: "min-w-[250px]" },
  { key: "author", label: "Author", minW: "min-w-[150px]" },
  { key: "category", label: "Category", minW: "min-w-[150px]" },
  { key: "tags", label: "Tags", minW: "min-w-[200px]" },
  { key: "date", label: "Date", minW: "min-w-[140px]" },
  { key: "actions", label: "Actions", minW: "min-w-[100px]" },
] as const;

export default function BlogTable({
  blogs,
  onRefreshBlogs,
}: BlogTableProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const INITIAL_COUNT = 7;
  const LOAD_MORE_COUNT = 6;

  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleDeleteClick = (blogId: string) => {
    setDeleteBlogId(blogId);
    setIsDeleteOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      await dispatch(deleteBlog(id)).unwrap();
      setIsDeleteOpen(false);
      setDeleteBlogId(null);
      // Refresh the blog list
      await dispatch(fetchBlogs({ page: 1, limit: 15 }));
      if (onRefreshBlogs) {
        onRefreshBlogs();
      }
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const year = date.getFullYear();
      return `${day} ${month}, ${year}`;
    } catch {
      return dateString;
    }
  };

  const canViewBlog = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.BLOGS.VIEW)
  );

  const canEditBlog = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.BLOGS.EDIT)
  );

  const canDeleteBlog = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.BLOGS.DELETE)
  );


  return (
    <div className="w-full bg-white p-4">
      <DeletePopUp
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteBlogId(null);
        }}
        onConfirm={handleDeleteConfirm}
        id={deleteBlogId || undefined}
        title="Delete Blog?"
        description="Are you sure you want to delete this blog? Once completed, it cannot be undone."
        buttonText="Delete Blog"
      />
      <div className="w-full rounded-xl overflow-hidden border bg-white">
        <div className="relative overflow-visible">
          <table className="w-full text-sm">
            <thead className="bg-[#f3f6ff] text-gray-700">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    className={`px-4 py-3 text-sm font-bold ${header.minW} ${header.key === "actions" ? "text-center" : "text-left"
                      }`}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {blogs.slice(0, visibleCount).map((row, index) => {

                return (
                  <tr key={row._id} className="relative hover:bg-gray-50"
                    style={{ zIndex: openMenuId === row._id ? 50 : 1 }}
                    onClick={() => {
                      if (!canViewBlog) return;
                      router.push(`/blogs/${row._id}`);
                    }}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="block max-w-[280px] truncate font-semibold text-gray-800"
                        title={row.title}
                      >
                        {row.title || "N/A"}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {row.authorName || row.author || "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      {row.category?.name ? (
                        <span className="px-2 py-1 text-xs font-medium bg-[#F4F8FF] text-[#000000] rounded">
                          {row.category.name.startsWith("#")
                            ? row.category.name
                            : `${row.category.name}`}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">No category</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {row.tags && row.tags.length > 0 ? (
                          row.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs font-medium bg-[#F4F8FF] text-[#000000] rounded"
                            >
                              {tag.startsWith("#") ? tag : `#${tag}`}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400">No tags</span>
                        )}
                        {row.tags && row.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs font-medium text-gray-500">
                            +{row.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {formatDate(row.createdAt)}
                    </td>

                    <td className="relative px-4 py-3 mx-auto w-8">
                      <div
                        ref={openMenuId === row._id ? actionMenuRef : null}
                        className="relative col-span-2 flex justify-end"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenuPosition({
                              top: rect.bottom + 8,
                              left: rect.right - 144,
                            });
                            setOpenMenuId(openMenuId === row._id ? null : row._id);
                          }}
                          className="rounded-full bg-gray-100 p-2"
                        >
                          <EllipsisVertical size={16} />
                        </button>

                        {openMenuId === row._id && menuPosition && (
                          <div
                            className="fixed z-[9999] w-36 rounded-lg overflow-hidden border bg-white shadow"
                            style={{
                              top: menuPosition.top,
                              left: menuPosition.left,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              disabled={!canViewBlog}
                              onClick={(e) => {
                                if (!canViewBlog) return;
                                e.stopPropagation();
                                router.push(`/blogs/${openMenuId}`);
                                setOpenMenuId(null);
                              }}
                              className={`block w-full px-4 py-2 text-left text-xs
                              ${canViewBlog ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}
                            >
                              View
                            </button>

                            <button
                              disabled={!canEditBlog}
                              onClick={(e) => {
                                if (!canEditBlog) return;
                                e.stopPropagation();
                                router.push(`/blogs/${openMenuId}/edit`);
                                setOpenMenuId(null);
                              }}
                              className={`block w-full px-4 py-2 text-left text-xs
                              ${canEditBlog ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}
                            >
                              Edit
                            </button>

                            <button
                              disabled={!canDeleteBlog}
                              onClick={(e) => {
                                if (!canDeleteBlog) return;
                                e.stopPropagation();
                                handleDeleteClick(openMenuId);
                              }}
                              className={`block w-full px-4 py-2 text-left text-xs text-red-600
                              ${canDeleteBlog ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}
                            >
                              Delete
                            </button>
                          </div>
                        )}

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {visibleCount < blogs.length && (
          <div className="flex justify-center border-t p-4">
            <button
              onClick={() =>
                setVisibleCount((prev) =>
                  Math.min(prev + LOAD_MORE_COUNT, blogs.length)
                )
              }
              className="rounded-full border border-[#F5F5F5] px-6 py-2 text-[15px] font-semibold text-[#2D2D2D] hover:bg-gray-100"
            >
              Learn more
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

