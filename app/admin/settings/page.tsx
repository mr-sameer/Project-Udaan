import { createClient } from "@/lib/supabase/server";
import { updateOrganizationSettings } from "@/lib/queries/settings";

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("organization_settings").select("*").maybeSingle();

  return (
    <div>
      <h1 className="font-display text-indigo text-2xl md:text-3xl mb-1">Organization Settings</h1>
      <p className="font-body text-ink-soft text-sm mb-8">
        Leave registration/PAN/80G/FCRA fields blank until you actually have them — the public Transparency
        section shows "Pending" for anything empty here, never a fabricated value.
      </p>

      <form action={updateOrganizationSettings} className="grid sm:grid-cols-2 gap-4 max-w-3xl">
        <input name="orgName" defaultValue={settings?.org_name ?? ""} placeholder="Organization name" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2" />
        <input name="legalName" defaultValue={settings?.legal_name ?? ""} placeholder="Legal name" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2" />
        <input name="contactEmail" defaultValue={settings?.contact_email ?? ""} placeholder="Contact email" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
        <input name="phone" defaultValue={settings?.phone ?? ""} placeholder="Phone" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
        <input name="website" defaultValue={settings?.website ?? ""} placeholder="Website" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2" />
        <input name="registrationNumber" defaultValue={settings?.registration_number ?? ""} placeholder="Registration number (leave blank if not yet obtained)" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2" />
        <input name="pan" defaultValue={settings?.pan ?? ""} placeholder="PAN (leave blank if not yet obtained)" className="rounded-xl border border-sandstone px-4 py-2.5 text-sm" />
        <select name="status80g" defaultValue={settings?.status_80g ?? "Pending"} className="rounded-xl border border-sandstone px-4 py-2.5 text-sm">
          <option value="Pending">80G: Pending</option>
          <option value="Obtained">80G: Obtained</option>
          <option value="Not applicable">80G: Not applicable</option>
        </select>
        <select name="statusFcra" defaultValue={settings?.status_fcra ?? "Pending"} className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2">
          <option value="Pending">FCRA: Pending</option>
          <option value="Obtained">FCRA: Obtained</option>
          <option value="Not applicable">FCRA: Not applicable</option>
        </select>
        <textarea name="mission" defaultValue={settings?.mission ?? ""} placeholder="Mission statement" rows={3} className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2" />
        <textarea name="aboutText" defaultValue={settings?.about_text ?? ""} placeholder="About text (shown on /about)" rows={4} className="rounded-xl border border-sandstone px-4 py-2.5 text-sm sm:col-span-2" />
        <button type="submit" className="sm:col-span-2 rounded-full bg-kesari text-parchment font-bold text-sm py-3">
          Save Settings
        </button>
      </form>
    </div>
  );
}
