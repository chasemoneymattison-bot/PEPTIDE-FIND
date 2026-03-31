import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CompareFloatingBar } from "@/components/CompareButton";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "PeptideFind - Compare Peptide Prices & Vendors",
    template: "%s | PeptideFind",
  },
  description:
    "The most comprehensive peptide comparison platform. Compare prices, read reviews, and find the best vendors for research peptides.",
  keywords: [
    "peptides",
    "research peptides",
    "peptide comparison",
    "BPC-157",
    "TB-500",
    "peptide vendors",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CompareFloatingBar />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
