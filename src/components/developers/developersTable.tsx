import {
  ChevronLeft,
  ChevronRight,
  Dot,
  EllipsisVertical,
  EllipsisVerticalIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DeveloperSheet, { SheetMode } from "./developersSheet";
import PropertiesSheet from "../properties/propertiesSheet";
import DeletePopUp from "../custom/popups/delete";
import { Developer } from "@/lib/features/developers/developerSlice";

interface DevelopersTableProps {
  developers: Developer[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  getPageNumbers: () => number[];
  dataLength: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
}

const TABLE_HEADERS = [
  { key: "name", label: "Developer Name" },
  { key: "projectCount", label: "No of Projects" },
  { key: "city", label: "City" },
  { key: "actions", label: "Actions" },
] as const;

export default function DevelopersTable({
  developers,
  currentPage,
  totalPages,
  onPageChange,
  getPageNumbers,
  dataLength,
  indexOfFirstItem,
  indexOfLastItem,
}: DevelopersTableProps) {
  const pageNumbers = getPageNumbers();
  const [openMenuId, setOpenMenuId] = useState<number | string| null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [mode, setMode] = useState<SheetMode>("create");
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
      <DeveloperSheet mode={mode} data={data} open={open} setOpen={setOpen} />
      {/* <DeletePopUp open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} /> */}
      <div className="w-full rounded-xl border bg-white overflow-x-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* TABLE HEADER */}
            <thead className="bg-[#f3f6ff] text-left text-gray-700">
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th key={header.key} className="px-4 py-3 text-sm font-bold">
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {developers?.map((row, index) => {
                const isLastTwo = index >= developers?.length - 2;

                return (
                  <tr key={row?._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200" >
                          <img src={row?.logo} alt="logo"  className="rounded-full h-8 w-8" />
                        </div>
                        <span className="font-semibold text-gray-800">
                          <div> {row?.developerName}</div>
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div>
                        <span className="font-semibold text-gray-700">
                          {row?.totalProjects ? row.totalProjects : "-"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-600">
                      <div>{row.city}</div>
                    </td>

                    <td className="relative px-4 py-3 mx-auto w-8">
                      <div
                        ref={openMenuId === row?._id ? actionMenuRef : null}
                        className="relative col-span-2 flex justify-end"
                      >
                        <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === row?._id ? null : row?._id)
                          }
                          className="rounded-full bg-gray-100 p-2"
                        >
                          <EllipsisVertical size={16} />
                        </button>

                        {openMenuId === row?._id && (
                          <div
                            className={`absolute right-0 z-10 w-36 rounded-lg border bg-white shadow ${isLastTwo ? "bottom-8" : "top-8"}`}
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
            className="flex items-center gap-2 rounded-full border px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              className={`flex h-7 w-7 items-center justify-center rounded-full ${
                page === currentPage
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
              <EllipsisVerticalIcon size={16} className="rotate-90" />
            </button>
          )}

          {totalPages > 5 && currentPage < totalPages - 1 && (
            <button
              className={`flex h-7 w-7 items-center justify-center rounded-full ${
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
        </div>
      </div>
    </div>
  );
}