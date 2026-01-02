"use client";

import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import AccessControlSheet from "./accessControlSheet";
import { useRouter } from "next/navigation";
import DeletePopUp from "@/components/custom/popups/delete";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { deleteRole, fetchRoles } from "@/lib/features/role/roleApi";
import { fetchUsers } from "@/lib/features/user/userApi";
import Loader from "@/components/ui/loader";

export default function AccessControl() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  const router = useRouter();

  const { roles, loading } = useAppSelector((state) => state.roles);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);

  /* ================= FETCH ROLES ================= */
  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchUsers());
  }, [dispatch]);


  return (
    <div className="bg-white">
      <AccessControlSheet open={open} setOpen={setOpen} roleId={selectedRoleId} />

      <DeletePopUp
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteRoleId(null);
        }}
        onConfirm={async (id) => {
          try {
            await dispatch(deleteRole(id)).unwrap();
            setIsDeleteOpen(false);
            setDeleteRoleId(null);
          } catch (error) {
            console.error("Failed to delete role:", error);
          }
        }}
        id={deleteRoleId}
        title="Delete Role?"
        description="Are you sure you want to delete this role? This action cannot be undone."
        buttonText="Delete Role"
      />

      <div className="mx-auto w-full">
        {/* ===== HEADER ===== */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Access Control
          </h2>

          <button
            type="button"
            onClick={() => router.push("/settings/add-access")}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Add New Role
          </button>
        </div>

        {/* ===== TABLE HEADER ===== */}
        <div className="grid grid-cols-12 bg-[#f3f6ff] p-4 text-sm font-semibold text-gray-700 mb-4 rounded-md">
          <div className="col-span-5">Access Levels</div>
          <div className="col-span-5">Assign Employees</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* ===== LOADING ===== */}
        {loading && (
          <p className="text-sm text-gray-500 px-4"><Loader size={38}/></p>
        )}

        {/* ===== ROLES LIST ===== */}
        {roles.map((role) => (
          <div
            key={role._id}
            className="grid grid-cols-12 items-center border p-4 mb-4 rounded-md"
          >
            <div className="col-span-5">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700">
                {role.name}
              </span>
            </div>

            <div className="col-span-5">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {users
                    .filter((u) => {
                      if (!u.role) return false;

                      if (typeof u.role === "string") {
                        return u.role === role._id;
                      }

                      return u.role._id === role._id;
                    })
                    .slice(0, 4)
                    .map((u) => (
                      <img
                        key={u._id}
                        src={u.profileImage || "/images/user.jfif"}
                        className="h-6 w-6 rounded-full border"
                        title={`${u.firstName} ${u.lastName}`}
                      />
                    ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedRoleId(role._id);
                    setOpen(true);
                  }}
                  className="rounded-lg border px-3 py-1 text-xs"
                >
                  + Assign Employees
                </button>
              </div>


            </div>

            <div className="relative col-span-2 flex justify-end">
              <button
                onClick={() =>
                  setOpenMenuId(openMenuId === role._id ? null : role._id)
                }
                className="rounded-full bg-gray-100 p-2"
              >
                <EllipsisVertical size={16} />
              </button>

              {openMenuId === role._id && (
                <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border bg-white shadow">
                  <button
                    onClick={() => {
                      setOpenMenuId(null);
                      router.push(`/settings/edit-access/${role._id}`);
                    }}
                    className="block w-full px-4 py-2 text-left text-xs hover:bg-gray-50"
                  >
                    Edit Role
                  </button>

                  <button
                    onClick={() => {
                      setOpenMenuId(null);
                      setDeleteRoleId(role._id);
                      setIsDeleteOpen(true);
                    }}
                    className="block w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-gray-50"
                  >
                    Delete Role
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {!loading && roles.length === 0 && (
          <p className="text-sm text-gray-500 px-4">
            No roles found.
          </p>
        )}
      </div>
    </div>
  );
}
