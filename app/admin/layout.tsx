import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/udaan/Nav";
import { isStaff } from "@/lib/permissions";

const LINKS = [
  { label: "Overview", href: "/admin" },
  { label: "Applications", href: "/admin/applications" },
  { label: "Volunteers", href: "/admin/volunteers" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Tasks", href: "/admin/tasks" },
  { label: "Contributions", href: "/admin/contributions" },
  { label: "Campaigns", href: "/admin/campaigns" },
  { label: "Donations", href: "/admin/donations" },
  { label: "Impact", href: "/admin/impact" },
  { label: "Stories", href: "/admin/stories" },
  { label: "Certificates", href: "/admin/certificates" },
  { label: "Audit Logs", href: "/admin/audit" },
  { label: "Settings", href: "/admin/settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: middleware already redirects non-staff away
  // from /admin/*, but every server-rendered admin page re-checks
  // here too, so this layout is never reachable by a non-staff
  // session even if middleware were ever bypassed or misconfigured.
  if (!(await isStaff())) redirect("/unauthorized");

  return (
    <div className="min-h-screen bg-parchment">
      <Nav />
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10 grid md:grid-cols-[200px_1fr] gap-8">
        <aside className="hidden md:block">
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-semibold text-ink-soft hover:text-indigo px-3 py-2 rounded-lg hover:bg-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
