import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@components/layout/Footer";
import { LanguageProvider } from "@components/i18n/LanguageProvider";
import profile from "@data/profile.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: (profile.name || "Portfolio") + " - Portfolio",
    template: "%s",
  },
  description: profile.bio || "Personal portfolio",
  metadataBase: new URL("https://rknyryn.dev"),
  openGraph: {
    type: "website",
    siteName: profile.name || "Portfolio",
    locale: "en_US",
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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <LanguageProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
