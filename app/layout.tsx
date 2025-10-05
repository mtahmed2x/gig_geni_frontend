import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileDock } from "@/components/layout/MobileDock";
import { Footer } from "@/components/footer/Footer";
import { AuthProvider } from "@/contexts/AuthProvider";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GigGeni - Competition Platform",
  description: "Navigate your career through competitions and leaderboards",
  keywords: ["competitions", "leaderboards", "career", "gig economy"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <AuthProvider>
            <OnboardingProvider>
              <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
                <DesktopNav />
                <main className="flex-1">{children}</main>
                <Footer />
                <MobileDock />
              </div>
            </OnboardingProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
