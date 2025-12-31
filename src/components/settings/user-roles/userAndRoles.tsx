"use client";

import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import UserAndRolesSheet from "./userRoleSheet";
import DeletePopUp from "@/components/custom/popups/delete";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchUsers,
  deleteUser,
} from "@/lib/features/user/userApi";
import { fetchRoles } from "@/lib/features/role/roleApi";

export type SheetMode = "view" | "edit" | "create";

export default function UserAndRoles() {
  const dispatch = useAppDispatch();

  const { users, loading } = useAppSelector((state) => state.user);
  const { roles } = useAppSelector((state) => state.roles);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const [data, setData] = useState<any>(null);
  const [mode, setMode] = useState<SheetMode>("view");

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRoles());
  }, [dispatch]);

  return (
    <div className="bg-white">
      <UserAndRolesSheet
        mode={mode}
        setMode={setMode}
        data={data}
        open={open}
        setOpen={setOpen}
        roles={roles}
      />

      <DeletePopUp
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteUserId(null);
        }}
        onConfirm={async (id) => {
          try {
            await dispatch(deleteUser(id)).unwrap();
            setIsDeleteOpen(false);
            setDeleteUserId(null);
            dispatch(fetchUsers());
          } catch (error) {
            console.error("Failed to delete user:", error);
          }
        }}
        id={deleteUserId}
        title="Delete User?"
        description="Are you sure you want to delete this user? This action cannot be undone."
        buttonText="Delete User"
      />

      {/* ===== HEADER ===== */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          User & Roles
        </h2>

        <button
          onClick={() => {
            setMode("create");
            setData(null);
            setOpen(true);
          }}
          className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Add New User
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-hidden">
        <div className="grid grid-cols-12 bg-[#f3f6ff] p-4 text-sm font-semibold text-gray-700 rounded-b-md">
          <div className="col-span-6">User Name</div>
          <div className="col-span-4">Role</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* ===== LOADING ===== */}
        {loading && (
          <p className="p-4 text-sm text-gray-500">
            Loading users...
          </p>
        )}

        {/* ===== USERS LIST ===== */}
        {!loading &&
          users.map((user, index) => {
            const isLastTwo = index >= users.length - 2;

            return (
              <div
                key={user._id}
                className="grid grid-cols-12 items-center border-b p-4 text-sm"
              >
                {/* ===== USER NAME ===== */}
                <div className="col-span-6 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                    {user.profileImage && (
                      <img
                        src={user.profileImage}
                        alt={user.firstName}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <span className="font-medium text-gray-800">
                    {user.name}
                  </span>
                </div>

                {/* ===== ROLE ===== */}
                <div className="col-span-4">
                  <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700">
                    {typeof user.role === "object"
                      ? user.role.name
                      : "—"}
                  </span>
                </div>

                {/* ===== ACTIONS ===== */}
                <div className="relative col-span-2 flex justify-end">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === user._id ? null : user._id
                      )
                    }
                    className="rounded-full bg-gray-100 p-2"
                  >
                    <EllipsisVertical size={16} />
                  </button>

                  {openMenuId === user._id && (
                    <div
                      className={`absolute right-0 z-10 w-36 rounded-lg border bg-white shadow ${
                        isLastTwo ? "bottom-8" : "top-8"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          setData(user);
                          setMode("edit");
                          setOpen(true);
                        }}
                        className="block w-full px-4 py-2 text-left text-xs hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          setData(user);
                          setMode("view");
                          setOpen(true);
                        }}
                        className="block w-full px-4 py-2 text-left text-xs hover:bg-gray-50"
                      >
                        View
                      </button>

                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          setDeleteUserId(user._id);
                          setIsDeleteOpen(true);
                        }}
                        className="block w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-gray-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        {!loading && users.length === 0 && (
          <p className="p-4 text-sm text-gray-500">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}
