"use client";

import React, { Suspense } from "react";
import CompanyDetails from "@/components/business-profile/company-details";
import { useParams } from "next/navigation";

export default function CompanyDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = useParams();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyDetails userId={userId as string}>{children}</CompanyDetails>
    </Suspense>
  );
}
