"use client";

import React from "react";
import { useParams } from "next/navigation";
import { EntrepreneurBreadcrumb } from "./_components/entrepreneur-breadcrumb";
import { EntrepreneurHeader } from "./_components/entrepreneur-header";

export default function EntrepreneurDetailPage() {
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

      {/* Main Card - Placeholder for now */}
      <div className="rounded-md bg-white shadow-sm border border-primaryGrey-50 p-8">
        <p className="text-primaryGrey-400">Main content card - to be implemented</p>
      </div>
    </div>
  );
}

