"use client";

import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DeletePopUp from "../custom/popups/delete";
import { Blog } from "@/lib/features/blogs/blogSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { deleteBlog, fetchBlogs } from "@/lib/features/blogs/blogApi";
import { useRouter } from "next/navigation";

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
  { key: "tags", label: "Tags", minW: "min-w-[200px]" },
  { key: "date", label: "Date", minW: "min-w-[140px]" },
  { key: "actions", label: "Actions", minW: "min-w-[100px]" },
] as const;

export default function BlogTable({
  blogs,
  currentPage,
  totalPages,
  onPageChange,
  getPageNumbers,
  dataLength,
  indexOfFirstItem,
  indexOfLastItem,
  onRefreshBlogs,
}: BlogTableProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pageNumbers = getPageNumbers();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div className="w-full bg-white">
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f3f6ff] text-gray-700">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    className={`px-4 py-3 text-sm font-bold ${header.minW} ${
                      header.key === "actions" ? "text-center" : "text-left"
                    }`}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {blogs.map((row, index) => {

                return (
                  <tr key={row._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-800">
                        {row.title || "N/A"}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {row.authorName || row.author || "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {row.tags && row.tags.length > 0 ? (
                          row.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
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
                          onClick={() =>
                            setOpenMenuId(openMenuId === row._id ? null : row._id)
                          }
                          className="rounded-full bg-gray-100 p-2"
                        >
                          <EllipsisVertical size={16} />
                        </button>

                        {openMenuId === row._id && (
                          <div
                            className={`absolute right-0 z-50 w-36 rounded-lg overflow-hidden border bg-white shadow`}
                          >
                            <button
                              onClick={() => {
                                router.push(`/blogs/${row._id}`);
                                setOpenMenuId(null);
                              }}
                              className="block w-full px-4 py-2 text-left text-xs hover:bg-gray-50"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                router.push(`/blogs/${row._id}/edit`);
                                setOpenMenuId(null);
                              }}
                              className="block w-full px-4 py-2 text-left text-xs hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(row._id)}
                              className="block w-full px-4 py-2 text-left text-xs hover:bg-gray-50 text-red-600"
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

        <div className="flex items-center justify-center gap-2 border-t p-4 text-sm text-gray-600">
          <button
            className="flex items-center gap-2 rounded-full border px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`rounded-full border px-3 py-1 ${
                currentPage === pageNum
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            className="flex items-center gap-2 rounded-full border px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

