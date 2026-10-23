import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { SocketProvider } from "@/context/useSocket";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carte de trafic en temps réel",
  description: "Carte de trafic en temps réel pour les embouteillages et les accidents de la route.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-FR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <SocketProvider>
        <body className="flex min-h-svh flex-col bg-background text-foreground">
          <Toaster />
          <Header />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
        </body>
      </SocketProvider>
    </html>
  );
}

