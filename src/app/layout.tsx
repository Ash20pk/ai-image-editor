import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from 'react';
import NavigationBar from '@/components/navigation/NavigationBar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AImagine",
  description: "Transform images with AI magic",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NavigationBar />
        {children}
      </body>
    </html>
  );
}
