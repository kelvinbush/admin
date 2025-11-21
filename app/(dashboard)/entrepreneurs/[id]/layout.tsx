"use client";

import React from "react";
import { useParams } from "next/navigation";
import { EntrepreneurBreadcrumb } from "./_components/entrepreneur-breadcrumb";
import { EntrepreneurHeader } from "./_components/entrepreneur-header";
import { EntrepreneurTabs } from "./_components/entrepreneur-tabs";

export default function EntrepreneurDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const entrepreneurId = params.id as string;

  // TODO: Fetch entrepreneur data using the ID
  // For now, using placeholder data
  const entrepreneurData = {
    id: entrepreneurId,
    companyName: "Cesha Investments Ltd",
    legalEntityType: "Public Limited Company",
    city: "Nairobi",
    country: "Kenya",
    profileCompletion: 50,
    memberSince: "08/April/2023",
    lastLogin: "-",
    userGroup: "Tuungane2xna Absa",
    sectors: ["Agriculture", "Technology"],
    status: "Pending Activation",
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

