import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
<<<<<<< HEAD
import PageLayout from "@/components/PageLayout";
=======
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduStream",
  description: "Educational streaming platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
<<<<<<< HEAD
          <PageLayout>{children}</PageLayout>
=======
          {children}
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
