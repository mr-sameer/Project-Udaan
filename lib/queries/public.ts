import { createClient } from "@/lib/supabase/server";

export async function getPublicProjects() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProjectBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("visibility", "public")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getProjectUpdates(projectId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project_updates")
    .select("*")
    .eq("project_id", projectId)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getActiveCampaigns() {
  const supabase = createClient();

  // campaign_totals is a VIEW (aggregated from donations), not a
  // table with a foreign key to campaigns — PostgREST can't embed
  // through it, so we query both and join them in application code
  // instead. This also means campaigns with zero successful
  // donations still appear (an inner-join embed would have silently
  // dropped them).
  const { data: campaigns, error: campaignsError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (campaignsError) throw campaignsError;
  if (!campaigns || campaigns.length === 0) return [];

  const { data: totals, error: totalsError } = await supabase
    .from("campaign_totals")
    .select("campaign_id, amount_raised, supporter_count")
    .in("campaign_id", campaigns.map((c) => c.id));

  if (totalsError) throw totalsError;

  const totalsByCampaignId = new Map((totals ?? []).map((t) => [t.campaign_id, t]));

  // Keep the same shape the previous embed produced
  // (campaign_totals as an array on each campaign row) so
  // FundraisingSection.tsx and any other caller doesn't need to
  // change. A campaign with no successful donations yet simply
  // won't have a campaign_totals row (the view's left join still
  // returns amount_raised/supporter_count as 0 for it once a row
  // does exist, and here we default to 0 even if the row is
  // entirely missing).
  return campaigns.map((c) => {
    const t = totalsByCampaignId.get(c.id);
    return {
      ...c,
      campaign_totals: [
        {
          amount_raised: t?.amount_raised ?? 0,
          supporter_count: t?.supporter_count ?? 0,
        },
      ],
    };
  });
}

export async function getCampaignBySlug(slug: string) {
  const supabase = createClient();
  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("slug", slug)
    .in("status", ["active", "completed"])
    .maybeSingle();

  if (error) throw error;
  if (!campaign) return null;

  const { data: totals } = await supabase
    .from("campaign_totals")
    .select("*")
    .eq("campaign_id", campaign.id)
    .maybeSingle();

  return { ...campaign, totals };
}

export async function getVerifiedImpact() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("verified_impact")
    .select("*")
    .order("verified_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPublishedStories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getStoryBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getOrganizationSettings() {
  const supabase = createClient();
  const { data, error } = await supabase.from("organization_settings").select("*").maybeSingle();
  if (error) throw error;
  return data;
}
