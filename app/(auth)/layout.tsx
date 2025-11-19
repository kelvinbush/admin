"use client";
import React from "react";
import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="min-h-screen relative bg-midnight-blue flex items-center justify-center">
      {/* Logo */}
      <div className="absolute bottom-8 right-8 z-20">
        <Image
          src="/images/logo-white.svg"
          width={180}
          height={50}
          className="w-auto h-12"
          alt="Melanin Kapital logo"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full container p-6">
        <div className="mx-auto w-max">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
