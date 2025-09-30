import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import React from "react";
import { Providers } from "@/app/providers";
import { Toaster } from "sonner";
import { TitleProvider } from "@/context/title-context";

const montreal = localFont({
  src: [
    {
      path: "./fonts/NeueMontreal-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/NeueMontreal-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/NeueMontreal-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/NeueMontreal-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/NeueMontreal-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/NeueMontreal-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/NeueMontreal-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/NeueMontreal-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
  ],
  variable: "--font-montreal",
});

export const metadata: Metadata = {
  title: "Admin ~ Melanin Kapital | Neo-Bank",
  description:
    "Gain access to a curated selection of funding opportunities perfectly suited to your business requirements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(montreal.className)}>
        <Providers>
          <TitleProvider>
            {children}
            <Toaster richColors position={"top-right"} />
          </TitleProvider>
        </Providers>
      </body>
    </html>
  );
}
