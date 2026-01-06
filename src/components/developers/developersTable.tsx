import { EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DeveloperSheet, { SheetMode } from "./developersSheet";
import DeletePopUp from "../custom/popups/delete";
import { Developer } from "@/lib/features/developers/developerSlice";
import { deleteDeveloper } from "@/lib/features/developers/developerApi";
import { useAppDispatch } from "@/lib/store/hooks";
interface DevelopersTableProps {
  developers: Developer[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const TABLE_HEADERS = [
  { key: "name", label: "Developer Name" },
  { key: "projectCount", label: "No of Projects" },
  { key: "city", label: "City" },
  { key: "actions", label: "Actions" },
] as const;

export default function DevelopersTable({
  developers,
  onLoadMore,
  hasMore,
}: DevelopersTableProps) {

  const dispatch = useAppDispatch();
  const [openMenuId, setOpenMenuId] = useState<number | string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

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

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteDeveloper(id)).unwrap();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="w-full bg-white">
      <DeveloperSheet mode={mode} data={data} open={open} setOpen={setOpen} />
      <DeletePopUp
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteId(null);
        }}
        id={deleteId}
        title="Delete Developer?"
        description="Are you sure you want to delete this developer? This action cannot be undone."
        buttonText="Delete"
        onConfirm={(id) => handleDelete(id)}
      />
      <div className="w-full rounded-xl border bg-white overflow-x-hidden">
        <div className="relative overflow-x-auto overflow-y-visible">
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
              {developers.map((row) => {
                return (
                  <tr key={row?._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200" >
                          <img src={row?.logo} alt="logo" className="rounded-full h-8 w-8" />
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
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenuPosition({
                              top: rect.bottom + 8,
                              left: rect.right - 144,
                            });

                            setOpenMenuId(openMenuId === row?._id ? null : row?._id);
                          }}
                          className="rounded-full bg-gray-100 p-2"
                        >
                          <EllipsisVertical size={16} />
                        </button>

                        {openMenuId === row?._id && menuPosition && (
                          <div
                            className="fixed z-[9999] w-36 rounded-lg border bg-white shadow"
                            style={{
                              top: menuPosition.top,
                              left: menuPosition.left,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
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
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                                setData(row);
                                setMode("view");
                                setOpen(true);
                              }}
                              className={`block w-full px-4 py-2 text-left text-xs hover:bg-gray-50 
                            
                        `}>
                              Veiw
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                                setDeleteId(row._id);
                                setIsDeleteOpen(true);
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

        {hasMore && (
          <div className="flex justify-center border-t p-4">
            <button
              onClick={onLoadMore}
              className="rounded-full border px-6 py-2 font-semibold hover:bg-gray-100"
            >
              Learn more
            </button>
          </div>
        )}

      </div>
    </div>
  );
}