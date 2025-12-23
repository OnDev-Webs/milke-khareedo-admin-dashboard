"use client";

import {
  ChevronLeft,
  ChevronRight,
  Dot,
  EllipsisVertical,
  EllipsisVerticalIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LeadCRMSheet, { SheetMode } from "./leadCrmSheet";
import DeletePopUp from "../custom/popups/delete";

interface ILeadCRM {
  id: number;
  userName: string;
  email: string;
  phone: string;
  date: string;
  projectId: string;
  status: string;
}

interface LeadCRMTableProps {
  leads: ILeadCRM[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  getPageNumbers: () => number[];
  dataLength: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
}

const headers = [
  { key: "userName", label: "User Name", minW: "min-w-[200px]" },
  { key: "email", label: "Email", minW: "min-w-[160px]" },
  { key: "phone", label: "Phone", minW: "min-w-[140px]" },
  { key: "date", label: "Date & Time", minW: "min-w-[160px]" },
  { key: "projectId", label: "Project ID", minW: "min-w-[140px]" },
  { key: "status", label: "Status", minW: "min-w-[120px]" },
  { key: "actions", label: "Actions", minW: "min-w-[100px]" },
] as const;

export default function LeadCRMTable({
  leads,
  currentPage,
  totalPages,
  onPageChange,
  getPageNumbers,
  dataLength,
  indexOfFirstItem,
  indexOfLastItem,
}: LeadCRMTableProps) {
  const pageNumbers = getPageNumbers();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const [data, setData] = useState<any>(null);
  const [mode, setMode] = useState<SheetMode>("");
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

  return (
    <div className="w-full bg-white">
      <LeadCRMSheet mode={mode} data={data} open={open} setOpen={setOpen} />
      <DeletePopUp open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}  />
      <div className="w-full rounded-xl overflow-hidden border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f3f6ff] text-gray-700">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    className={`px-4 py-3 text-sm font-bold ${header.minW} ${
                      header.key === "status" || header.key === "actions"
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
                const isLastTwo = index >= leads.length - 2;

                return (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                        <span className="font-semibold">{row.userName}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold">{row.email}</td>

                    <td className="px-4 py-3 font-semibold">{row.phone}</td>

                    <td className="px-4 py-3 font-semibold">{row.date}</td>

                    <td className="px-4 py-3 font-semibold">{row.projectId}</td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <span
                          className={`flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                            row.status.toLowerCase() === "active"
                              ? "bg-[#BCE288] text-[#2E6B2B]"
                              : "bg-[#FAA2A4] text-[#B44445]"
                          }`}
                        >
                          <Dot />
                          {row.status.charAt(0).toUpperCase() +
                            row.status.slice(1)}
                        </span>
                      </div>
                    </td>

                    <td className="relative px-4 py-3 mx-auto w-8">
                      <div
                        ref={openMenuId === row.id ? actionMenuRef : null}
                        className="relative col-span-2 flex justify-end"
                      >
                        <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === row.id ? null : row.id)
                          }
                          className="rounded-full bg-gray-100 p-2"
                        >
                          <EllipsisVertical size={16} />
                        </button>

                        {openMenuId === row.id && (
                          <div
                            className={`absolute right-0 z-10 w-36 rounded-lg overflow-hidden border bg-white shadow ${
                              isLastTwo ? "bottom-8" : "top-8"
                            }`}
                          >
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                setData(row);
                                setMode("view");
                                setOpen(true);
                              }}
                              className={`block w-full px-4 py-2 text-left text-xs hover:bg-gray-50 
                            
                        `}
                            >
                              Veiw
                            </button>
                            <button
                              onClick={() => {
                                setIsDeleteOpen(true);
                              }}
                              className={`block w-full px-4 py-2 text-left text-xs hover:bg-gray-50 
                            text-red-600
                            
                        `}
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                // setData(row);
                                // setMode("edit");
                                // setOpen(true);
                              }}
                              className={`block w-full px-4 py-2 text-left text-xs hover:bg-gray-50 `}
                            >
                              Export PDF
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
            <ChevronLeft size={16} /> Back
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              className={`h-7 w-7 rounded-full flex items-center justify-center ${
                page === currentPage
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <button className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
              <EllipsisVerticalIcon size={16} className="rotate-90" />
            </button>
          )}

          {totalPages > 5 && currentPage < totalPages - 1 && (
            <button
              className={`h-7 w-7 rounded-full flex items-center justify-center ${
                currentPage === totalPages
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          )}

          <button
            className="flex items-center gap-2 rounded-full border px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>

          {/* <div className="ml-4 text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, dataLength)} of {dataLength} entries
          </div> */}
        </div>
      </div>
    </div>
  );
}