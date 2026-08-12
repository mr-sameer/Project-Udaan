import Link from "next/link";
import { Nav } from "@/components/udaan/Nav";

const LINKS = [
  { label: "Overview", href: "/dashboard/volunteer" },
  { label: "My Projects", href: "/dashboard/volunteer/projects" },
  { label: "My Tasks", href: "/dashboard/volunteer/tasks" },
  { label: "My Contributions", href: "/dashboard/volunteer/contributions" },
  { label: "Certificates", href: "/dashboard/volunteer/certificates" },
  { label: "Notifications", href: "/dashboard/notifications" },
  { label: "Profile", href: "/dashboard/profile" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
