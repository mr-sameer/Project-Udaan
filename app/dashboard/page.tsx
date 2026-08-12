import { redirect } from "next/navigation";
import { getCurrentUserRoles } from "@/lib/permissions";
import { dashboardPathForRole } from "@/lib/permissions/roles";

export default async function DashboardIndexPage() {
  const roles = await getCurrentUserRoles();
  redirect(dashboardPathForRole(roles));
}
