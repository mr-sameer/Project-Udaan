import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * ⚠️ Service-role client. Bypasses RLS entirely.
 *
 * The `server-only` import above makes it a build error to ever
 * import this file from a Client Component. Use it ONLY for:
 *   - the payment webhook handler (verifying a signed payload
 *     before writing payment_status = 'successful')
 *   - issuing certificates / generating signed receipt URLs
 *   - anything explicitly documented as needing to bypass RLS
 *
 * Every other query — including admin dashboard queries — should
 * go through lib/supabase/server.ts and rely on the admin/staff
 * RLS policies instead. Reaching for this file is a signal to
 * double check whether RLS could do the job instead.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Refusing to create an admin client."
    );
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
