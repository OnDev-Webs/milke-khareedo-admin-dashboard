"use client";

import { addRole, fetchRoleById, updateRole } from "@/lib/features/role/roleApi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RolePermissionItem = {
  module: string;
  add: boolean;
  edit: boolean;
  view: boolean;
  delete: boolean;
};

type PermissionKey = "add" | "edit" | "view" | "delete";

type ModulePermission = {
  id: number;
  name: string;
  permissions: Record<PermissionKey, boolean>;
};

type Mode = "add" | "edit";

type Props = {
  mode?: Mode;
  defaultRoleName?: string;
  roleId?: string;
};


const INITIAL_MODULES: ModulePermission[] = [
  {
    id: 1,
    name: "Property",
    permissions: { add: false, edit: false, view: false, delete: false },
  },
  {
    id: 2,
    name: "Developer",
    permissions: { add: false, edit: false, view: false, delete: false },
  },
  {
    id: 3,
    name: "CRM",
    permissions: { add: false, edit: false, view: false, delete: false },
  },
  {
    id: 4,
    name: "Team",
    permissions: { add: false, edit: false, view: false, delete: false },
  },
  {
    id: 5,
    name: "Blogs",
    permissions: { add: false, edit: false, view: false, delete: false },
  },
];

const PERMISSIONS: PermissionKey[] = ["add", "edit", "view", "delete"];


export default function EditAccessControlTable({
  mode = "edit",
  defaultRoleName = "",
  roleId
}: Props) {
  const dispatch = useAppDispatch();
  const { selectedRole } = useAppSelector((state) => state.roles);

  const router = useRouter();

  const [roleName, setRoleName] = useState(defaultRoleName);
  const [modules, setModules] = useState<ModulePermission[]>(INITIAL_MODULES);



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

  useEffect(() => {
    if (mode === "edit" && roleId) {
      dispatch(fetchRoleById(roleId));
    }
  }, [mode, roleId, dispatch]);

  useEffect(() => {
    if (mode === "edit" && selectedRole?.permissions) {
      setRoleName(selectedRole.name);

      let permissionsArray: RolePermissionItem[] = [];

      if (Array.isArray(selectedRole.permissions)) {
        permissionsArray = selectedRole.permissions as RolePermissionItem[];
      }

      else {
        permissionsArray = Object.entries(selectedRole.permissions).map(
          ([module, perms]: any) => ({
            module,
            ...perms,
          })
        );
      }

      setModules(
        INITIAL_MODULES.map((m) => {
          const found = permissionsArray.find(
            (p) =>
              p.module.toLowerCase() === m.name.toLowerCase()
          );

          return found
            ? {
              ...m,
              permissions: {
                add: !!found.add,
                edit: !!found.edit,
                view: !!found.view,
                delete: !!found.delete,
              },
            }
            : m;
        })
      );
    }
  }, [selectedRole, mode]);


  useEffect(() => {
    if (mode === "add") {
      setRoleName("");
      setModules(INITIAL_MODULES);
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      alert("Role name is required");
      return;
    }

    const permissionsPayload = modules.reduce((acc, m) => {
      acc[m.name.toLowerCase()] = {
        add: m.permissions.add,
        edit: m.permissions.edit,
        view: m.permissions.view,
        delete: m.permissions.delete,
      };
      return acc;
    }, {} as Record<string, any>);

    try {
      if (mode === "add") {
        await dispatch(
          addRole({
            name: roleName,
            permissions: permissionsPayload,
          })
        ).unwrap();
      }

      if (mode === "edit" && roleId) {
        await dispatch(
          updateRole({
            id: roleId,
            name: roleName,
            permissions: permissionsPayload,
          })
        ).unwrap();
      }

      router.back();
    } catch (error: any) {
      console.error("ROLE SAVE FAILED 👉", error);
      alert(error?.message || "Something went wrong");
    }
  };


  return (
    <div className="mx-auto w-full rounded-xl bg-white h-full">
      <form
        onSubmit={handleSubmit}
        className="p-6 h-[86vh] flex flex-col justify-between"
      >
        <div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Role Name
            </label>
            <input
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
              className="w-full rounded-lg border px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* ===== Header ===== */}
          <div className="mb-2 flex items-center justify-between rounded-lg bg-[#EEF0FB] px-4 py-3">
            <h3 className="text-sm font-bold text-black">Access</h3>

            <label className="flex items-center gap-2 text-xs font-medium bg-white px-4 py-2 rounded">
              <input
                type="checkbox"
                className="h-4 w-4 rounded accent-[#E6F3FF]"
                onChange={(e) => toggleSelectAll(e.target.checked)}
              />
              Select All
            </label>
          </div>

          {/* ===== Permission Rows ===== */}
          <div className="divide-y rounded-lg">
            {modules.map((module) => (
              <div
                key={module.id}
                className="grid grid-cols-12 items-center px-4 py-4 text-sm"
              >
                <div className="col-span-3 font-semibold text-[#2B2B25]">
                  {module.name}
                </div>

                <div className="col-span-7 flex items-center gap-6 text-xs font-medium">
                  {PERMISSIONS.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-2 capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={module.permissions[perm]}
                        onChange={() =>
                          togglePermission(module.id, perm)
                        }
                        className="h-4 w-4 rounded accent-[#E6F3FF]"
                      />
                      {perm}
                    </label>
                  ))}
                </div>

                <div className="col-span-2 text-right text-xs">
                  <button
                    type="button"
                    onClick={() => toggleRowAll(module.id, true)}
                    className="font-medium text-[#4CAF50]"
                  >
                    All
                  </button>
                  <span className="mx-1">|</span>
                  <button
                    type="button"
                    onClick={() => toggleRowAll(module.id, false)}
                    className="font-medium"
                  >
                    None
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Footer ===== */}
        <div className="mt-10 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border px-5 py-2 text-sm font-medium text-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white"
          >
            {mode === "add" ? "Create Role" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
