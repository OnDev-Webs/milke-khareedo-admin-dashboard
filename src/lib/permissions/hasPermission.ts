import { RootState } from "@/lib/store/store";

export const hasPermission = (
  state: RootState,
  permission: string
): boolean => {
  const { permissions, role } = state.auth;

  if (role?.name === "Super Admin") {
    return true;
  }

  if (!permissions) return false;

  const [module, action] = permission.split(".");

  return Boolean(
    permissions[module as keyof typeof permissions]?.[
      action as keyof typeof permissions[keyof typeof permissions]
    ]
  );
};
