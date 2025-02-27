"use client";
import { Suspense } from "react";
import CompanyInformation from "@/components/business-profile/company-details/company-information";
import { useSearchParams } from "next/navigation";

function CompanyInformationPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyInformation userId={userId as string} />
    </Suspense>
  );
}

export default CompanyInformationPage;
