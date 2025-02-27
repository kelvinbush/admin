"use client";

import { Suspense } from "react";
import CompanyAddress from "@/components/business-profile/company-details/company-address";
import { useSearchParams } from "next/navigation";

function CompanyAddressPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyAddress userId={userId as string} />
    </Suspense>
  );
}

export default CompanyAddressPage;
