"use client";

import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import AccessControlSheet from "./accessControlSheet";

type Role = {
  id: number;
  name: string;
};

const roles: Role[] = [
  { id: 1, name: "Super admin" },
  { id: 2, name: "Admin" },
  { id: 3, name: "Project Manager" },
  { id: 4, name: "Sales Agent" },
];

export default function AccessControl() {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(true);
  return (
    <div className=" bg-white">
      <AccessControlSheet open={open} setOpen={setOpen} />
      <div className="mx-auto w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Access Control
          </h2>

          <button
            type="button"
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Add New Role
          </button>
        </div>

        <div className="overflow-hidden">
          <div className="grid grid-cols-12 bg-[#f3f6ff] p-4 text-sm font-semibold text-gray-700 mb-4 rounded-md">
            <div className="col-span-5">Access Levels</div>
            <div className="col-span-5">Assign Employees</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {roles.map((role) => (
            <div
              key={role.id}
              className="grid grid-cols-12 items-center border p-4 mb-4 rounded-md"
            >
              <div className="col-span-5">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700">
                  {role.name}
                </span>
              </div>

              <div className="col-span-5">
                <button
                  type="button"
                  className="rounded-lg border px-4 py-1.5 text-xs font-medium text-gray-600"
                >
                  + Assign Employees
                </button>
              </div>

              <div className="relative col-span-2 flex justify-end">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === role.id ? null : role.id)
                  }
                  className="rounded-full bg-gray-100 p-2"
                >
                  <EllipsisVertical size={16} />
                </button>

                {openMenuId === role.id && (
                  <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border bg-white shadow">
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                      }}
                      className={`block w-full px-4 py-2 text-left text-xs hover:bg-gray-50 `}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                      }}
                      className={`block w-full px-4 py-2 text-left text-xs hover:bg-gray-50 
                            text-red-600
                            
                        `}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
