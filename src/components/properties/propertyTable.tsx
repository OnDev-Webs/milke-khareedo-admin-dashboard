"use client";

import {
  ChevronLeft,
  ChevronRight,
  Dot,
  EllipsisVertical,
  EllipsisVerticalIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PropertiesSheet from "./propertiesSheet";
import DeletePopUp from "../custom/popups/delete";

interface Property {
  id: number;
  propertyName: string;
  developer: string;
  city: string;
  groupCount: string;
  amount: number;
  status: string;
}

interface PropertiesTableProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  getPageNumbers: () => number[];
  dataLength: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
}
export type SheetMode = "view" | "edit" | null;
export default function PropertiesTable({
  properties,
  currentPage,
  totalPages,
  onPageChange,
  getPageNumbers,
  dataLength,
  indexOfFirstItem,
  indexOfLastItem,
}: PropertiesTableProps) {
  const pageNumbers = getPageNumbers();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const [data, setData] = useState<any>(null);
  const [mode, setMode] = useState<SheetMode>(null);
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
      <PropertiesSheet mode={mode} data={data} open={open} setOpen={setOpen} />

      <DeletePopUp open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} />
      <div className="w-full rounded-xl border bg-white overflow-x-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f3f6ff] text-left text-gray-700">
              <tr>
                <th className="px-4 py-3 font-bold text-sm">Property Name</th>
                <th className="px-4 py-3 font-bold text-sm">Developer</th>
                <th className="px-4 py-3 font-bold text-sm">City</th>
                <th className="px-4 py-3 font-bold text-sm text-center">
                  Group's Count
                </th>
                <th className="px-4 py-3 font-bold text-sm text-center">
                  Amount
                </th>
                <th className="px-4 py-3 font-bold text-sm text-center">
                  Status
                </th>
                <th className="px-4 py-3 font-bold text-sm text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {properties.map((row, index) => {
                const isLastTwo = index >= properties.length - 2;

                return (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="min-h-8 min-w-8 rounded-full bg-gray-200" />
                        <span className="font-semibold text-sm text-gray-800">
                          {row.propertyName}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-sm text-gray-600">
                      {row.developer}
                    </td>

                    <td className="px-4 py-3 font-semibold text-sm text-gray-600">
                      {row.city}
                    </td>

                    <td className="px-4 py-3 text-gray-400 flex items-center justify-center">
                      <div>
                        <span className="font-semibold text-sm text-gray-700">
                          {row.groupCount}
                        </span>{" "}
                        / 10
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-sm text-gray-600 text-center">
                      ${row.amount.toLocaleString()}
                    </td>

                    <td className="px-2 py-3">
                      <div className="flex items-center justify-center">
                        <div
                          className={`rounded-full flex px-2 py-1 font-semibold text-sm ${
                            row.status.toLowerCase() === "active"
                              ? "bg-[#BCE288] text-[#2E6B2B]"
                              : "bg-[#FAA2A4] text-[#B44445]"
                          }`}
                        >
                          <Dot /> <span className="pr-3">{row.status}</span>
                        </div>
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
                            className={`absolute right-0 z-10 w-36 rounded-lg border bg-white shadow ${
                              isLastTwo ? "bottom-8" : "top-8"
                            }`}
                          >
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                setData(row);
                                setMode("edit");
                                setOpen(true);
                              }}
                              className={`block w-full px-4 py-2 text-left text-xs hover:bg-gray-50 `}
                            >
                              Edit
                            </button>
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
              className={`rounded-full w-7 h-7 flex items-center justify-center ${
                currentPage === page
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
              className={`rounded-full w-7 h-7 flex items-center justify-center ${
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
