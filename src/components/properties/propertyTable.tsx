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
import { deletePropertyById, fetchProperties } from "@/lib/features/properties/propertiesApi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store/store";
import { PERMISSIONS } from "@/lib/permissions/permissionKeys";
import { hasPermission } from "@/lib/permissions/hasPermission";

interface PropertiesTableProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  getPageNumbers: () => number[];
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
    dispatch(fetchProperties({ page: currentPage, limit: 10 }));
  }

  const formatCount = (count: number) => {
    return count < 10 ? `0${count}` : `${count}`;
  };


  const canEdit = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.PROPERTY.EDIT)
  );

  const canView = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.PROPERTY.VIEW)
  );

  const canDelete = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.PROPERTY.DELETE)
  );


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

      <div className="w-full rounded-xl border bg-white flex flex-col h-[calc(100vh-160px)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm ">
            <thead className="bg-[#f3f6ff] sticky top-0 z-10">
              <tr>
                {/* <th className="px-4 py-3 font-bold">Property Name</th> */}
                <th className="px-4 py-3 font-bold">
                  <div className="flex items-center">
                    <span className="inline-block h-8 w-8 -mr-6 opacity-0" />
                    <span>Property Name</span>
                  </div>
                </th>

                <th className="px-4 py-3 font-bold">Developer</th>
                <th className="px-4 py-3 font-bold">City</th>
                <th className="px-4 py-3 font-bold text-center whitespace-nowrap">Group's Count</th>
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
                      {formatCount(row.joinedGroupCount)} / {formatCount(row.minGroupMembers)}
                    </td>

                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${row.isStatus
                          ? "bg-[#BCE288] text-[#2E6B2B]"
                          : "bg-[#FAA2A4] text-[#B44445]"
                          }`}
                      >
                        <Dot size={14} />
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
                              disabled={!canEdit}
                              onClick={(e) => {
                                if (!canEdit) return;
                                e.stopPropagation();
                                router.push(`/properties/add-property?id=${row._id}&mode=edit`);
                              }}
                              className={`block w-full px-4 py-2 text-left text-xs ${canEdit ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}
                            >
                              Edit
                            </button>

                            <button
                              disabled={!canView}
                              onClick={(e) => {
                                if (!canView) return;
                                e.stopPropagation();
                                router.push(`/properties/add-property?id=${row._id}&mode=view`);
                              }}
                              className={`block w-full px-4 py-2 text-left text-xs ${canView ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}
                            >
                              View
                            </button>

                            <button
                              disabled={!canDelete}
                              onClick={(e) => {
                                if (!canDelete) return;
                                e.stopPropagation();
                                setDeleteId(row._id);
                                setIsDeleteOpen(true);
                                setOpenMenuId(null);
                              }}
                              className={`block w-full px-4 py-2 text-left text-xs text-red-600 ${canDelete ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}
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

        <div className="sticky bottom-0 bg-white border-t z-20">
          <div className="flex items-center justify-center gap-2 p-4 text-sm text-gray-600">

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
      </div>
      );
}
