"use client";

import React, { Suspense } from "react";
import BusinessProfile from "@/components/business-profile/business-profile";
import { useParams } from "next/navigation";

const BusinessProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useParams();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BusinessProfile personalGuid={userId as string}>
        {children}
      </BusinessProfile>
    </Suspense>
  );
};

export default BusinessProfileLayout;
