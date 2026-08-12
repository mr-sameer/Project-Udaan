export type AppRole =
  | "volunteer"
  | "donor"
  | "mentor"
  | "coordinator"
  | "admin"
  | "super_admin";

// Roles a client is ever allowed to request for themselves at
// registration time. "admin" and "super_admin" are deliberately
// absent — they can only be granted by an existing admin, server-
// side, through /admin/volunteers.
export const SELF_ASSIGNABLE_ROLES: AppRole[] = ["volunteer", "donor"];

export const STAFF_ROLES: AppRole[] = ["coordinator", "admin", "super_admin"];
export const ADMIN_ROLES: AppRole[] = ["admin", "super_admin"];

export function dashboardPathForRole(roles: AppRole[]): string {
  if (roles.some((r) => ADMIN_ROLES.includes(r))) return "/admin";
  if (roles.includes("coordinator")) return "/admin";
  if (roles.includes("mentor")) return "/dashboard/mentor";
  if (roles.includes("donor") && !roles.includes("volunteer")) return "/dashboard/donor";
  return "/dashboard/volunteer";
}
