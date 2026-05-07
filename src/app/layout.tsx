import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/context/AuthProvider";
import { CompareProvider } from "@/context/CompareContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CollegeFind — Discover the Best Colleges in India",
  description:
    "Search from 500+ colleges across India. Compare fees, placements, rankings & cutoffs. Find your perfect college — zero ads, zero clutter.",
  keywords: [
    "college finder India",
    "best colleges India",
    "college comparison",
    "JEE colleges",
    "NEET colleges",
    "college predictor",
    "engineering colleges India",
    "medical colleges India",
    "MBA colleges India",
    "college rankings India",
  ],
  authors: [{ name: "CollegeFind" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://collegefind.in",
    siteName: "CollegeFind",
    title: "CollegeFind — Discover the Best Colleges in India",
    description:
      "Search from 500+ colleges across India. Compare fees, placements, rankings & cutoffs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CollegeFind — Discover the Best Colleges in India",
    description:
      "Search from 500+ colleges across India. Compare fees, placements, rankings & cutoffs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="bg-[#FAFBFD] min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <CompareProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1E293B',
                  color: '#fff',
                  fontSize: '13px',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                },
                success: {
                  style: { background: '#059669' },
                  iconTheme: { primary: '#fff', secondary: '#059669' },
                },
                error: {
                  style: { background: '#DC2626' },
                  iconTheme: { primary: '#fff', secondary: '#DC2626' },
                },
              }}
            />
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
