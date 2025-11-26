"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { useSaveBusinessBasicInfo } from "@/lib/api/hooks/sme";
import { toast } from "sonner";

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
  logo?: string | null;
  yearOfIncorporation?: number | null;
  description?: string | null;
  userGroupIds?: string[];
  selectionCriteria?: string[] | null;
  noOfEmployees?: number | null;
  website?: string | null;
  videoLinks?: { url: string; source: string | null }[];
  businessPhotos?: string[];
}

interface EntrepreneurHeaderProps {
  entrepreneur: EntrepreneurData;
}

export function EntrepreneurHeader({
  entrepreneur,
}: EntrepreneurHeaderProps) {
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { startUpload: startImageUpload } = useUploadThing("imageUploader");
  const saveBusinessBasicInfo = useSaveBusinessBasicInfo();

  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes("pending")) {
      return "bg-[#FFE5B0] text-[#8C5E00]";
    }
    if (status.toLowerCase().includes("active")) {
      return "bg-green-100 text-green-500";
    }
    return "bg-gray-100 text-gray-500";
  };

  const handleLogoClick = () => {
    if (isUploadingLogo) return;
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileSizeMB = file.size / (1024 * 1024);
    const fileExtension = file.name.split(".").pop()?.toUpperCase();
    const allowed = ["PNG", "JPG", "JPEG"];

    if (fileSizeMB > 5) {
      toast.error("Logo must be 5MB or less.");
      return;
    }

    if (!fileExtension || !allowed.includes(fileExtension)) {
      toast.error("Logo must be PNG or JPG.");
      return;
    }

    try {
      setIsUploadingLogo(true);
      const uploaded = await startImageUpload([file]);

      if (!uploaded || !uploaded[0]?.url) {
        throw new Error("Upload failed");
      }

      const logoUrl = uploaded[0].url;

      const year =
        entrepreneur.yearOfIncorporation ??
        new Date().getFullYear();

      await saveBusinessBasicInfo.mutateAsync({
        userId: entrepreneur.id,
        data: {
          logo: logoUrl,
          name: entrepreneur.companyName,
          entityType: entrepreneur.legalEntityType,
          year,
          sectors: entrepreneur.sectors ?? [],
          description: entrepreneur.description ?? undefined,
          userGroupId: entrepreneur.userGroupIds?.[0] ?? undefined,
          criteria: entrepreneur.selectionCriteria ?? undefined,
          noOfEmployees: entrepreneur.noOfEmployees ?? undefined,
          website: entrepreneur.website ?? undefined,
          videoLinks:
            entrepreneur.videoLinks && entrepreneur.videoLinks.length > 0
              ? entrepreneur.videoLinks.map((v) => ({
                  url: v.url,
                  source: v.source ?? undefined,
                }))
              : undefined,
          businessPhotos: entrepreneur.businessPhotos && entrepreneur.businessPhotos.length > 0 ? entrepreneur.businessPhotos : undefined,
        },
      });

      toast.success("Company logo has been updated successfully.");
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update logo.";
      toast.error(message);
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative rounded-md overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="relative w-full">
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
          <div className="flex-1 px-8 py-6">
            <div className="flex items-start gap-6">
              {/* Company Logo */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center relative overflow-hidden">
                  {entrepreneur.logo ? (
                    <Image
                      src={entrepreneur.logo}
                      alt={`${entrepreneur.companyName} logo`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-primary-green flex flex-col items-center justify-center">
                      <div className="text-white font-bold text-lg">
                        {entrepreneur.companyName
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 3)
                          .toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hidden file input for logo upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleLogoChange}
                />

                {/* Upload Icon Overlay */}
                <button
                  type="button"
                  onClick={handleLogoClick}
                  className="absolute -bottom-1 -right-1 w-8 h-8 z-10 rounded-full bg-primary-green flex items-center justify-center border-2 border-white shadow-sm hover:bg-primary-green/90 transition-colors disabled:opacity-70"
                  disabled={isUploadingLogo}
                >
                  <Camera className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* Right side content - spans full width minus logo */}
              <div className="flex-1 flex flex-col gap-1">
                {/* Top row: Title and Action Buttons */}
                <div className="flex items-start justify-between gap-4">
                  {/* Company Details */}
                  <div className="flex flex-col gap-2">
                    <h1 className="text-3xl text-white">
                      {entrepreneur.companyName}
                    </h1>
                    <p className="text-[#B6BABC]">
                      {entrepreneur.legalEntityType} • {entrepreneur.city}, {entrepreneur.country}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 flex-shrink-0">
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

                {/* Progress Bar - spans full width minus logo space */}
                <div className="">
                <div className="text-white text-sm whitespace-nowrap text-right ml-auto">
                    {entrepreneur.profileCompletion}% profile completion
                  </div>
                  <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-green transition-all duration-300 rounded-full"
                      style={{ width: `${entrepreneur.profileCompletion}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Detailed Info */}
          <div className="px-8">
            <div className="grid grid-cols-5 gap-6 py-5 border-t border-[#B6BABC]">
              <div className="flex flex-col gap-1 pr-6 border-r border-[#B6BABC]">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  Member since
                </p>
                <p className="text-white text-sm font-medium">
                  {entrepreneur.memberSince}
                </p>
              </div>

              <div className="flex flex-col gap-1 px-6 border-r border-[#B6BABC]">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  Last login
                </p>
                <p className="text-white text-sm font-medium">
                  {entrepreneur.lastLogin}
                </p>
              </div>

              <div className="flex flex-col gap-1 px-6 border-r border-[#B6BABC]">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  User Group
                </p>
                <p className="text-white text-sm font-medium">
                  {entrepreneur.userGroup}
                </p>
              </div>

              <div className="flex flex-col gap-1 px-6 border-r border-[#B6BABC]">
                <p className="text-[#B6BABC] text-xs font-medium uppercase tracking-wide">
                  Sector(s)
                </p>
                <p className="text-white text-sm font-medium">
                  {entrepreneur.sectors.join(", ")}
                </p>
              </div>

              <div className="flex flex-col gap-1 pl-6">
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

