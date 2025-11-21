"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntrepreneurData {
  id: string;
  companyName: string;
  legalEntityType: string;
  city: string;
  country: string;
  profileCompletion: number;
  memberSince: string;
  lastLogin: string;
  userGroup: string;
  sectors: string[];
  status: string;
}

interface EntrepreneurHeaderProps {
  entrepreneur: EntrepreneurData;
}

export function EntrepreneurHeader({
  entrepreneur,
}: EntrepreneurHeaderProps) {
  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes("pending")) {
      return "bg-[#FFE5B0] text-[#8C5E00]";
    }
    if (status.toLowerCase().includes("active")) {
      return "bg-green-100 text-green-500";
    }
    return "bg-gray-100 text-gray-500";
  };

  return (
    <div className="relative rounded-md overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="relative h-[280px] w-full">
        <Image
          src="/banner-image.png"
          alt="Company banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-midnight-blue/60" />
        
        {/* Content Overlay */}
        <div className="relative h-full flex flex-col">
          <div className="flex-1 px-8 py-6 flex items-start justify-between">
            {/* Left Section - Logo and Company Info */}
            <div className="flex items-start gap-6">
              {/* Company Logo */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center relative overflow-hidden">
                  {/* Placeholder logo - replace with actual logo */}
                  <div className="w-full h-full bg-gradient-to-br from-orange-500 to-primary-green flex flex-col items-center justify-center">
                    <div className="text-white font-bold text-lg">CSA</div>
                  </div>
                  
                  {/* Upload Icon Overlay */}
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-green flex items-center justify-center border-2 border-white shadow-sm hover:bg-primary-green/90 transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Company Details */}
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold text-white">
                  {entrepreneur.companyName}
                </h1>
                <p className="text-[#B6BABC] text-sm">
                  {entrepreneur.legalEntityType} • {entrepreneur.city}, {entrepreneur.country}
                </p>
              </div>
            </div>

            {/* Right Section - Progress and Actions */}
            <div className="flex flex-col items-end gap-4">
              {/* Profile Completion */}
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-green transition-all duration-300"
                    style={{ width: `${entrepreneur.profileCompletion}%` }}
                  />
                </div>
                <span className="text-white text-sm font-medium whitespace-nowrap">
                  {entrepreneur.profileCompletion}% profile completion
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white hover:bg-primaryGrey-50 text-midnight-blue border-0"
                >
                  Resend Invite
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent hover:bg-primaryGrey-50 text-white border-white"
                >
                  Email User
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Section - Detailed Info */}
          <div className="px-8 pb-6">
            <div className="grid grid-cols-5 gap-6 pt-6 border-t border-[#B6BABC]">
              <div className="flex flex-col gap-1">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  Member since
                </p>
                <p className="text-white text-sm font-medium">
                  {entrepreneur.memberSince}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  Last login
                </p>
                <p className="text-white text-sm font-medium">
                  {entrepreneur.lastLogin}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  User Group
                </p>
                <p className="text-white text-sm font-medium">
                  {entrepreneur.userGroup}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  Sector(s)
                </p>
                <p className="text-white text-sm font-medium">
                  {entrepreneur.sectors.join(", ")}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  Status
                </p>
                <Badge
                  className={cn(
                    "w-fit text-xs rounded-md font-normal",
                    getStatusColor(entrepreneur.status)
                  )}
                >
                  {entrepreneur.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

