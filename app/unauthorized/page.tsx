import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-5 text-center">
      <div>
        <h1 className="font-display text-indigo text-3xl mb-2">403 — Not authorized</h1>
        <p className="font-body text-ink-soft mb-6">
          Your account doesn't have access to this page. If you think this is a mistake, contact an admin.
        </p>
        <Link href="/dashboard" className="text-sm font-bold text-kesari">
          Back to your dashboard →
        </Link>
      </div>
    </div>
  );
}
