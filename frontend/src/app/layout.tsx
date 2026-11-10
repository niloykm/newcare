import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoRoleSwitcher from "@/components/DemoRoleSwitcher";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NewCare | Verified In-Home Care & Professional Nursing Support",
  description: "Licensed clinical nurses, certified caregivers, and board-certified physicians dispatched directly to your residence. 24/7 clinical triage, 100% background vetting, and transparent rates.",
  keywords: "in-home nursing, home caregiving, post-op recovery, dementia care, elderly care, nurse dispatch, licensed RN, clinical home health, telehealth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "8px",
                padding: "12px 16px",
                fontSize: "0.875rem",
                fontWeight: "500",
                border: "1px solid var(--border)",
              },
            }}
          />
          <Navbar />
          <main className="relative z-1 min-h-[calc(100vh-140px)]">{children}</main>
          <Footer />
          <DemoRoleSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
