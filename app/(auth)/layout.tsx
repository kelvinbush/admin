"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="bg-gradient-to-br from-midnight-blue via-blue-900 to-midnight-blue min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return null;
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('/images/branding.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-midnight-blue/95 via-blue-900/95 to-midnight-blue/95" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-[#00B67C]/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#8AF2F2]/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#54DDBB]/20 rounded-full blur-xl animate-pulse delay-500" />
      
      {/* Logo */}
      <div className="absolute top-8 left-8 z-20">
        <Image
          src="/images/logo-white.svg"
          width={180}
          height={50}
          className="w-auto h-12"
          alt="Melanin Kapital logo"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <Card className="border-0 shadow-none p-8 md:p-12 bg-transparent">
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
