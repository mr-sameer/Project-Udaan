import "server-only";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_ROLES, STAFF_ROLES, type AppRole } from "./roles";

/**
 * Every server action and Server Component that performs a
 * sensitive read/write should call one of these instead of
 * inlining a role check. That keeps authorization logic in one
 * auditable place, and keeps it consistent with the RLS policies
 * in supabase/migrations/0002_rls_policies.sql — this file is the
 * TypeScript mirror of has_role()/is_staff()/is_admin() in
 * Postgres. RLS is still the real enforcement boundary (a bug
 * here can't grant DB access it doesn't have); this layer exists
 * so the UI fails closed and gives a clean 403 instead of a raw
 * Postgres permission error.
 */

export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentUserRoles(): Promise<AppRole[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  return (data ?? []).map((r) => r.role as AppRole);
}

export async function hasRole(role: AppRole): Promise<boolean> {
  const roles = await getCurrentUserRoles();
  return roles.includes(role);
}

export async function isStaff(): Promise<boolean> {
  const roles = await getCurrentUserRoles();
  return roles.some((r) => STAFF_ROLES.includes(r));
}

export async function isAdmin(): Promise<boolean> {
  const roles = await getCurrentUserRoles();
  return roles.some((r) => ADMIN_ROLES.includes(r));
}

/** Throws if the current user isn't authenticated. Call at the top
 *  of every protected server action before touching the database. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new AuthorizationError("Not authenticated.");
  return user;
}

export async function requireStaff() {
  const user = await requireUser();
  if (!(await isStaff())) throw new AuthorizationError("Staff access required.");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!(await isAdmin())) throw new AuthorizationError("Admin access required.");
  return user;
}

export class AuthorizationError extends Error {
  constructor(message = "Not authorized.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

// Named permission checks, matching section 15 of the spec.
// These are thin wrappers today (staff vs admin) but give every
// call site a single, greppable, renameable choke point if the
// rules ever need to diverge (e.g. only coordinators who are also
// assigned to a project can verify its contributions).
export const canManageProjects = isStaff;
export const canVerifyContributions = isStaff;
export const canManageVolunteers = isStaff;
export const canManageCampaigns = isStaff;
export const canViewDonations = isStaff;
export const canManageUsers = isAdmin;
export const canPublishStories = isStaff;
export const canVerifyImpact = isAdmin;
