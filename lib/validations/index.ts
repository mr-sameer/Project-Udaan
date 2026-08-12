import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name").max(120),
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  bio: z.string().trim().max(1000).optional().or(z.literal("")),
  education: z.string().trim().max(200).optional().or(z.literal("")),
  occupation: z.string().trim().max(200).optional().or(z.literal("")),
  skills: z.array(z.string().trim().max(50)).max(20).optional(),
  linkedinUrl: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  websiteUrl: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  preferredLanguage: z.string().trim().max(10).default("en"),
});

export const volunteerApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(20),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  education: z.string().trim().max(200).optional().or(z.literal("")),
  skills: z.array(z.string().trim().max(50)).max(20).optional(),
  experience: z.string().trim().max(2000).optional().or(z.literal("")),
  availability: z.string().trim().max(500).optional().or(z.literal("")),
  preferredAreas: z.array(z.string().trim().max(80)).max(10).optional(),
  motivation: z.string().trim().min(20, "Tell us a little about why you'd like to join").max(2000),
});

export const projectSchema = z.object({
  name: z.string().trim().min(3).max(150),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  shortDescription: z.string().trim().max(300).optional().or(z.literal("")),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  focusArea: z.string().trim().max(200).optional().or(z.literal("")),
  status: z.enum(["planning", "preparing", "active", "completed", "paused", "cancelled"]),
  visibility: z.enum(["public", "unlisted", "private"]),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  targetBeneficiaries: z.coerce.number().int().nonnegative().optional(),
  fundingGoal: z.coerce.number().nonnegative().optional(),
});

export const taskSchema = z.object({
  projectId: z.string().uuid(),
  assignedTo: z.string().uuid().optional().nullable(),
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string().optional().or(z.literal("")),
});

export const contributionSchema = z.object({
  projectId: z.string().uuid().optional().nullable(),
  contributionType: z.enum([
    "teaching", "mentoring", "fundraising", "technology", "content",
    "research", "community_outreach", "event", "equipment", "administration", "other",
  ]),
  contributionDate: z.string().min(1, "Select a date"),
  hours: z.coerce.number().positive().max(24).optional(),
  peopleSupported: z.coerce.number().int().nonnegative().optional(),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const campaignSchema = z.object({
  name: z.string().trim().min(3).max(150),
  slug: z.string().trim().min(3).max(150).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(3000).optional().or(z.literal("")),
  projectId: z.string().uuid().optional().nullable(),
  goalAmount: z.coerce.number().positive("Enter a goal amount"),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "active", "completed", "cancelled"]),
});

export const donationSchema = z.object({
  campaignId: z.string().uuid().optional().nullable(),
  projectId: z.string().uuid().optional().nullable(),
  amount: z.coerce.number().positive("Enter an amount greater than zero").max(1000000),
  showNamePublicly: z.boolean().default(false),
});

export const storySchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().max(300).optional().or(z.literal("")),
  content: z.string().trim().max(20000).optional().or(z.literal("")),
  projectId: z.string().uuid().optional().nullable(),
  status: z.enum(["draft", "review", "published", "archived"]),
});

export const impactMetricSchema = z.object({
  projectId: z.string().uuid(),
  metricKey: z.string().trim().min(2).max(80),
  label: z.string().trim().min(2).max(200),
  target: z.coerce.number().nonnegative().optional(),
  actual: z.coerce.number().nonnegative().optional(),
  unit: z.string().trim().min(1).max(40).default("count"),
  period: z.string().trim().max(80).optional().or(z.literal("")),
});
