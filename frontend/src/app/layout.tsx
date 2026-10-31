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
  title: "NewCare – Find & Book Top Doctors",
  description: "Book appointments with the best doctors near you. Trusted by thousands of patients worldwide.",
  keywords: "doctor, appointment, healthcare, medical, online booking",
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
                borderRadius: "12px",
                padding: "14px 18px",
                fontSize: "0.875rem",
                fontWeight: "500",
              },
            }}
          />
          <Navbar />
          <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
          <Footer />
          <DemoRoleSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
