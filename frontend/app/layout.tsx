import type { Metadata } from "next";
import { IBM_Plex_Sans, Courier_Prime } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
  display: "swap",
});

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier-prime",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SACHAI.AI — Don't Just Believe It. Verify It.",
  description: "Evidence-based AI fact-checking engine for text claims, news, URLs, screenshots and WhatsApp forwards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSans.variable} ${courierPrime.variable} font-sans min-h-screen flex flex-col antialiased bg-background text-foreground selection:bg-accent-blue/20 selection:text-accent-blue`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
