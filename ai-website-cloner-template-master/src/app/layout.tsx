import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Numinds",
  description:
    "تصميم دعوات رقمية أنيقة في دقائق | Create elegant digital invitations in minutes.",
  icons: {
    icon: "/seo/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cinzel.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <Header />
        <main className="flex-1 pt-20 pb-16 md:pb-0">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
