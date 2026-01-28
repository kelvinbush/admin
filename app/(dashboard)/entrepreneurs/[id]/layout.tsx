"use client";

import React from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { EntrepreneurBreadcrumb } from "./_components/entrepreneur-breadcrumb";
import { EntrepreneurHeader } from "./_components/entrepreneur-header";
import { EntrepreneurTabs } from "./_components/entrepreneur-tabs";
import { useSMEUser } from "@/lib/api/hooks/sme";

export default function EntrepreneurDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const entrepreneurId = params.id as string;

  const { data, isLoading, isError } = useSMEUser(entrepreneurId);

  if (isLoading) {
    return (
      <div className="text-sm text-primaryGrey-500">
        Loading entrepreneur...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-sm text-red-500">
        Failed to load entrepreneur.
      </div>
    );
  }

  const business = data.business;

  const profileCompletion = data.completedSteps?.length
    ? Math.round((data.completedSteps.length / 7) * 100)
    : 0;

  const memberSince = business?.createdAt
    ? format(new Date(business.createdAt), "dd/MMMM/yyyy")
    : "-";

  // Prefer user group names from API if available
  const userGroupNames =
    (business as any)?.userGroupNames && Array.isArray((business as any).userGroupNames)
      ? ((business as any).userGroupNames as string[])
      : [];

  const entrepreneurData = {
    id: data.userId,
    email: data.user.email,
    companyName: business?.name || "-",
    legalEntityType: business?.entityType || "-",
    city: business?.city || "-",
    country: business?.country || business?.companyHQ || "-",
    profileCompletion,
    memberSince,
    lastLogin: "-",
    userGroup: userGroupNames.length ? userGroupNames.join(", ") : "-",
    sectors: business?.sectors || [],
    status: data.user.onboardingStatus,
    logo: business?.logo || null,
    yearOfIncorporation: business?.yearOfIncorporation ?? null,
    description: business?.description ?? null,
    userGroupIds: business?.userGroupIds ?? [],
    selectionCriteria: business?.selectionCriteria ?? null,
    noOfEmployees: business?.noOfEmployees ?? null,
    website: business?.website ?? null,
    videoLinks: business?.videoLinks ?? [],
    businessPhotos: business?.businessPhotos ?? [],
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <EntrepreneurBreadcrumb
        companyName={entrepreneurData.companyName}
      />

      {/* Header with Banner */}
      <EntrepreneurHeader entrepreneur={entrepreneurData} />

      {/* Main Card with Tabs */}
      <div className="rounded-md bg-white shadow-sm border border-primaryGrey-50">
        <EntrepreneurTabs entrepreneurId={entrepreneurId} />
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

