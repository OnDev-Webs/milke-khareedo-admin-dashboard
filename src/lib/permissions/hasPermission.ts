import { RootState } from "@/lib/store/store";

export const hasPermission = (
  state: RootState,
  permission: string
): boolean => {
  const permissions = state.auth.permissions;

  if (!permissions) return false;

  const [module, action] = permission.split(".");

  return Boolean(
    permissions[module as keyof typeof permissions]?.[
      action as keyof typeof permissions[keyof typeof permissions]
    ]
  );
};
