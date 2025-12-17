"use client";

import { useState } from "react";

type PermissionKey = "add" | "edit" | "view" | "delete";

type ModulePermission = {
  id: number;
  name: string;
  permissions: Record<PermissionKey, boolean>;
};

const INITIAL_MODULES: ModulePermission[] = [
  {
    id: 1,
    name: "Property",
    permissions: { add: false, edit: false, view: true, delete: true },
  },
  {
    id: 2,
    name: "Developer",
    permissions: { add: false, edit: false, view: true, delete: false },
  },
  {
    id: 3,
    name: "Team",
    permissions: { add: false, edit: false, view: true, delete: false },
  },
  {
    id: 4,
    name: "Property",
    permissions: { add: false, edit: false, view: true, delete: true },
  },
  {
    id: 5,
    name: "Property",
    permissions: { add: false, edit: false, view: false, delete: false },
  },
];

const PERMISSIONS: PermissionKey[] = ["add", "edit", "view", "delete"];

export default function EditAccessControlTable() {
  const [modules, setModules] = useState<ModulePermission[]>(INITIAL_MODULES);

  // For single
  const togglePermission = (moduleId: number, key: PermissionKey) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              permissions: {
                ...m.permissions,
                [key]: !m.permissions[key],
              },
            }
          : m
      )
    );
  };

  // For row
  const toggleRowAll = (moduleId: number, value: boolean) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              permissions: {
                add: value,
                edit: value,
                view: value,
                delete: value,
              },
            }
          : m
      )
    );
  };

  // For All
  const toggleSelectAll = (value: boolean) => {
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        permissions: {
          add: value,
          edit: value,
          view: value,
          delete: value,
        },
      }))
    );
  };

  return (
    <div className="mx-auto w-full rounded-xl bg-white h-full">
        
      <form className="p-6 h-[86vh] flex flex-col justify-between">
        <div>
          <div className="mb-2 flex items-center justify-between rounded-lg bg-[#f3f6ff] px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">Access</h3>

            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border"
                onChange={(e) => toggleSelectAll(e.target.checked)}
              />
              Select All
            </label>
          </div>

          <div className="divide-y rounded-lg">
            {modules.map((module) => (
              <div
                key={module.id}
                className="grid grid-cols-12 items-center px-4 py-4 text-sm"
              >
                <div className="col-span-3 font-medium text-gray-800">
                  {module.name}
                </div>

                <div className="col-span-7 flex items-center gap-6 text-xs text-gray-700">
                  {PERMISSIONS.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-2 capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={module.permissions[perm]}
                        onChange={() => togglePermission(module.id, perm)}
                        className="h-4 w-4 rounded"
                      />
                      {perm}
                    </label>
                  ))}
                </div>

                <div className="col-span-2 text-right text-xs">
                  <button
                    type="button"
                    onClick={() => toggleRowAll(module.id, true)}
                    className="font-semibold text-green-600"
                  >
                    All
                  </button>
                  <span className="mx-1 text-gray-400">|</span>
                  <button
                    type="button"
                    onClick={() => toggleRowAll(module.id, false)}
                    className="font-semibold text-gray-500"
                  >
                    None
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border px-5 py-2 text-sm font-medium text-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white"
          >
            Save Access
          </button>
        </div>
      </form>
    </div>
  );
}
