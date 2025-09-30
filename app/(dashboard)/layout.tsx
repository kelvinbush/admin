"use client";
import React from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidenav from "./_components/sidenav";
import Topnav from "./_components/topnav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="relative min-h-svh bg-[#E8E9EA] flex flex-col">
      <Sidenav />
      <Topnav />
      <main
        className={
          "max-w-[2000px] py-4 pl-[308px] pr-4 flex-1 h-full flex flex-col"
        }
      >
        {children}
      </main>
    </div>
  );
}
