import type { Metadata } from "next";
import { Literata, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import ToastProvider from "@/components/providers/ToastProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const literata = Literata({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://devmentor.vercel.app"
  ),
  title: {
    default: "DevMentor — Credit-Based Mentorship & Code Review Marketplace",
    template: "%s | DevMentor",
  },
  description:
    "Accelerate your engineering growth with 1-on-1 sprint mentorship, structured multi-week cohorts, and async production-grade code reviews.",
  keywords: [
    "developer mentorship",
    "code review",
    "software engineering sprints",
    "coding cohorts",
    "full-stack mentorship",
    "credit-based marketplace",
  ],
  authors: [{ name: "DevMentor Engineering Team" }],
  creator: "DevMentor",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devmentor.vercel.app",
    title: "DevMentor — Credit-Based Mentorship & Code Review Marketplace",
    description:
      "Accelerate your engineering growth with 1-on-1 sprint mentorship, structured multi-week cohorts, and async production-grade code reviews.",
    siteName: "DevMentor",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevMentor — Credit-Based Mentorship & Code Review Marketplace",
    description:
      "Accelerate your engineering growth with 1-on-1 sprint mentorship, structured multi-week cohorts, and async production-grade code reviews.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${literata.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background text-text-primary font-sans"
      >
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
