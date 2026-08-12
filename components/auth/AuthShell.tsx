import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo">
            <span className="font-display text-parchment text-[15px]">उ</span>
          </div>
          <span className="font-display text-indigo text-lg">Project Udaan</span>
        </Link>

        <div className="rounded-2xl border border-sandstone bg-white p-8">
          <h1 className="font-display text-indigo text-2xl mb-1">{title}</h1>
          {subtitle && <p className="font-body text-ink-soft text-sm mb-6">{subtitle}</p>}
          <div className="mt-6 flex flex-col gap-4">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-sm font-body text-ink-soft">{footer}</div>}
      </div>
    </div>
  );
}
