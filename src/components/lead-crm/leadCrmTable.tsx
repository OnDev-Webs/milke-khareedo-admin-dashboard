"use client";

import { Dot, EllipsisVertical, } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LeadCRMSheet, { SheetMode } from "./leadCrmSheet";
import DeletePopUp from "../custom/popups/delete";
import { Lead } from "@/lib/features/lead-crm/leadcrmSlice";
import { User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { deleteLead } from "@/lib/features/lead-crm/leadcrmApi";
import { useRouter } from "next/navigation";
import more from "@/assets/more.png"
import { RootState } from "@/lib/store/store";
import { PERMISSIONS } from "@/lib/permissions/permissionKeys";
import { hasPermission } from "@/lib/permissions/hasPermission";

interface LeadCRMTableProps {
  leads: Lead[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  getPageNumbers: () => number[];
  dataLength: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  onRefreshLeads?: () => void;
}

const headers = [
  { key: "userName", label: "User Name", minW: "min-w-[200px]" },
  { key: "email", label: "Email", minW: "min-w-[160px]" },
  { key: "phoneNumber", label: "Phone", minW: "min-w-[140px]" },
  { key: "dateTime", label: "Date & Time", minW: "min-w-[160px]" },
  { key: "projectId", label: "Project ID", minW: "min-w-[140px]" },
  { key: "status", label: "Status", minW: "min-w-[120px]" },
  { key: "actions", label: "Actions", minW: "min-w-[100px]" },
] as const;

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower === "lead_received" || statusLower === "interested") {
    return "bg-[#BCE288] text-[#2E6B2B]";
  } else if (statusLower === "pending") {
    return "bg-[#FFF4E5] text-[#F59E0B]";
  } else {
    return "bg-[#FAA2A4] text-[#B44445]";
  }
};

const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function LeadCRMTable({
  leads,
  onRefreshLeads,
}: LeadCRMTableProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);
  const [mode, setMode] = useState<SheetMode>("view");
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


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

  const handleViewLead = (leadId: string) => {
    setOpenMenuId(null);

    if (isMobile) {
      router.push(`/lead-crm/${leadId}`);
    } else {
      setSelectedLeadId(leadId);
      setMode("view");
      setOpen(true);
    }
  };

  const handleSheetClose = () => {
    setOpen(false);
    setSelectedLeadId(null);
    if (onRefreshLeads) {
      onRefreshLeads();
    }
  };

  const handleDeleteClick = (leadId: string) => {
    setDeleteLeadId(leadId);
    setIsDeleteOpen(true);
    setOpenMenuId(null);
  };

const handleDeleteConfirm = async (id: string) => {
  try {
    await dispatch(deleteLead(id)).unwrap();

    setIsDeleteOpen(false);
    setDeleteLeadId(null);
    setOpenMenuId(null);
  } catch (error) {
    console.error("Failed to delete lead:", error);
  }
};



  const canViewLead = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.CRM.VIEW)
  );

  const canDeleteLead = useAppSelector((state: RootState) =>
    hasPermission(state, PERMISSIONS.CRM.DELETE)
  );

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  return (
    <div className="w-full bg-[#F5F5FA] md:bg-white">
      <LeadCRMSheet
        mode={mode}
        leadId={selectedLeadId}
        open={open}
        setOpen={setOpen}
        onClose={handleSheetClose}
      />
      <DeletePopUp
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteLeadId(null);
        }}
        onConfirm={handleDeleteConfirm}
        id={deleteLeadId || undefined}
        title="Delete Lead?"
        description="Are you sure you want to delete this lead? Once completed, it cannot be undone."
        buttonText="Delete Lead"
      />
      <div className="hidden lg:block p-4">
        <div className="w-full rounded-xl overflow-hidden border bg-white">
          <div className="relative overflow-x-auto overflow-y-visible">
            <table className="w-full text-sm">
              <thead className="bg-[#f3f6ff] text-gray-700">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header.key}
                      className={`px-4 py-3 text-sm font-bold ${header.minW} ${header.key === "status" || header.key === "actions"
                        ? " text-center"
                        : "text-left"
                        }`}
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y">
                {leads.map((row, index) => {

                  return (
                    <tr
                      key={row._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        if (!canViewLead) return;
                        handleViewLead(row._id);
                      }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {row.profileImage && row.profileImage.trim() !== "" ? (
                              <img
                                src={row.profileImage}
                                alt={row.userName || "Lead"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={16} className="text-gray-400" />
                            )}
                          </div>
                          <span className="font-semibold">{row.userName || "N/A"}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-semibold">{row.email || "N/A"}</td>

                      <td className="px-4 py-3 font-semibold">
                        {row.phoneNumber || "N/A"}
                      </td>

                      <td className="px-4 py-3 font-semibold">{formatDateTime(row.createdAt)}</td>

                      <td className="px-4 py-3 font-semibold">
                        {row.projectId || "N/A"}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <span
                            className={`flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                              row.status
                            )}`}
                          >
                            <Dot />
                            {formatStatus(row.status)}
                          </span>
                        </div>
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
                              onClick={(e) => e.stopPropagation()}>
                              <button
                                disabled={!canViewLead}
                                onClick={(e) => {
                                  if (!canViewLead) return;
                                  e.stopPropagation();
                                  handleViewLead(row._id);
                                }}
                                className={`block w-full px-4 py-2 text-left text-xs
                                ${canViewLead ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}
                              >
                                View
                              </button>

                              <button
                                disabled={!canDeleteLead}
                                onClick={(e) => {
                                  if (!canDeleteLead) return;
                                  e.stopPropagation();
                                  handleDeleteClick(row._id);
                                }}
                                className={`block w-full px-4 py-2 text-left text-xs text-red-600
                                ${canDeleteLead ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}
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

          {/* {visibleCount < leads.length && (
            <div className="flex justify-center border-t p-4">
              <button
                onClick={() =>
                  setVisibleCount((prev) =>
                    Math.min(prev + LOAD_MORE_COUNT, leads.length)
                  )
                }
                className="rounded-full border border-[#F5F5F5] px-6 py-2 text-[15px] font-semibold text-[#2D2D2D] hover:bg-gray-100"
              >
                Learn more
              </button>
            </div>
          )} */}

        </div>
      </div>
      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="bg-[#F5F5FA] block lg:hidden space-y-4 px-3 pb-4 pt-2 mb-10">
        {leads.map((row) => (
          <div
            key={row._id}
            onClick={() => handleViewLead(row._id)}
            className="bg-white border border-white rounded-xl px-4 py-3 shadow"
          >
            {/* Top Row */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[15px] font-bold text-black">
                  {row.userName || "N/A"}
                </p>
                <p className="text-[11px] text-[#929292]">
                 {formatDateTime(row.createdAt)}


                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Status */}
                <span
                  className={`flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                    row.status
                  )}`}
                >
                  <Dot size={14} />
                  {formatStatus(row.status)}
                </span>

                {/* View button */}
                <button
                  disabled={!canViewLead}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!canViewLead) return;
                    handleViewLead(row._id);
                  }}
                  className={`h-8 w-8 rounded-full bg-[#EEF0FB] flex items-center justify-center
                  ${!canViewLead ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <img src={more.src} alt="Details" width={14} height={14} />
                </button>
              </div>

            </div>

            {/* Details */}
            <div className="mt-1.5 space-y-1.5 text-sm text-gray-700">
              {/* Phone Number */}
              <div>
                <p className="text-[12px] font-medium text-[#929292]">
                  Phone Number
                </p>
                <p className="text-[13px] text-[#000000]">
                  {row.phoneNumber || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-[1.5fr_1fr] gap-3">
                {/* PROJECT ID */}
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-[#929292]">
                    Project ID
                  </p>
                  <p className="text-[13px] text-[#000000] truncate">
                    {row.projectId || "N/A"}
                  </p>
                </div>

                {/* SOURCE */}
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-[#929292]">
                    Source
                  </p>
                  <p className="text-[13px] text-[#000000] truncate">
                    {row.source || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
