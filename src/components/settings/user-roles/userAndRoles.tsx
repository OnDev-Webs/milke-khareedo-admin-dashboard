"use client";

import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import UserAndRolesSheet from "./userRoleSheet";
import DeletePopUp from "@/components/custom/popups/delete";

type User = {
  id: number;
  name: string;
  role: string;
};

const users: User[] = [
  { id: 1, name: "John Deo", role: "Superadmin" },
  { id: 2, name: "rav Deo", role: "Admin" },
  { id: 3, name: "Sin Deo", role: "Project Manager" },
  { id: 4, name: "de Deo", role: "Sales Agent" },
  { id: 5, name: "pav ", role: "Project Manager" },
  { id: 6, name: "John Deo", role: "Superadmin" },
];

export type SheetMode = "view" | "edit" | "create";
export default function UserAndRoles() {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);


  const [data, setData] = useState<any>(null);
  const [mode, setMode] = useState<SheetMode>("view");

  return (
    <div className="bg-white">
      <UserAndRolesSheet
        mode={mode}
        setMode={setMode}
        data={data}
        open={open}
        setOpen={setOpen}
      />

      <DeletePopUp
        open={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteUserId(null);
        }}
        onConfirm={async (id) => {
          try {
            console.log("DELETE USER ID 👉", id);


            setIsDeleteOpen(false);
            setDeleteUserId(null);

          } catch (error) {
            console.error("Failed to delete user:", error);
          }
        }}
        id={deleteUserId ? String(deleteUserId) : null}
        title="Delete User?"
        description="Are you sure you want to delete this user? This action cannot be undone."
        buttonText="Delete User"
      />


      <div className="mx-auto w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">User & Roles</h2>

          <button
            onClick={() => {
              setMode("create");
              setOpen(true);
            }}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Add New User
          </button>
        </div>

        <div className="overflow-hidden">
          <div className="grid grid-cols-12 bg-[#f3f6ff] p-4 text-sm font-semibold text-gray-700 rounded-b-md ">
            <div className="col-span-6">User Name</div>
            <div className="col-span-4">Role</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {users.map((user, index) => {
            const isLastTwo = index >= users.length - 2;

            return (
              <div
                key={user.id}
                className="grid grid-cols-12 items-center border-b p-4 text-sm">
                <div className="col-span-6 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200" />
                  <span className="font-medium text-gray-800">{user.name}</span>
                </div>

                <div className="col-span-4">
                  <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700">
                    {user.role}
                  </span>
                </div>

                <div className="relative col-span-2 flex justify-end">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === user.id ? null : user.id)
                    }
                    className="rounded-full bg-gray-100 p-2">
                    <EllipsisVertical size={16} />
                  </button>

                  {openMenuId === user.id && (
                    <div className={`absolute right-0 z-10 w-36 rounded-lg border bg-white shadow ${isLastTwo ? "bottom-8" : "top-8"}`}>
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          setData(user);
                          setMode("edit");
                          setOpen(true);
                        }}
                        className="block w-full px-4 py-2 text-left text-xs hover:bg-gray-50">
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          setData(user);
                          setMode("view");
                          setOpen(true);
                        }}
                        className="block w-full px-4 py-2 text-left text-xs hover:bg-gray-50">
                        View
                      </button>

                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          setDeleteUserId(user.id);
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
        </div>
      </div>
    </div>
  );
}