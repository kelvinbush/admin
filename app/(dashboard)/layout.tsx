"use client";
import React from "react";
import Sidenav from "./_components/sidenav";
import Topnav from "./_components/topnav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="relative min-h-svh bg-[#E8E9EA]">
        <Sidenav />
        <Topnav />
        <main className={"max-w-[2000px] py-4 pl-[308px] pr-4"}>
          {children}
        </main>
      </div>
    </>
  );
}
