import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RegisterSW from "./register-sw";
import Registration from "./register/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel PWA - Guide de Voyage",
  description: "Planifiez vos voyages avec notre assistant intelligent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head> 
        <link rel="manifest" href="/manifest.webmanifest" /> 
        <meta name="theme-color" content="#0d6efd" /> 
        <link rel="apple-touch-icon" href="/icons/logo192.png" 
/> 
      </head> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <RegisterSW/>
      </body>
    </html>
  );
}
