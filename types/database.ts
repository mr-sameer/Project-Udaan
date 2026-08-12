/**
 * Hand-written types mirroring supabase/migrations/0001-0005_*.sql.
 *
 * IMPORTANT — why this file is shaped the way it is:
 * @supabase/postgrest-js requires `Database[schema]` to satisfy its
 * internal `GenericSchema` type:
 *
 *   type GenericTable = { Row: ...; Insert: ...; Update: ...; Relationships: GenericRelationship[] }
 *   type GenericView  = { Row: ...; Relationships: GenericRelationship[] }  (+ Insert/Update if updatable)
 *   type GenericSchema = { Tables: Record<string, GenericTable>; Views: Record<string, GenericView>; Functions: Record<string, GenericFunction> }
 *
 * The previous version of this file omitted `Relationships` on every
 * table/view and omitted `Functions` entirely, so `Database["public"]`
 * didn't structurally satisfy `GenericSchema`. When that happens,
 * PostgrestClient's generics can't resolve `Row`/`Insert`/`Update` for
 * any table, and TypeScript collapses the inferred type to `never`
 * everywhere a query result was used (`Property 'x' does not exist on
 * type 'never'`) — that's the exact class of error this fixes.
 *
 * Once you've pushed the migrations to your real Supabase project,
 * you can replace this file with a generated one for full accuracy:
 *
 *   npx supabase gen types typescript --project-id <your-project-id> > types/database.ts
 *
 * Relationships arrays below are left empty (`[]`). This is
 * deliberate, not a shortcut: `Relationships` only affects whether
 * PostgREST's embedded-resource syntax (`.select("*, other_table(...)")`)
 * type-checks for a *specific* foreign key. No query in this codebase
 * relies on that (the campaign_totals bug fix replaced the one place
 * that tried to with two plain queries joined in application code —
 * see lib/queries/public.ts), so an accurate-but-empty Relationships
 * array is correct here, not a stand-in for something missing. Fill
 * them in (or just run `supabase gen types`) if a future query needs
 * PostgREST embedding.
 */

// ------------------------------------------------------------
// Enums (exact match to `create type ... as enum (...)` in 0001)
// ------------------------------------------------------------

export type AppRole = "volunteer" | "donor" | "mentor" | "coordinator" | "admin" | "super_admin";
export type ApplicationStatus = "pending" | "under_review" | "approved" | "rejected" | "waitlisted";
export type ProjectStatus = "planning" | "preparing" | "active" | "completed" | "paused" | "cancelled";
export type ProjectVisibility = "public" | "unlisted" | "private";
export type ProjectMemberRole =
  | "lead" | "volunteer" | "mentor" | "trainer" | "coordinator" | "researcher" | "content_creator";
export type TaskStatus = "todo" | "in_progress" | "completed" | "blocked";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type ContributionType =
  | "teaching" | "mentoring" | "fundraising" | "technology" | "content"
  | "research" | "community_outreach" | "event" | "equipment" | "administration" | "other";
export type ContributionStatus = "pending" | "verified" | "rejected";
export type CampaignStatus = "draft" | "active" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "successful" | "failed" | "refunded" | "cancelled";
export type PaymentProvider = "razorpay" | "cashfree" | "mock";
export type StoryStatus = "draft" | "review" | "published" | "archived";
export type ProfileStatus = "active" | "suspended" | "deactivated";

// ------------------------------------------------------------
// Row types (one per table, exact column list from 0001 + 0005)
// ------------------------------------------------------------

export type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  profile_photo_url: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  education: string | null;
  occupation: string | null;
  skills: string[] | null;
  linkedin_url: string | null;
  website_url: string | null;
  preferred_language: string;
  status: ProfileStatus;
  created_at: string;
  updated_at: string;
};

export type UserRoleRow = {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  updated_at: string;
};

export type VolunteerApplication = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string | null;
  state: string | null;
  education: string | null;
  skills: string[] | null;
  experience: string | null;
  availability: string | null;
  preferred_areas: string[] | null;
  motivation: string | null;
  status: ApplicationStatus;
  reviewer_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  focus_area: string | null;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  target_beneficiaries: number | null;
  funding_goal: number | null;
  cover_image_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectLocation = {
  id: string;
  project_id: string;
  label: string;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

export type ProjectMember = {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectMemberRole;
  assigned_by: string | null;
  created_at: string;
};

export type ProjectUpdate = {
  id: string;
  project_id: string;
  title: string;
  body: string | null;
  image_url: string | null;
  published: boolean;
  created_by: string | null;
  created_at: string;
};

export type Task = {
  id: string;
  project_id: string;
  assigned_to: string | null;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type VolunteerContribution = {
  id: string;
  user_id: string;
  project_id: string | null;
  task_id: string | null;
  contribution_type: ContributionType;
  contribution_date: string;
  hours: number | null;
  people_supported: number | null;
  description: string | null;
  evidence_url: string | null;
  status: ContributionStatus;
  verified_by: string | null;
  verified_at: string | null;
  verification_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Campaign = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  project_id: string | null;
  goal_amount: number;
  start_date: string | null;
  end_date: string | null;
  status: CampaignStatus;
  cover_image_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Donation = {
  id: string;
  donor_user_id: string | null;
  project_id: string | null;
  campaign_id: string | null;
  amount: number;
  currency: string;
  payment_provider: PaymentProvider;
  provider_order_id: string | null;
  provider_payment_id: string | null;
  payment_status: PaymentStatus;
  receipt_number: string | null;
  receipt_url: string | null;
  show_name_publicly: boolean;
  created_at: string;
  updated_at: string;
};

export type ImpactMetric = {
  id: string;
  project_id: string | null;
  metric_key: string;
  label: string;
  target: number | null;
  actual: number | null;
  unit: string;
  period: string | null;
  evidence_url: string | null;
  verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Story = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  project_id: string | null;
  author_id: string | null;
  status: StoryStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Certificate = {
  id: string;
  certificate_code: string;
  volunteer_id: string;
  project_id: string | null;
  contribution_id: string | null;
  hours: number | null;
  issue_date: string;
  issued_by: string | null;
  created_at: string;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

export type AuditLog = {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_data: unknown;
  new_data: unknown;
  created_at: string;
};

export type OrganizationSettings = {
  id: string;
  org_name: string;
  legal_name: string | null;
  logo_url: string | null;
  contact_email: string | null;
  phone: string | null;
  website: string | null;
  social_links: Record<string, unknown> | null;
  registration_number: string | null;
  pan: string | null;
  status_80g: string | null;
  status_fcra: string | null;
  mission: string | null;
  about_text: string | null;
  updated_by: string | null;
  updated_at: string;
};

export type DocumentRow = {
  id: string;
  title: string;
  category: string;
  file_url: string;
  is_public: boolean;
  uploaded_by: string | null;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

// ------------------------------------------------------------
// View row types (0003_views_and_triggers.sql — exact SELECT lists)
// ------------------------------------------------------------

export type CampaignTotals = {
  campaign_id: string;
  slug: string;
  name: string;
  goal_amount: number;
  amount_raised: number;
  supporter_count: number;
};

export type CampaignPublicDonor = {
  campaign_id: string | null;
  display_name: string | null;
  amount: number;
  created_at: string;
};

export type VerifiedImpact = {
  id: string;
  project_id: string | null;
  project_name: string;
  metric_key: string;
  label: string;
  actual: number | null;
  unit: string;
  period: string | null;
  verified_at: string | null;
};

// ------------------------------------------------------------
// Generic helpers so every table doesn't repeat the same
// Insert/Update derivation by hand. Insert = Row minus the columns
// Postgres always supplies (id/created_at/updated_at get defaults);
// every other not-null-without-a-default column stays required, and
// callers list which additional columns are nullable-or-defaulted.
// Update = every column optional except id (never move a primary key).
// ------------------------------------------------------------

type TableRow = object;
type GeneratedColumns = "id" | "created_at" | "updated_at";

type InsertOf<Row extends TableRow, OptionalKeys extends keyof Row = never> = Omit<
  Row,
  GeneratedColumns | OptionalKeys
> &
  Partial<Pick<Row, Extract<GeneratedColumns, keyof Row> | OptionalKeys>>;

type UpdateOf<Row extends TableRow> = Partial<Omit<Row, "id">>;

// ------------------------------------------------------------
// Database — the full GenericSchema-compliant shape
// ------------------------------------------------------------

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: InsertOf<
          Profile,
          | "phone" | "profile_photo_url" | "bio" | "city" | "state" | "country"
          | "education" | "occupation" | "skills" | "linkedin_url" | "website_url"
          | "preferred_language" | "status"
        >;
        Update: UpdateOf<Profile>;
        Relationships: [];
      };
      user_roles: {
        Row: UserRoleRow;
        Insert: InsertOf<UserRoleRow>;
        Update: UpdateOf<UserRoleRow>;
        Relationships: [];
      };
      volunteer_applications: {
        Row: VolunteerApplication;
        Insert: InsertOf<
          VolunteerApplication,
          | "city" | "state" | "education" | "skills" | "experience" | "availability"
          | "preferred_areas" | "motivation" | "status" | "reviewer_notes"
          | "reviewed_by" | "reviewed_at"
        >;
        Update: UpdateOf<VolunteerApplication>;
        Relationships: [];
      };
      projects: {
        Row: Project;
        Insert: InsertOf<
          Project,
          | "short_description" | "description" | "focus_area" | "status" | "visibility"
          | "start_date" | "end_date" | "location" | "target_beneficiaries"
          | "funding_goal" | "cover_image_url" | "created_by"
        >;
        Update: UpdateOf<Project>;
        Relationships: [];
      };
      project_locations: {
        Row: ProjectLocation;
        Insert: InsertOf<ProjectLocation, "city" | "state" | "latitude" | "longitude">;
        Update: UpdateOf<ProjectLocation>;
        Relationships: [
          {
            foreignKeyName: "project_locations_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      project_members: {
        Row: ProjectMember;
        Insert: InsertOf<ProjectMember, "role" | "assigned_by">;
        Update: UpdateOf<ProjectMember>;
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      project_updates: {
        Row: ProjectUpdate;
        Insert: InsertOf<ProjectUpdate, "body" | "image_url" | "published" | "created_by">;
        Update: UpdateOf<ProjectUpdate>;
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      tasks: {
        Row: Task;
        Insert: InsertOf<
          Task,
          "assigned_to" | "description" | "priority" | "status" | "due_date" | "completed_at" | "created_by"
        >;
        Update: UpdateOf<Task>;
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      volunteer_contributions: {
        Row: VolunteerContribution;
        Insert: InsertOf<
          VolunteerContribution,
          | "project_id" | "task_id" | "hours" | "people_supported" | "description"
          | "evidence_url" | "status" | "verified_by" | "verified_at" | "verification_notes"
        >;
        Update: UpdateOf<VolunteerContribution>;
        Relationships: [
          {
            foreignKeyName: "volunteer_contributions_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      campaigns: {
        Row: Campaign;
        Insert: InsertOf<
          Campaign,
          "description" | "project_id" | "start_date" | "end_date" | "status" | "cover_image_url" | "created_by"
        >;
        Update: UpdateOf<Campaign>;
        Relationships: [
          {
            foreignKeyName: "campaigns_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      donations: {
        Row: Donation;
        Insert: InsertOf<
          Donation,
          | "donor_user_id" | "project_id" | "campaign_id" | "currency" | "payment_provider"
          | "provider_order_id" | "provider_payment_id" | "payment_status"
          | "receipt_number" | "receipt_url" | "show_name_publicly"
        >;
        Update: UpdateOf<Donation>;
        Relationships: [
          {
            foreignKeyName: "donations_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "donations_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          }
        ];
      };
      impact_metrics: {
        Row: ImpactMetric;
        Insert: InsertOf<
          ImpactMetric,
          | "project_id" | "target" | "actual" | "unit" | "period" | "evidence_url"
          | "verified" | "verified_by" | "verified_at" | "created_by"
        >;
        Update: UpdateOf<ImpactMetric>;
        Relationships: [
          {
            foreignKeyName: "impact_metrics_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      stories: {
        Row: Story;
        Insert: InsertOf<
          Story,
          "excerpt" | "content" | "cover_image_url" | "project_id" | "author_id" | "status" | "published_at"
        >;
        Update: UpdateOf<Story>;
        Relationships: [
          {
            foreignKeyName: "stories_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      certificates: {
        Row: Certificate;
        Insert: InsertOf<
          Certificate,
          "certificate_code" | "project_id" | "contribution_id" | "hours" | "issue_date" | "issued_by"
        >;
        Update: UpdateOf<Certificate>;
        Relationships: [
          {
            foreignKeyName: "certificates_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: NotificationRow;
        Insert: InsertOf<NotificationRow, "body" | "link" | "read">;
        Update: UpdateOf<NotificationRow>;
        Relationships: [];
      };
      audit_logs: {
        Row: AuditLog;
        Insert: InsertOf<AuditLog, "actor_user_id" | "entity_id" | "old_data" | "new_data">;
        // Append-only — see 0002_rls_policies.sql: no update policy
        // exists for any role, so this table is Insert/Select only.
        Update: never;
        Relationships: [];
      };
      organization_settings: {
        Row: OrganizationSettings;
        Insert: InsertOf<
          OrganizationSettings,
          | "legal_name" | "logo_url" | "contact_email" | "phone" | "website" | "social_links"
          | "registration_number" | "pan" | "status_80g" | "status_fcra" | "mission"
          | "about_text" | "updated_by"
        >;
        Update: UpdateOf<OrganizationSettings>;
        Relationships: [];
      };
      documents: {
        Row: DocumentRow;
        Insert: InsertOf<DocumentRow, "is_public" | "uploaded_by">;
        Update: UpdateOf<DocumentRow>;
        Relationships: [];
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: InsertOf<ContactMessage, "subject">;
        Update: UpdateOf<ContactMessage>;
        Relationships: [];
      };
    };
    Views: {
      // Every view here is read-only (none declared updatable in
      // 0003), so each gets only Row + Relationships.
      campaign_totals: { Row: CampaignTotals; Relationships: [] };
      campaign_public_donors: { Row: CampaignPublicDonor; Relationships: [] };
      verified_impact: { Row: VerifiedImpact; Relationships: [] };
    };
    Functions: {
      log_audit_event: {
        Args: {
          p_action: string;
          p_entity_type: string;
          p_entity_id: string;
          p_old_data?: unknown;
          p_new_data?: unknown;
        };
        Returns: void;
      };
      verify_certificate: {
        Args: { p_code: string };
        Returns: {
          certificate_code: string;
          volunteer_name: string;
          project_name: string | null;
          hours: number | null;
          issue_date: string;
        }[];
      };
    };
    // No Postgres enums are exposed as PostgREST-visible enum types
    // beyond the ones already modeled as TS union types above (see
    // "Enums" section) — 0001_core_schema.sql's `create type ...`
    // statements back application-level unions, not separate
    // queryable enum columns. Declared empty here (rather than
    // omitted) because @supabase/supabase-js's client generics
    // expect this key to exist on the schema — confirmed by
    // bisection: omitting it silently collapses .single()/
    // .maybeSingle() result types to `never` under strictNullChecks,
    // even though it's not part of postgrest-js's own documented
    // GenericSchema contract. This mirrors the shape `supabase gen
    // types` actually produces.
    Enums: Record<string, never>;
    // No composite (row) types are defined in the migrations beyond
    // the enums and tables already modeled above. Same rationale as
    // Enums for why this is declared empty rather than omitted.
    CompositeTypes: Record<string, never>;
  };
};
