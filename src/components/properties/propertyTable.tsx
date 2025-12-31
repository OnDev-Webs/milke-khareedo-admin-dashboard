"use client";

import {
  ChevronLeft,
  ChevronRight,
  Dot,
  EllipsisVertical,
  EllipsisVerticalIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DeletePopUp from "../custom/popups/delete";
import { Property } from "@/lib/features/properties/propertiesSlice";
import { deletePropertyById } from "@/lib/features/properties/propertiesApi";
import { useAppDispatch } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";

interface IProperty extends Property { }

interface PropertiesTableProps {
  properties: IProperty[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  getPageNumbers: () => number[];
  dataLength: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
}

export default function PropertiesTable({
  properties,
  currentPage,
  totalPages,
  onPageChange,
  getPageNumbers,
}: PropertiesTableProps) {
  const pageNumbers = getPageNumbers();
  const [openMenuId, setOpenMenuId] = useState<number | string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);


  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

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

  async function deleteProperty(id: string) {
    await dispatch(deletePropertyById(id));
  }

  return (
    <div className="w-full bg-white">
      <DeletePopUp
        id={deleteId}
        title="Delete this file?"
        description="Are you sure you want to delete this Property? Once completed, it cannot be undone."
        buttonText="Delete property"
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteId(null);
        }}
        onConfirm={deleteProperty}
      />

      <div className="w-full rounded-xl border bg-white overflow-x-hidden">
        <div className="relative overflow-x-auto overflow-y-visible">
          <table className="w-full text-sm">
            <thead className="bg-[#f3f6ff]">
              <tr>
                <th className="px-4 py-3 font-bold">Property Name</th>
                <th className="px-4 py-3 font-bold">Developer</th>
                <th className="px-4 py-3 font-bold">City</th>
                <th className="px-4 py-3 font-bold text-center">Group's Count</th>
                <th className="px-4 py-3 font-bold text-center">Status</th>
                <th className="px-4 py-3 font-bold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {properties.map((row, index) => {
                return (
                  <tr key={row._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={row?.images[0]?.url}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="font-semibold">
                          {row.projectName}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">{row.developer?.developerName}</td>
                    <td className="px-4 py-3">{row.location}</td>

                    <td className="px-4 py-3 text-center">
                      {row.joinedGroupCount} / {row.minGroupMembers}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${row.isStatus
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                          }`}
                      >
                        <Dot className="inline" />
                        {row.isStatus ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="relative px-4 py-3">
                      <div
                        ref={openMenuId === row._id ? actionMenuRef : null}
                        className="flex justify-end"
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
                            className="fixed z-[9999] w-36 rounded-lg border bg-white shadow"
                            style={{
                              top: menuPosition.top,
                              left: menuPosition.left,
                            }}
                            onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/properties/add-property?id=${row._id}&mode=edit`
                                )
                              }}
                              className="block w-full px-4 py-2 text-left text-xs hover:bg-gray-50"
                            >
                              Edit
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/properties/add-property?id=${row._id}&mode=view`
                                )
                              }}
                              className="block w-full px-4 py-2 text-left text-xs hover:bg-gray-50"
                            >
                              View
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(row._id);
                                setIsDeleteOpen(true);
                                setOpenMenuId(null);
                              }}
                              className="block w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-gray-50"
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
            className="border rounded-full px-3 py-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              className={`rounded-full w-7 h-7 flex items-center justify-center ${currentPage === page
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
                }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <button className="rounded-full bg-gray-100 w-7 h-7 flex items-center justify-center">
              <EllipsisVerticalIcon size={16} className="rotate-90" />
            </button>
          )}

          {totalPages > 5 && currentPage < totalPages - 1 && (
            <button
              className={`rounded-full w-7 h-7 flex items-center justify-center ${currentPage === totalPages
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
                }`}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          )}

          <button
            className="border rounded-full px-3 py-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>

          {/* <div className="ml-4 text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, dataLength)} of {dataLength} entries
          </div> */}
        </div>

      </div>
    </div>
  );
}
