import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Project Udaan — From Knowledge to Opportunity",
    template: "%s · Project Udaan",
  },
  description:
    "Project Udaan helps close the gap between talent and opportunity in India through education, digital skills, mentorship and access to opportunity.",
  openGraph: {
    type: "website",
    siteName: "Project Udaan",
    title: "Project Udaan — From Knowledge to Opportunity",
    description:
      "India has never been short of talent. Project Udaan helps talent find its way to opportunity — through education, skills, mentorship and access.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
